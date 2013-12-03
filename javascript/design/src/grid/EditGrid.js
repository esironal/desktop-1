(function(){
		
	Design.define('Design.grid.EditGrid',{
		extend:'Design.grid.Panel',
		alias: 'widget.editgrid',
		events: {
			"click .design-grid-table td" : "click",
			"mouseover .design-grid-table td" : "mouseover",
			"mouseout .design-grid-table td" : "mouseout"
		},
		/**/
		mouseout: function(t) {
			
			var tdEl = $(t.target).parents('td')[0];
			if (!tdEl) return;
			var cell = Design.getCmp(tdEl.id),editor;
			if (!cell) {
				return;
			}
			editor = cell.editor
			
			if (editor) {
				$(tdEl).removeClass('design-grid-cell-hover');
			}
		},
		mouseover: function(t,t2) {
			var tdEl = $(t.target).parents('td')[0];
			if (!tdEl) return;
			var cell = Design.getCmp(tdEl.id),editor;
			if (!cell) {
				return;
			}
			editor = cell.editor
			
			if (editor && Design.isFunction(editor.beforeOver)) {
				if (!editor.beforeOver.call(this,cell)) {
					return ;
				}
			}
			if (editor) {
				$(tdEl).addClass('design-grid-cell-hover');
			}
			
		},
		updateDataRender: function(m,v) {
			return '<span style = "color: #3366CC">'+v+'</span>';
		},
		click: function(t,t2) {
			var tdEl = $(t.target).parents('td')[0];
			if (!tdEl) return;
			
			var id = tdEl.id, 
				that = this,
				cell = Design.getCmp(id),
				editor;
			if (!cell) {
				return;
			}
			
			editor = cell.editor;
			
			if (editor && Design.isFunction(editor.beforeRender)) {
				if (!editor.beforeRender.call(this,cell)) {
					return ;
				}
			}
			
			var align = $(tdEl).attr('align') || '';
			if (editor) {
				var isDatefield = false;
				editor.id = undefined;
				Design.apply(editor, {
					id: undefined,
					events: {
						'blur .design-field-component': 'inputBlur' 
					}, 
					value: cell.model.get(cell.column.dataIndex),
					
					inputBlur: function() {
						
						if (isDatefield) {
							return;
						}
						var value = this.getValue();
						if (this.validate() && value !== undefined && value != '' && value !=cell.model.get(cell.column.dataIndex)) {
							if (cell.model.set(cell.column.dataIndex, value,true)) {
								if (editor.xtype == 'combobox') {
									editor.data.forEach(function(data) {
										if (value == data[editor.valueField]) {
											value = data[editor.displayField];
										}
									});
								}
								//cell.setContent(that.updateDataRender(cell.model, value), true);
								if (Design.isFunction(editor.afterBlur)) {
									editor.afterBlur.call(this, cell, value);
								}
							}
						}
							this.destroy();
							$(cell.content).show();
						
						
					},
					fieldStyle: {
						width: cell.column.width - 10
					}
				});
				$(tdEl).attr('align', align);
				editor = Design.widget(editor.xtype, editor);
				cell.add(editor);
				editor.focus();
				if(editor.xtype=='datefield'){
						
					editor.on('mousedown', function(){
						isDatefield = true;
					})
					editor.onSelect = function(){
						$('#'+this.id).focus();
						isDatefield = false;
					}
					editor.onBlur = function(){
						$('#'+this.id).focus();
						isDatefield = false;
					}
				}
				
				$(cell.content).hide();
			}
		}
	});
		
})();	
