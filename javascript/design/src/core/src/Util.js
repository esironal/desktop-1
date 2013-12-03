

window.Design = window.Design || {};

(function(Class) {

	/*
		工具类
	*/
	
	function formatNumber (value, pattern) {
		if (typeof value != 'number') {
			return value;
		}
		var sign = '';
		if(value < 0) {
			value = Math.abs(value);
			sign = '-';
		}
		
		var patterns = splitNumberPattern(pattern);
		if (!patterns) {
			return sign+String(value);
		}
		
		if (value == 0 && patterns.length > 2) {
			return sign+formatNumberStyle(value, patterns[2]);
		}
		
		if (value < 0 && patterns.length > 1) {
			return sign+formatNumberStyle(value, patterns[1]);
		}
		
		if (value < 0 && patterns.length == 1) {
			if (patterns[0]) {
				return sign+formatNumberStyle(value, '-' + patterns[0].simplePattern);
			}		
		}
		
		if (value >= 0) {
			return sign+formatNumberStyle(value, patterns[0]);
		}
		
		return sign+String(value);
	}

	function splitNumberPattern (pattern) {
		var patterns = pattern.split(';');
		
		for (var i = 0; i < patterns.length; i++) {
			if (patterns[i]) {
				patterns[i] = parseNumberPattern(patterns[i]);
				if (!patterns[i]) {
					return null;
				}
			}
		}
		
		return patterns;
	}

	function formatNumberStyle (value, pattern) {
		if (!pattern) {
			return '';
		}

		var str = formatNumberSimple(value, pattern.intPattern, pattern.fracPattern);
		str = pattern.prefix + str + pattern.postfix;	
		if (pattern.color) {
			str = str.fontcolor(pattern.color);
		}
		
		return str;
	}

	function formatNumberSimple (value, intPattern, fracPattern) {
		var valueParts = value.toFixed(fracPattern.length).split('.');
		
		// 去掉负号，负号由外部控制
		if (valueParts[0].charAt(0) == '-') {
			valueParts[0] = valueParts[0].substr(1);
		}
		
		var i;
		
		// 左边补零
		i = intPattern.indexOf('0');
		if (i != -1) {
			
			valueParts[0] = valueParts[0].leftPad(intPattern.replace(/,/, '').substr(i).length);
		}
		
		// 处理千位分隔符	
		i = intPattern.lastIndexOf(',');
		if (i != -1) {
			var size = intPattern.length - i - 1, start = valueParts[0].length % size, groups = [];
			
			if (start > 0) {
				groups.push(valueParts[0].substr(0, start));
			}
			while (start < valueParts[0].length) {
				groups.push(valueParts[0].substr(start, size));
				start += size;
			}
			
			valueParts[0] = groups.join(',');
		}

		// 处理小数部分，末尾补零
		if (valueParts.length == 2) {
			valueParts[1] = valueParts[1].rightPad(fracPattern.lastIndexOf('0') + 1);
		}
		
		return valueParts.join('.');
	}

	function parseNumberPattern (pattern) {
		var cache = parseNumberPattern.cache;
		
		if (pattern in cache) {
			return cache[pattern];
		}
		
		var COLOURS = {
			"黑色": "#000000",
			"蓝色": "#0000FF",
			"绿色": "#00FF00",
			"青色": "#00FFFF",
			"红色": "#FF0000",
			"洋红": "#FF00FF",
			"黄色": "#FFFF00",
			"白色": "#FFFFFF"
		};
		
		var re = /\s*(\[([^\]]+)\])?([^#,0\.\[]+)?([#,0]+)(\.([#0]+))?([^#,0\.]+)?\s*/;
		
		// re.exec("[红色]-(#,##0.00)")
		// 0	"[红色]-(#,##0.00)"
		// 1	"[红色]"
		// 2	"红色"
		// 3	"-("
		// 4	"#,##0"
		// 5	".00"
		// 6	"00"
		// 7	")"
		var patternParts = re.exec(pattern);
		if (!patternParts) {
			return null;
		}
		
		cache[pattern] = {
			simplePattern: (patternParts[4] || '') + (patternParts[5] || ''),
			// 整数部分
			intPattern: patternParts[4] || '',
			// 小数部分
			fracPattern: patternParts[6] || '',
			// 前缀
			prefix: patternParts[3] || '',
			// 后缀
			postfix: patternParts[7] || '',
			// 颜色
			color: COLOURS[patternParts[2]] || patternParts[2]
		};
		
		return cache[pattern];
	}
	parseNumberPattern.cache = {};
	
	var pub = {
        throttle: function(method,num,context){ 
            num = num || 100;
            clearTimeout(method.tId); 
            method.tId = setTimeout(function(){ 
                method.call(context); 
            },num); 
        },
		getPaddingMap: function(bodyPadding) {
			var top = 0, right = 0, bottom = 0, left = 0;
			
			if (Design.isNumber(bodyPadding)) {
				paddings = [bodyPadding];
			}
			
			if (Design.isString(bodyPadding)) {
				var paddings = bodyPadding.split(' ');
			}
			if (paddings.length == 1) {
				top = paddings[0];
				right = paddings[0];
				bottom = paddings[0];
				left = paddings[0];
			}
			else if (paddings.length == 2) {
				top = paddings[0];
				right = paddings[1];
				bottom = paddings[0];
				left = paddings[1];
			}
			else if (paddings.length == 3) {
				top = paddings[0];
				right = paddings[1];
				bottom = paddings[2];
				left = paddings[1];
			}
			else if (paddings.length == 4) {
				top = paddings[0];
				right = paddings[1];
				bottom = paddings[2];
				left = paddings[3];
			}
			
			return {left: parseInt(left), right: parseInt(right), top: parseInt(top), bottom: parseInt(bottom)}
		},
		round:function(val){
			val *= 100;
			val = Math.round(val);
			val /= 100;
			return val;
		},
		buildParentCount:function(lst,field, fn){
			var that = this;
			lst.forEach(function(p) {
				if (p.children) {
					if(p.children[0].isTerm) {
						return
					}
					var count = 0, isChild = false;
					that.buildParentCount(p.children, field);
					p.children.forEach(function(item) {
						if (item[field] !== null && item [field] !== undefined) {
							count += parseFloat(item [field]);
							isChild = true;
						}
					})
					if (isChild)
					    p [field] = that.round(count);
				}
			})
		},
		convertWord : function(word){
			word = word.toLowerCase()
			var index = word.indexOf('_')
			if(index<0){
				return word
			}
			word =  word.replace('_','')
			var beginWord = (word.substring(0,index))
			var endWord = word.substring(index,word.length)
			endWord = endWord.substring(0,1).toUpperCase()+endWord.substring(1,endWord.length)
			word = beginWord + endWord
			if(word.indexOf('_')>0)
				word = word.substring(0,word.indexOf('_')) + this.convertWord(word.substring(word.indexOf('_'),word.length))
			return word
		},
		jsonTransf : function(list,isDelete){
			var me = this
			if(!Ext.isArray(list))
				return list
			
			var newList = [];
			list.each(function(v){
				var json = {};
				for(var i in v){
					if(!v[me.convertWord(i)]){
						v[me.convertWord(i)] = v[i];
					}
					json[me.convertWord(i)] = v[i];
				}
                if (me.isArray(v.children)) {
                    json.children = me.jsonTransf(v.children, true);
                }
                
				newList.push(json);
				
			});
			if(isDelete)
				return newList
			return list
		},
		buildTreeJson:function(prentid,jsArr){
			var retArray = []
			for (var i = 0; i < jsArr.length; i++) {
				var obj = jsArr[i];
				//alert(obj.parentId)
				if(!obj.parentId){
					obj.parentId = 0
					//obj['leaf'] = false
					if(!obj['children'])
						obj['children']=[]
				}
				if(prentid == obj.parentId){
					retArray.push(obj);
				}
			}
			for (var i = 0; i < retArray.length; i++) {
				var obj = retArray[i];
				var tmpArr = this.buildTreeJson(retArray[i].id,jsArr); 
				if(tmpArr.length){
					retArray[i]["children"]= tmpArr;
					retArray[i]["leaf"] = false;
				}else{
					retArray[i]["leaf"] = true;
				}
				retArray[i]["text"] = retArray[i].name
				retArray[i]["icon"] = ""
			}
			return retArray;
		},
		formatNumber:function(value, pattern){
			return formatNumber (value, pattern);
		},
		setLoading : function(el,is,text) {
			if( is === false) {
				if ($(el).find('.loading')) {
					setTimeout(function(){
						$(el).find('.loading').remove();
					}, 100);
				}
				return;
			}
			if (!text) {
				text = "数据处理中,请稍后...";
			}
			$(el).append('<div class="loading" style="height:' + $(el).height() + 'px"><div class = "loadDiv"></div> <div align="center" class="loadText"><span class="spinnerSpan" >&nbsp;&nbsp;&nbsp; </span><span>'+text+'</span></div></div>')
		},
	
		addMonths: function(date, diff) {
			var m1 = date.getMonth();
			var y1 = date.getFullYear();
			var m2 = (y1 * 12 + m1 + diff) % 12;
			var y2 = (y1 * 12 + m1 + diff - m2) / 12;

			return new Date(y2, m2, this.getMonthDays(y2, m2));
		},

		getMonthDays: function(y, m) {
			var isLeap = ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);
			var MD = [31,28 + (isLeap ? 1 : 0),31,30,31,30,31,31,30,31,30,31];
			return MD[m];
		},
		dateFormat: function(date, fmt) { 
			var o = {   
				"M+" : date.getMonth()+1,                 //月份   
				"d+" : date.getDate(),                    //日   
				"h+" : date.getHours(),                   //小时   
				"m+" : date.getMinutes(),                 //分   
				"s+" : date.getSeconds(),                 //秒   
				"q+" : Math.floor((date.getMonth()+3)/3), //季度   
				"S"  : date.getMilliseconds()             //毫秒   
			};   
			if(/(y+)/.test(fmt))   
				fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
			for(var k in o)   
				if(new RegExp("("+ k +")").test(fmt))   
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
			return fmt;   
		},
		getNumByPercent: function(value, percent) {
			if (Design.isString(value) && value.indexOf('%') > -1) {
				var v = parseInt(value.substring(0,value.length-1)) / 100;
				return percent * v ;
			}
			else {
				return value - 2;
			}
		},
		getLocation: function (oDiv,event) {
			function getX(obj){   
				var parent = obj;   
				var left=obj.offsetLeft;   
				while(parent = parent.offsetParent){   
					left+=parent.offsetLeft;   
				}   
				return left;
			}
			function getY(obj){   
				var parent = obj;   
				var top = obj.offsetTop;   
				while(parent = parent.offsetParent){   
					top+=parent.offsetTop;   
				}   
				return top;   
			}   
			var top,left;   
			oDiv = $(oDiv);   
			top=getY(oDiv[0]);   
			left=getX(oDiv[0]);
			return {x:(event.clientX-left),y:(event.clientY-top)};
		},
		ajax: function(config) {
			
			var cfg = {
				type: 'POST',
				data: config.params || [],
				url: '',
				async: true,
				success: function(data,textStatus) {
					jQuery('#'+config.update).html(data);
				},
				error: function() {
					
				}
			}
			pub.apply(cfg,config);
			jQuery.ajax(cfg);
		},
		cloneJSON : function(myObj){  
			var me = this
			if (typeof(myObj) != 'object') return myObj;  
			if (myObj == null) return myObj; 
			if (myObj instanceof RegExp) return myObj; 
			
			var myNewObj = new Object(); 
			
			if (Design.isArray(myObj)) {
				var list = []
				myObj.forEach(function(item){
					list.push(me.cloneJSON(item))
				})
				return list
			}
			
			if (Design.isObject(myObj)) {
				for (var i in myObj)  
					myNewObj[i] = me.cloneJSON(myObj[i]);  
					
				return myNewObj
			}
			
		} ,
		encode: function(o) {
			
			var arr = [], b, i, v;
			
			if (pub.isArray(o)) {
				arr.push("[");
				o.forEach(function(c) {
					arr.push(pub.encode(c));
					arr.push(', ');
				});
				if (arr.length > 1) {
					arr.pop();
				}
				arr.push("]");
				
				return arr.join("");
			}
			
			arr.push("{")
			for (i in o) {
				arr.push('"'+i+'": "'+o[i] + '"');
				arr.push(', ');
			}
			if (arr.length > 1)
				arr.pop();
			arr.push("}");
			return arr.join("");
		},
		encodeStyle: function(s){
			if (!s) {
				return '';
			}
			var style = this.cloneJSON(s)
			if (this.isNumber(style.width)) { 
				style.width += 'px'
			}
			if (this.isNumber(style.height)) {
				style.height += 'px'
			}
			var style = this.encode(style);
			style = style.substring(1,style.length-1);
			style = style.replace(/,/g,';');
			style = style.replace(/"/g,'');
			return style;
		},
		/* 复制对象的属性,如果他们不存在 */
		applyIf: function(c1, c2) {
			if (typeof c1 == "object" && typeof c2 == "object") {
				for (var key in c2) {
					if (!c1[key]) {
						c1[key] = c2[key];
					}
				}
			}
			return c1;
		},
		/* 复制对象的属性*/
		apply: function(c1, c2) {
			if (typeof c1 == "object" && typeof c2 == "object") {
				for (var key in c2) {
					c1[key] = c2[key];
				}
			}
			return c1;
		},
		isObject: function(o) {
			return (typeof o == "object");
		},
		isArray: function(o) {
			return (o instanceof Array);
		},
		isFunction: function(o) {
			return (typeof o == "function");
		},
		isString: function(o) {
			return (typeof o == "string");
		},
		isNumber: function(o) {
			return (typeof o == "number");
		},
		/*
			根据字符串类型获取一个类
		*/
		getObject: function(name) {
			if (typeof name !== "string")
				return name
		
			var v = name.split('.'),
				o = window[v[0]],
				i = 1,
				len = v.length;
			
			for (; i < len ; i++) {
				if(!o) return undefined
				o = o[v[i]] ;
			}
			return o;
		},
		/* 定义名字空间 */
		namespace: function(name) {
		
			if(typeof name !== "string" )
				return name
			
			if(name == ""){
				return window;
			}
			var v = name.split('.'),
				o = window[v[0]] = window[v[0]] || {},
				i = 1,
				len = v.length;
			
			for (; i < len ; i++) {
				o = o[v[i]] = o[v[i]] || {};
			}
			return o;
		},
		ns: function(){
			return this.namespace.apply(this,arguments);
		},
		bind: function(fn,context) {
			return function(e) {
				return fn.apply(context, arguments);
			}
		}
	}
	
	
	
	pub.applyIf(Function.prototype, {
		bind: function() {
			return function(context) {
				return this.apply(context, aguments);
			}
		}
	});
	pub.applyIf(Array.prototype,{
		forEach: function(fn,thisObj) {
			var scope = thisObj || window,
				i=0,
				len = this.length;
				
			for (; i < len; i++) {
				fn.call(scope, this[i], i, this);
			}
		},
		filter: function(fn, thisObj) {
			var scope = thisObj || window,
				arr = [],
				i = 0,
				len = this.length;
			
			for (; i < len; i++) {
				if (!fn.call(scope, this[i], i, this)) {
					continue;
				}
				arr.push(this[i]);
			}
			return arr;
		},
		every : function(fn, thisObj){
			var scope = thisObj || window,
				i=0,
				len = this.length,
				bol = false;
				
			for (; i < len; i++) {
				if (!fn.call(scope, this[i], i, this)) {
					return false
				}
			}
			return true
		},
		some: function(fn,thisObj) {
			var scope = thisObj || window,
				i=0,
				len = this.length,
				bol = false;
				
			for (; i < len; i++) {
				if (fn.call(scope, this[i], i, this)) {
					bol = true;
				}
			}
			return bol;
		}
	});
	pub.applyIf(String.prototype, {
		capitalize: function () {
			return this.charAt(0).toUpperCase() + this.substring(1);
		},
		lengthb: function () {
			var len = 0;
			for (var i = 0; i < this.length; i++){
				len++;
				if (this.charCodeAt(i) > 255) {
					len++;
				}
			}
			return len;
		},
		rep: function (num) {
			var str = this;

			if (num <= 0 || !str) {
				return '';
			}

			var buf = [];
			while (true) {
				if (num & 1) {
					buf.push(str);
				}
				if (!(num >>= 1)) {
					break;
				}
				str += str;
			}
			return buf.join('');
		},
		pad: function (size, ch, end) {
			var str = this;

			if (str.length >= size) {
				return str;
			}

			if (!ch) {
				ch = '0';
			} else {
				ch = String(ch);
			}
			var pad = ch.rep(Math.ceil((size - str.length) / ch.length));

			return end ? str + pad : pad + str;
		},
		leftPad: function (size, ch) {
			return this.pad(size, ch, false);
		},
		rightPad: function (size, ch) {
			return this.pad(size, ch, true);
		},
		trim: function () {
			return this.replace(/^\s+|\s+$/g, '');
		},
		isInt: function () {
			return /^[\-+]?(0|([1-9]\d*))$/.test(this);
		},
		isNumber: function () {
			return /^[\-+]?(0|([1-9]\d*))(\.\d*(\dE[\-+]?\d+)?)?$/.test(this);
		},
		isDigits: function () {
			return /^\d+$/.test(this);
		},
		isEmail: function () {
			return (/\b(^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$)\b/gi).test(this);
		},
		isUrl: function () {
			return (/(^(ftp|http|https):\/\/(\.[_A-Za-z0-9-]+)*(@?([A-Za-z0-9-])+)?(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))(:[0-9]+)?([\/A-Za-z0-9?#_-]*)?$)/gi).test(this);
		}
	});
	
	pub.applyIf(Class,pub);
	Class.util = pub;
	
})(Design);



