

Design.define('Design.Compoment',(function(Class){
	
	var eventSplitter = /^(\S+)\s*(.*)$/;
	var resizeCallback = null,
		isWindowResize = false;
	
	/* 为控件添加事件函数 */
	Design.delegateEvents = function(events) {
		if (!events) {
			return;
		}
		for (var key in events) {
			var method = this[events[key]];
			if (!method) {
				throw new Error('Event "' + events[key] + '" does not exist');
			}
			
			var match = key.match(eventSplitter),
				eventName = match[1],
				selector = match[2];
			eventName += '.delegateEvents' + this.cid;
			
			if (selector === '') {
				$(this.el).bind(eventName, Design.bind(method,this));
			} 
			else {
				$(this.el).delegate(selector, eventName, Design.bind(method,this));
			}
		}
	}
	
	function getNumByPercent(value, percent) {
		if (Design.isString(value) && value.indexOf('%') > -1) {
			var v = parseInt(value.substring(0,value.length-1)) / 100;
			return percent * v ;
		}
		else {
			return parseInt(value) - 2;
		}
	}

	function getNumByPx (v){
		if (v === undefined){
			return 0;
		}
		return parseInt(v.substring(0,v.length-2));
	}
	
	return {
		mixins: ['Design.util.Observable'],
		bodyPadding: 0, 
		toolHeight: 0, 
		cutWidth: 0,
		border: 0, 
		initSize: function() {
			this.style = this.style || {};
			this.bodyStyle = this.bodyStyle || {};
			if (!this.width && this.style.width) {
				this.width = this.style.width;
			}
			if (!this.height && this.style.height) {
				this.height = this.style.height;
			}
		},
		
		constructor: function (cfg) {

		    var that = this;
		    this.children = [];
		    if (cfg.items || this.items) {
		        (cfg.items || this.items).forEach(function (item) {
		            item.parent = that;
		            that.children.push(item);
		        })
		    }

		    this.config = cfg;
		    Design.apply(this, cfg);
		    this.initSize();

		    if (!this.el) {
		        this.initElement();
		        var alias = (this.alias || ['widget.']);
		        if (!Design.isArray(alias)) {
		            alias = [alias];
		        }
		        $(this.el).attr('role', alias[0].split('.')[1]);
		        Design.delegateEvents.call(this, this.events);
		    }
		    if (Design.isFunction(this.initialize)) {

		        this.initialize.call(this, this);
		    }
		    if (this.renderTo) {
		        this.render(this.renderTo);
		    }
		},
		getItem: function(i) {
			return this.children[i];
		},
		getChild: function(i) {
			return this.children[i];
		},
		/*获取子项*/
		getItems: function(){
			return this.children;
		},
		/*遍历子项*/
		forEach: function(callback) {
			var i = 0,
				item = null;
			for (; item = this.getItem(i); i++) {
				callback.call(this, item, i);
			}
		},
        
		setHtml: function(html) {
			$(this.bodyEl).html(html);
		},
		on: function(event, fn) {
			var that = this;
			$('#' + this.id).on(event, function() {
				fn.call(that,arguments);
			});
		},
		/* 根据父级控件改变当前的宽高 */
		setStyleByParent: function(where) {
			
			var that = this,
				border = this.border,
				toolHeight = this.toolHeight,
				cutWidth = this.cutWidth,
				bodyPadding = this.bodyPadding * 2 ,
				p_width,p_height,
				paddingMap = Design.getPaddingMap(this.bodyPadding);
			
		    
			
			if (where instanceof Design.Compoment) {
				p_width = getNumByPx($(where.bodyEl).css('width'));
				p_height = getNumByPx($(where.bodyEl).css('height'));
			}
			else {
				
				p_width = getNumByPx($(where).css('width'));
				p_height = getNumByPx($(where).css('height'));
			}
			
			var width = getNumByPercent(this.width, p_width);
			var height = getNumByPercent(this.height, p_height);
			
			
			if (width > p_width) {
				width = p_width ;
			}
			if (height > p_height) {
				//height = p_height ;
			}
			
			
			$(this.el).css('width', width - border + 'px');
			$(this.el).css('height', height - border + 'px');
		
			$(this.bodyEl).css('width', width -  paddingMap.left - paddingMap.right - border - cutWidth + 'px');
			$(this.bodyEl).css('height', height - paddingMap.top - paddingMap.bottom - border - toolHeight + 'px');
			if(this.bodyPadding) {
				
				if (paddingMap.left) {
					$(this.bodyEl).css('padding-left', paddingMap.left);
				}
				if (paddingMap.right) {
					$(this.bodyEl).css('padding-right', paddingMap.right);
				}
				if (paddingMap.top) {
					$(this.bodyEl).css('padding-top', paddingMap.top);
				}
				if (paddingMap.bottom) {
					$(this.bodyEl).css('padding-bottom', paddingMap.bottom);
				}
				//$(this.bodyEl).css('padding', topPadding + 'px ' +  );
			}
		},
		/* 添加子控件 */
		add : function(cmp) {
			cmp.parent = this;
			this.children.push(cmp);
			
			if (cmp instanceof Design.Compoment) {
				cmp.render(this.bodyEl, true);
			}
			else {
				if (!cmp.xtype) {
					cmp.xtype = 'panel';
				}
				cmp = Design.widget(cmp.xtype, cmp);
				cmp.render(this.bodyEl, true);
			}
		},
		initElement: function() {
			this.el = $(Design.template(this.template.join('\n'),{c: this, util: Design.util}))[0];

			this.bodyEl = $(this.el).find('#'+this.id+'-body')[0];
			
			if (!this.bodyEl){
				this.bodyEl = this.el;
			}
		},
		findParentItem: function(name) {
			var el = $(this.el).parents("div[role='"+ name +"']");
			
			if(!el.length) {
				el = $(this.el).find("table[role='"+ name +"']");
			}
			
			if (!el[0]) {
				return null;
			}
			return Design.getCmp(el[0].id);
		},
		findItem: function(name) {
			var el = $(this.el).find("div[role='"+ name +"']") ,
				cmpList = [];
				
			if(!el.length) {
				el = $(this.el).find("table[role='"+ name +"']");
			}
				
			if(el.length == 1) {
				return Design.getCmp(el[0].id);
			}
			else if (!el.length) {
				return null;
			}
			for (var i = 0; i < el.length; i++) {
				cmpList.push(Design.getCmp(el[i].id));
			}
			return cmpList
		},
		initChild: function () {
			for (var i = 0, len = this.children.length; i < len; i++) {
				if (this.children[i] instanceof Design.Compoment) {
					this.children[i].render(this.bodyEl, true);
				}
				else {
					if (!this.children[i].xtype) {
							this.children[i].xtype = 'panel';
					}
					this.children[i] = Design.widget(this.children[i].xtype, this.children[i]);
					this.children[i].render(this.bodyEl, true);
				}
			}
		},
		getParentCmp: function(tag) {
			var id = $(this.el).parents(tag)[0].id;
			return Design.getCmp(id);
		},
		hide: function() {
			$(this.el).hide();
		},
		show: function() {
			$(this.el).show();
		},
		isShow: function() {
			return $(this.el).css('display') == 'block' ? true : false;
		},
		render: function(where, isInit) {
		
		
			var that = this;
			if (!this.el) {
				this.toolHeight = 0,
				this.children = [];
				this.constructor(this.config);
			}
			this.initChild();
			
			if(where && !Design.isFunction(where)){
				this.pEl = where;
				
				if (where == 'body' && Design.isString(this.width) && this.width.indexOf('%') > -1) {
			
					if (!resizeCallback) {
						resizeCallback = function() {
							that.onResize();
						}
					}
					//$(window).unbind('resize', resizeCallback);
					$(window).bind('resize', resizeCallback);
					isWindowResize = true;
				}
				
				$(where).append(this.el);
				
				this.onResize();
				if (Design.isFunction(this.afterInit)){
					this.afterInit.call(that,that);
				}
				
			}
			else if (Design.isFunction(where)) {
				where.call(that, this.el);
				if (Design.isFunction(this.afterInit)){
					this.afterInit.call(that,that);
				}
			}
			
			
			if (!isInit) {
				this._afterRender();
			}
			
			return this.el;
			
		},
		_afterRender: function() {
			this.forEach(function(item) {
				if (Design.isFunction(item._afterRender)) {
					item._afterRender.call(item);
				}
			});
			if(Design.isFunction(this.afterRender)){
				this.afterRender.call(this);
			}
		},
		remove: function() {
			$(this.el).remove();
			var that = this;
			
			if (this.parent && this.parent.children) {
				var pChildren = this.parent.children
				pChildren.every(function(v,i){
					if(v == that){
						pChildren.splice(i,1)
						return false
					}
					return true
				});
			}
			this.el = null;

			this.fireEvent("destroy");
		},
		destroy: function () {
		    this.remove.apply(this);
		},
		addClass: function(cls) {
			$(this.el).addClass(cls);
		},
		removeClass: function (cls) {
			$(this.el).removeClass(cls);
		},
		setStyle: function(k, v) {
			$(this.el).css(k, v);
		},
		getStyle: function(k) {
			$(this.el).css(l);
		},
		setWidth: function(width) {
			$(this.el).css('width', width);
		},
		focus: function() {
			$(this.el).focus();
		},
		setHeight: function(height) {
			$(this.el).css('height', height);
		},
		getWidth: function(width) {
			return getNumByPx($(this.el).css('width'));
		},
		getHeight: function(height) {
			return getNumByPx($(this.el).css('height'));
		},
		getParent: function(p){
			return Design.getCmp($(this.el).parent(p)[0].id);
		},
		resize: function(width, height) {
			this.width = width;
			this.height = height;
			
			if (isWindowResize && Design.isString(this.width) && this.width.indexOf('%') > -1) {
				isWindowResize = false;
			}
			else {
				$(window).unbind('resize', resizeCallback);
			}
			
			this.onResize();
		},
		onResize: function() {
			this.setStyleByParent($(this.el).parent());
			this.forEach(
				function(item) {
					if (item.onResize) {
						item.onResize();
					}
				}
			);
		}
	};
})(Design));