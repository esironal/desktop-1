
var Design = Design || {};

(function(Class) {
	
	function throttle(method,num,context){ 
		num = num || 100;
		clearTimeout(method.tId); 
		method.tId = setTimeout(function(){ 
			method.call(context); 
		},num); 
	}
	
	function selectstart (isSelect){
		if (typeof(document.onselectstart) != "undefined") {        
			// IE下禁止元素被选取        
			document.onselectstart = new Function("return "+isSelect);        
		} else {
			// firefox下禁止元素被选取的变通办法        
			document.onmousedown = new Function("return "+isSelect);        
			document.onmouseup = new Function("return true");        
		}
	}
	
	Class.throttle = throttle;
	Class.selectstart = selectstart;
	
	Design.isReady = false;
	Class.template = function(result, data) {
		var template = TrimPath.parseTemplate(result);
		return template.process(data);
	}
	Class.drag = {};
	Class.drag.Move = function(config) {
	    
		var isDown = false, top, left;
		window["z-index"] = window["z-index"] + 1 || 100;
		$(config.moveEl).css('position', 'absolute');
		$(config.moveEl).css('left', '100');
		$(config.moveEl).css('top', '100');
		$(config.moveEl).css('z-index', window["z-index"]);
	
		$(config.eventEl).mousedown(function(event){
			
			Design.selectstart(false); 
			isDown = true;
			
			var xx = event.screenX; 
			var yy = event.screenY; 
			
			top = $(config.moveEl).css('top').replace('px', '') - yy;
			left = $(config.moveEl).css('left').replace('px', '') - xx;
			if (config.onMouseDown) {
				config.onMouseDown();
			}
		});
		$(config.eventEl).mouseup(function(){
			isDown = false;
			Design.selectstart(true); 
			if (config.onMouseUp) {
				config.onMouseUp();
			}
		});
		$(document).on('mousemove',function(event){
			if (!isDown) {
				return;
			}
			var xx = event.screenX;
			var yy = event.screenY;
			if (config.onMove) {
				config.onMove();
			}
			Design.throttle(function() {
				if (isDown) {
					$(config.moveEl).css('top', (yy + top) + 'px');
					$(config.moveEl).css('left', (xx + left) + 'px');
				}
			},20);
		});
		
		
	}
	
	Class.resize = function(config) {
		
		var that = config.cmp, $right = $(that.el).find('.design-resize-right'),
			$left = $(that.el).find('.design-resize-left'),
			$bottom = $(that.el).find('.design-resize-bottom'),
			$right_bottom = $(that.el).find('.design-resize-right-bottom'),
			$left_bottom = $(that.el).find('.design-resize-left-bottom'),
			isDown = false, 
			seat = '',
			top, 
			left,
			bottom,
			widthValue,
			heightValue,
			panelWidth;
		
		var setValue = function(event, v) {
			isDown = true;
			seat = v;
			left = event.pageX;
			top = event.pageY;
			panelWidth = that.getWidth();
			panelHeight = that.getHeight();
			Design.selectstart(false);
		}
	
		$right.mousedown(function(event){
			setValue(event, 'right');
		});
		$left.mousedown(function(event){
			setValue(event, 'left');
		});
		$bottom.mousedown(function(event){
			setValue(event, 'bottom');
		});
		$right_bottom.mousedown(function(event){
			setValue(event, 'right-bottom');
		});
		$left_bottom.mousedown(function(event){
			setValue(event, 'left-bottom');
		});
		
		$('body').mouseup(function(){
			if (!isDown)
				return;
			isDown = false;
			Design.selectstart(true);
			Design.throttle(function() {
				
				if (config.onBeforeMouseUp) {
					config.onBeforeMouseUp();
				}
				that.resize(widthValue, heightValue);
				if (config.onMouseUp) {
					config.onMouseUp();
				}
				
				
			})
		});
		
		$('body').on('mousemove',function(event){
			if (!isDown) {
				return;
			}
			if (config.onMove) {
				config.onMove();
			}
			var thatLeft = event.pageX;
			var thatTop = event.pageY;
			Design.throttle(function() {
				if (!isDown) {
					return;
				}
				if (seat == 'right') {
					widthValue = panelWidth + thatLeft - left;
					heightValue = undefined;
					$(that.el).css('width', widthValue - 4 + 'px');
				}
				else if (seat == 'left') {
					widthValue = panelWidth + left - thatLeft;
					heightValue = undefined;
					$(that.el).css('width', widthValue - 4 + 'px');
					$(that.el).css('left', thatLeft)
				}
				else if (seat == 'bottom') {
					widthValue = undefined;
					heightValue = panelHeight + thatTop - top;
					$(that.el).css('height', heightValue - 4 + 'px');
				}
				else if (seat == 'right-bottom') {
					widthValue = panelWidth + thatLeft - left;
					heightValue = panelHeight + thatTop - top;
					$(that.el).css('height', heightValue - 4 + 'px');
					$(that.el).css('width', widthValue - 4 + 'px');
				}
				else if (seat == 'left-bottom') {
					widthValue = panelWidth + left - thatLeft;
					heightValue = panelHeight + thatTop - top;
					$(that.el).css('height', heightValue - 4 + 'px');
					$(that.el).css('width', widthValue - 4 + 'px');
					$(that.el).css('left', thatLeft)
				}
				
			});
		});
	}
	
	
})(Design);


