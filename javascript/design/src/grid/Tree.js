(function(){
		
		
		function addImageEvent(img,store) {
			
			var that = this;
			$(img).click(function(e) {
				var start = new Date;
				var row = Design.getCmp($(this).parents('tr')[0].id);
				
				if ($(this).hasClass('icon-grid-minus')) {
					row.model.set('expanded', false, true);
					return;
				}
				
				row.model.set('expanded', true, true);
				//alert(new Date - start);
			});
		}
		
		
		
		Design.define('Design.grid.Tree',{
			extend:'Design.grid.EditGrid',
			alias: 'widget.treepanel',
			className: 'Treegrid',
			addEventMap: function(model, fn) {
				this.modelEventMap[model.get('modelId')] = this.modelEventMap[model.get('modelId')] || [];
				this.modelEventMap[model.get('modelId')].push(fn);
			},
            expand: function() {
                $(this.el).find('.icon-grid-plus').each(function(img) {
                    if (!$(this).hasClass('icon-grid-minus')) {
                        $(this).trigger('click');
                    }
                });
            },
            fold: function() {
                this.store.models.forEach(function(model) {
                    model.set('expanded', false);
                })
            },
            
			getRows: function(store, columns, layer) {

				var rows = [],
					that = this,
					row = Design.widget('gridrow');
				
				if (!layer) {
					layer = 0;
				}
				
				store.forEach(function(model) {
					var row = Design.widget('gridrow', {
						model: model
					});
					rows.push(row);
					function updateCell(ename, key, value){
						row.forEach(function(item) {
							if (item.column.dataIndex == key) {
								if (value !== null && value !== undefined) {
									item.setContent(value, true);
								}
							}
						});
					}
					
					function deleteRow() {
						row.remove();
					}
					model.addEvent('update', updateCell);
					
					model.addEvent('delete', deleteRow);
					
					
					columns.forEach(function(column) {
						row.add(that.getCell(model, column, layer, row));
					});
					if (!model.get('children')) {
						return;
					}
					function updateExpand(ename, key, value) {
			
						var hideAll = function(row) {
							$(row.el).find('.icon-grid-plus').removeClass('icon-grid-minus');
							if(row.childRows){
								row.childRows.forEach(function(c_row) {
									c_row.hide();
									$(c_row.el).find('.icon-grid-plus').removeClass('icon-grid-minus');
									hideAll(c_row);
								});
							}
						}
						if (key != 'expanded') {
							return;
						}
						$(row.el).find('.icon-grid-plus').addClass('icon-grid-minus');
						if (!value) {
							hideAll(row);
							return;
						}
						else {
							if(!row.childRows){
								row.childRows = that.getRows(model.get('children'), columns, layer + 1);
								for (var i = row.childRows.length - 1; i >= 0; i--) {
									row.childRows[i].parentRow = row;
									row.childRows[i].render(function (el) {
										$(row.el).after(el);
									}, true);
								}
							}
							row.childRows.forEach(function(c_row) {
								c_row.show();
								c_row.getChild(0);
								if (c_row.model.get('expanded') && that.isAfterRender) {
									that.setModelExpand(c_row.model);
									that.expandChildren(c_row.model.get('children'));
								}
							});
						}
					}
					model.addEvent('update', updateExpand);
					
					that.addEventMap(model,updateCell);
					that.addEventMap(model,deleteRow);
					that.addEventMap(model,updateExpand);
				});
				return rows;
			},
			setModelExpand: function(model) {
				if (model.get('expanded')) {
					model.set('expanded', true, true);
				}
			},
			expandChildren: function(children) {
				var that = this;
				children.forEach(function (model) {
					that.setModelExpand(model);
					if (model.get('expanded') && model.get('children')) {
						that.expandChildren(model.get('children'));
					}
				});
				
			},
			
			afterRender: function() {
				this.isAfterRender = false;
				this.expandChildren(this.store);
				this.isAfterRender = true;
			},
			getCell: function(model, column, layer, row) {
				var cell = Design.grid.Tree.superclass.getCell.apply(this,[model,column]) ;
				
				if (!column.treeColumn) {
					return cell;
				}
				
				if (model.isParent()) {
					
					var span = document.createElement('span');
					
					$(span).addClass('icon-grid-plus');
					$(span).css({float:'left'});
					$(cell.bodyEl).prepend(span);
					addImageEvent.call(this,span,model.get('children'));
					
					$(cell.bodyEl).find('.treeText').dblclick(function(){
						$(span).trigger('click');
					})
				}
				else {
					var layerTag = document.createElement('div'),
						layerstr = "";
					
					$(layerTag).css({float:'left','margin-top':0});
					
						layerstr += "&nbsp;&nbsp;&nbsp;&nbsp;"
					
					layerTag.innerHTML = layerstr;
					$(cell.bodyEl).prepend(layerTag);
				}
				
				if (layer) {
					var layerTag = document.createElement('div'),
						layerstr = "";
					
					$(layerTag).css({float:'left','margin-top':5});
					for (var i = 0; i < layer; i++) {
						layerstr += "&nbsp;&nbsp;&nbsp;&nbsp;"
					}
					layerTag.innerHTML = layerstr;
					$(cell.bodyEl).prepend(layerTag);
				}
				
				return cell;
				
			}
		});
		
})();	
