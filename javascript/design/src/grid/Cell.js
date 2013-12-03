
Design.define('Design.grid.Cell',{
	extend:'Design.Compoment',
	alias: 'widget.gridcell',
	tag: 'td',
	//initChild: function() {},
	initElement: function() {
		this.el = document.createElement(this.tag);
		this.bodyEl = document.createElement('div');
		$(this.bodyEl).addClass('cell-inner')
		var column = this.column, 
			model = this.model;
		$(this.bodyEl).css({height:30,'line-height':'30px'});
	
		if (column.align) {
			this.el.align = column.align;
		}
		this.el.appendChild(this.bodyEl);
		this.el.id = this.id;
		if (this.column.columns) {
			$(this.el).attr('colspan', this.column.columns.length);
		} 
		else {
			if (this.column.isGroupHeader) {
				$(this.el).attr('rowspan', 2);
			}
		}
		
		var text = $(document.createElement('span'));
		
		this.bodyEl.appendChild(text[0])
		this.content = text[0];
		text.addClass('cell-text');
		if (column.treeColumn) {
			text.addClass('treeText');
		}
		
		this.setContent(model.get(column.dataIndex));
	},
	updateDataRender: function(v) {
		return '<span style = "color: #3366CC">' + v + '</span>';
	},
	setContent: function(v, isChange) {
		
		if(Design.isFunction(this.column.renderer)) {
		
			var value = this.column.renderer.call(this, this.model, v, this);
			if (isChange) {
				$(this.content).html(this.updateDataRender(value));
			}
			else {
				$(this.content).html(value);
			}
		}
		else {
			$(this.content).html(v);
		}
		
	},
	template: [
		'<td  id="${c.id}" style="background:red" >', 
			'text',
		'</td>'
	],
	onResize: function(){}
});