
Design.define('Design.grid.Row',{
	extend:'Design.Compoment',
	alias: 'widget.gridrow',
	initialize: function(cfg) {		
		
	},
	initElement: function() {
		this.bodyEl = this.el = document.createElement('tr');
		this.el.id = this.id;
	},
	template: [
		'<tr id = "${c.id}">',

		'</tr>',
	],
	toString: function() {
		return '[Object Row]';
	},
	onResize: function(){}
});