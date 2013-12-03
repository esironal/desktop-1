Design.define('Design.Container',{
	extend:'Design.Compoment',
	alias: 'widget.container',
	initialize: function(cfg) {
		
	},
	template: [
		'<div id="${c.id}" name="${c.name}" class="container" style="${util.encodeStyle(c.style)};line-height: 0;" >',
			
		'</div>'
	],
	onResize: function() {}
});
