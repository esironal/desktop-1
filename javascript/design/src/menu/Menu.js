
Design.define('Design.menu.Menu',{
	extend:'Design.Compoment',
	alias: 'widget.menu',
	events: {
		'click li': 'click'
	},
	click: function(e) {
	
		var index = $(e.target).attr('item');
		if (this.items[index].handler) {
			this.items[index].handler.call(this);
		}
	},
	initChild: function() {},
	initialize: function(cfg) {
		var that = this;
		$('body').click(function() {
			
			$(that.el).css('left', -999);
			$(that.el).css('top', -999);
		});
		
	},
	toString: function() {
		return "[object Design.menu.Menu]"
	},
	showAt: function(el,x,y) {
	
		if(Design.isObject(x)) {
			y = x.y;
			x = x.x;
		}
	
		this.render(el);
		$(this.el).css('left', x);
		$(this.el).css('top', y);
	},
	template: [
		'<div class="rightMenu">', 
			'<ul >',
				'{for item in c.items}',
					'<li item = "${item_index}" style = "${util.encodeStyle(c.style)}">${item.text}</li>',
				'{/for}',
			'</ul>',
		'</div>'
	]
});