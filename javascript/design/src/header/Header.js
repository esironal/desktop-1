
Design.define('Design.header.Header',{
	extend:'Design.Compoment',
	alias: 'widget.header',
	events: {
	    'click .close': 'close',
		'click .min': 'min'
	},
	close: function() {
		this.fireEvent('close');
	},
	min: function () {
	    this.fireEvent('min');
	},
	setText: function(text) {
		$(this.el).find('.panel-header-title').html(text);
	},
	initialize: function(cfg) {
	},
	template: [
		'<div id="${c.id}" class="design-modal-header" style="${util.encodeStyle(c.style)};height:30px">', 
			'<div id="${c.id}-body" style = "line-height: 30px;padding-left:10px;" class="design-panel-header-title">',
				'<span class= "panel-header-title">${c.text}</span>',
				'{if c.drag}',
					'<a sign="" class="min" style="" id="ext-gen8">-</a>',
					'<a sign="" class="close" style="" id="ext-gen8">x</a>',
				'{/if}',
			'</div>',
		'</div>',
	]
});