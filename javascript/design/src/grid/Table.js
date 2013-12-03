
Design.define('Design.grid.Table',{
	extend:'Design.Compoment',
	alias: 'widget.gridtable',
	initialize: function(cfg) {		
		
	},
	onResize: function(){},
	template: [
		'<table  cellspacing="0" style="${util.encodeStyle(c.style)}"  cellpadding="0" id="${c.id}" class="design-grid-table">',
			'<colgroup >',
				'${c.colgroup}',
			'</colgroup>',
			'<tbody id = "${c.id}-body">',
				
			'</tbody>',
		'</table>',
	]
});