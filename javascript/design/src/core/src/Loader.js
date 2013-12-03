
(function(Class) {
	/* 文件路径与转换名 */
	var path = {name: 'Design', replaceName: ''};
	var requires = [];
	
	Class.onReady = function(callback) {
		
		$(document).ready(function() {
			Class.getscript(requires,function() {
				Design.ready = true;
				callback.call(window);
			});
		});
	};
	/* 导入类方法 */
	var require = function (urls) {
		requires = urls;
	}
	
	var tagMap = {};
	
	var addScriptTag = function(url) {
		
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		
		script.onload = function() {
			script.onreadystatechange = function(){};
		};
		script.onerror = function() {
			throw new Error(" require Errors url = " + url);
		};
		script.onreadystatechange = function() {
			if (this.readyState === 'loaded' || this.readyState === 'complete') {
				script.onload = function(){};
			}
		};
		document.getElementsByTagName('head')[0].appendChild(script);
		
		
	}
	
	var getscript = function(urls, callback) {
		
		if (!Class.isArray(urls)) {
			urls = [urls];
		}
		
		var intervalId = setInterval(function(){
			var isOk = true;
			urls.forEach(function(u) {
				if(!Class.getObject(u)){
					isOk = false;
				}
			});
			if (isOk){
				clearInterval(intervalId);
				if (callback) {
					callback.call(window);
				}
			}
		},15)
		
		urls.forEach(function(url) {
			if(!url) return
			if (tagMap[url]) {
				return;
			}
			tagMap[url] = true;
			//console.log(url);
			var name = url;
			url = url.substring(path.name.length, url.length);
			url = path.replaceName + url.replace(/\./g,'/')+'.js?id='+ Math.random();
			
			addScriptTag(url);
		});
	};
	
	var pub = {
	    /*设置路径*/
		setPath: function(o, n) {
			if (n == "js/design/src") {
				n = "/alm/js/design/src"
			}
			path.name = o;
			path.replaceName = n;
			
			
		}
	}
	Class.Loader = pub;
	Class.require = require;
	Class.getscript = getscript;
})(Design);

