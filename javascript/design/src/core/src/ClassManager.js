
(function(Class) {
	
	var widgetMap = {},
		util = Class.util,
		cmpMap = {},
		requMap = {};

	/*
		继承
	*/
	function extend(subClass,superClass) {
		var F = function(){};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		util.applyIf(subClass.prototype,new F())
		subClass.prototype.constructor = subClass;
		
		if (superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass;
		}
		/*
			为子类添加静态属性 superclass 指向父类
		*/
		subClass.superclass = superClass.prototype;
	}
	
	/*
		添加别名到 widgetMap 对象中
	*/
	function setWidget(name,cls) {
		var n = name;
		if (name.indexOf('widget.') > -1) {
			n = name.substring(7,name.length);
		}
		widgetMap[n] = cls;
	}
	
	function getRequireList(cfg) {
		var requireList = [];
		if (cfg.extend && !util.getObject(cfg.extend)) {
			requireList.push(cfg.extend);
		}
		if (cfg.requires) {
			if (!util.isArray(cfg.requires)) {
				cfg.requires = [cfg.requires];
			}
			cfg.requires.forEach(function(item) {
				if (!util.getObject(item)) {
					requireList = requireList.concat(item);
				}
			});
		}

		if (cfg.mixins) {
			if (!util.isArray(cfg.mixins)) {
				cfg.mixins = [cfg.mixins];
			}
			cfg.mixins.forEach(function(item) {
				if (!util.getObject(item)) {
					requireList = requireList.concat(item);
				}
			});
		}
		
		return requireList;
	}
	
	function define (name ,cfg) {
			
		/*
			获取当前字符串name的变量
		*/
		var nameArr = (name).split('.'),
			lastName = nameArr.pop(),
			thatClass = util.ns(nameArr.join('.')),
			
			parentClass = util.ns(cfg.extend);
			
		/*
			当前为单例模式时
		*/
		if (cfg.singleton === true) {
			var F = function() {};
			thatClass = thatClass[lastName] = new F();
			util.apply(thatClass, cfg);
			
			return;
		}
		
		/*
			创建对象 cfg.constructor 为构造函数
		*/
		if (cfg.constructor !== Object) {
			thatClass = thatClass[lastName] = cfg.constructor;
			delete cfg.constructor;
		}
		else {
			thatClass = thatClass[lastName] = function() {
				if (parentClass) {
					parentClass.prototype.constructor.apply(this,arguments)
				}
			};
		}
		/*
			混入
		*/
		if (cfg.mixins) {
			cfg.mixins.forEach(function(mixin) {
				extend(thatClass,util.getObject(mixin));
			});
		}
		
		/*
			当cfg里配置了父类时继承
		*/
		
		if (cfg.events && thatClass.prototype.events) {
			util.apply(cfg.events, thatClass.prototype.events);
		}
		if (parentClass) {
			if (parentClass.prototype.events && cfg.events) {
				util.applyIf(cfg.events,parentClass.prototype.events);
			}
			
			extend(thatClass,parentClass);
			
			if (util.isFunction(parentClass.prototype.onClassExtended)) {
				parentClass.prototype.onClassExtended.call(thatClass, thatClass, cfg);
			}
		}
		/*
			将配置中的属性与方法添加到类中
		*/
		util.apply(thatClass.prototype, cfg);
		
		/*
			类的一些基本属性与方法
		*/
		thatClass.className = name;
		thatClass.prototype.className = name;
		thatClass.AUTO_ID = 1;
		/*
			当配置alias属性为当前类配置别名
			调用setWidget(name,class) 将别名与当前类添加到map中 
		*/
		if (cfg.alias) {
			if (util.isArray(cfg.alias)) {
				cfg.alias.forEach(
					function(it) {
						if (util.isString(it)) {
							setWidget(it, thatClass);
						}
						else {
							throw new Error("define argument 'alias' type Error");
						}
					}
				);
			}
			else if (util.isString(cfg.alias)) {
				setWidget(cfg.alias, thatClass);
			}
			else {
				throw new Error("define argument 'alias' type Error");
			}
		}
		
	}
	
	var count = 0;
	var pub = {
		/*
			使用字符串格式名称创建类
		*/
		getCmp: function(id) {
			return cmpMap[id];
		},
		create: function(name, cfg, notAutoId) {
			cfg = cfg || {};
			var clazz = util.getObject(name);
			if (clazz === undefined) {
				throw new Error("class: " + name + " is undefined");
			}
			var nameArr = name.split('.');
			if (!cfg.id && notAutoId !== true) {
				cfg.id = nameArr[nameArr.length - 1].toLowerCase() + '-' + clazz.AUTO_ID++;
			}
			cmpMap[cfg.id] = new clazz(cfg);
			return cmpMap[cfg.id];
		},
		/*
			使用别名创建一个类
		*/
		widget: function(name, cfg, notAutoId) {
			cfg = cfg || {};
			var clazz = widgetMap[name];
			if (clazz === undefined) {
				throw new Error("class: " + name + " is undefined");
			}
			if (!cfg.id && notAutoId !== true) {
				cfg.id = name + '-' + clazz.AUTO_ID++;
			}
			cmpMap[cfg.id] = new clazz(cfg);
			return cmpMap[cfg.id];
		},
		/*
			声明一个类
		*/
	    define: function(name, cfg) {
			
		
			/*
				判断页面是否加载完毕，完毕的话讲跳过动态加载js
			*/
			if(Class.ready) {
				define(name, cfg);
				return;
			}
			
			var requires = getRequireList(cfg); 
		
			if (requires.length) {
				Class.getscript(requires, function() {	
					define(name, cfg);
				});
			}
			else {
				define(name, cfg);
			}
		}
		
	}
	
	util.applyIf(Class,pub);
})(Design);
