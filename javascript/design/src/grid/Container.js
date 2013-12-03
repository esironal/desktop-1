
Design.define('Design.grid.Container',{
	extend:'Design.Compoment',
	alias: 'widget.gridcontainer',
	initialize: function(cfg) {		
		
	},
	template: [
		'<div id="${c.id}" class="design-grid-container ${c.cls} " style = "${util.encodeStyle(c.style)}">',
			
		'</div>'
	]
});
