
(function() {
	var isCtrl = false;
	$(document).keydown(function(event){
		if(event.ctrlKey){
			isCtrl = true;
		}
	})
	$(document).keyup(function(event){
		if(event.keyCode==17){
			isCtrl = false;
		}
	})
	var addScrollEvent = function(el){
		
		var header  = $(el).find('.container-right-header table');
		var lockedItem = $(el).find('.container-left-body table');
		$(el).find('.container-right-body').scroll(function(){
			var scrollLeft = parseInt(this.scrollLeft);
			var scrollTop =  parseInt(this.scrollTop);
			if(header[0])
				header[0].style.left = (-scrollLeft)+'px';
			if(lockedItem[0])
				lockedItem[0].style.top=(-scrollTop)+'px';
		});
	}
	
	Design.define('Design.grid.Panel',{
		extend:'Design.panel.Panel',
		alias: 'widget.grid',
		columnHeight: 31,
		className: 'gridPanel',
		requires: ['Design.grid.Row', 'Design.grid.Cell', 'Design.grid.Container', 'Design.grid.Table', 'Design.data.Store', 'Design.data.Model'],
		
		events: {
			"click .container-left-body  tr" : "itemSelect",
			"click .container-right-body  tr" : "itemSelect"
		},
		selectList: [],
        indexList: [],
        setSelect: function(indexs) {
            var that = this;
            that.selectList = [];
            indexs.forEach(function(index) {
                $(that.bodyEl).find('.container-left-body').find('tr:eq('+index+')').toggleClass('grid-row-select');
                $(that.bodyEl).find('.container-right-body').find('tr:eq('+index+')').toggleClass('grid-row-select');
                that.selectList.push(Design.getCmp($(that.bodyEl).find('.container-left-body').find('tr:eq('+index+')')[0].id).model);
            });
            this.indexList = indexs;
            if (Design.isFunction(this.onItemSelect)) {
				this.onItemSelect(this.selectList,{}, this.indexList);
			}
        },
		itemSelect: function(event) {
		
			if (!this.stripeRows) {
				return;
			}
			
			this.targetCell = $(event.target).parents('td')[0];
			
			var trEl = $(event.target).parents('tr[role=gridrow]')[0], index;
			if (!trEl) {
				return;
			}
			
			$(trEl).parents('table').find('tr').each(function(i, row) {
				if (row === trEl) {
					index = i;
				}
			});
			if (isCtrl) {
				$(this.bodyEl).find('.container-left-body').find('tr:eq('+index+')').toggleClass('grid-row-select');
				$(this.bodyEl).find('.container-right-body').find('tr:eq('+index+')').toggleClass('grid-row-select');
                var repeat = null
                this.indexList.forEach(function(i,indx) {
                    if (i == index) {
                        repeat = indx
                    }
                    
                });
                if (repeat !== null) {
                    this.indexList.splice(repeat, 1);
                    this.selectList.splice(repeat, 1);
                }
                else {
                    this.indexList.push(index);
                    this.selectList.push(Design.getCmp(trEl.id).model);
                }
			}
			else {
				this.selectList = [];
                this.indexList = [];
				$(this.bodyEl).find('tr').removeClass('grid-row-select');
				$(this.bodyEl).find('.container-left-body').find('tr:eq('+index+')').toggleClass('grid-row-select');
				$(this.bodyEl).find('.container-right-body').find('tr:eq('+index+')').toggleClass('grid-row-select');
                this.indexList.push(index);
                this.selectList.push(Design.getCmp(trEl.id).model);
			}
			
			if (Design.isFunction(this.onItemSelect)) {
				this.onItemSelect(this.selectList, event, this.indexList);
			}
		},
		modelEventMap: {},
		
		initColumns: function(cfg) {
			this.page = cfg.page || 0;
			this.modelEventMap = {};
			if (cfg.manyColumns && cfg.manyColumns.length) {
				this.columns = cfg.columns = cfg.manyColumns[this.page];
			}
			else {
				this.columns = cfg.columns = this.columns || [];
			}
			this.isGroupHeader = cfg.columns.some(function(column) {
				if (column.columns){
					return true;
				}
				return false;
			});
			
			if (this.isGroupHeader) {
				this.columnHeight *= 2;
			}
		},
		/* ��û������Storeʱ���data����Store */
		makeStore: function(data) {
			var that = this;
			
			Design.define(this.id + '-model', {
				extend: 'Design.data.Model',
				fields: (function() {
					var list = [];
					for (key in data[0]) {
						list.push({name: key, type: 'string'});
					}
					return list;
				})()
			});
			
			
			return Design.create('Design.data.Store', {
				model: that.id + '-model',
				data: data
			});
		},
		/*��ʼ��*/
		initialize: function(cfg) {		
	
			if (!this.store && this.data) {
				this.config.store = this.store = this.makeStore(this.data);
                if (this.afterInitStore) {
                    this.afterInitStore(this.store);
                }
			}
			
			this.initColumns(cfg);
			this.setChild();
			Design.grid.Panel.superclass.initialize.call(this,cfg);
		},
		removeStoreAllEvent: function(models) {
			var that = this;
			models.forEach(function (model) {
				
				(that.modelEventMap[model.get('modelId')] || []).forEach(function(event) {
					model.unEvent('update', event);
					model.unEvent('delete', event);
					if (model.get('children')) {
						that.removeStoreAllEvent(model.get('children'));
					}
				});
			});
		},
		/*��ɱ��*/
		setChild: function() {
			this.addFireEvent();
			this.children.push(this.getColumnLeft(this.columns, this.store));
			this.children.push(this.getColumnRight(this.columns, this.store));
			this.children.push(this.getDataLeft(this.columns, this.store));
			this.children.push(this.getDataRight(this.columns, this.store));
		},
		getStore: function() {
			return this.store;
		},
		bindManyColumns: function(columns) {
			this.config.manyColumns = columns;
			//this.redraw();
		},
		bindStore: function(store, columns) {
		
			if (Design.isArray(store)) {
				store = this.makeStore(store);
			}
			
			this.store = store;
			this.columns = columns || this.columns;
			this.redraw();
		},
		setPage: function(page) {
			
			this.config.page = page;
			this.redraw();
		},
		redraw: function() {
			var that = this;
			this.children = [];
			this.toolHeight = 0;
			$(this.bodyEl).html('');
			Design.setLoading(this.bodyEl);
			
			setTimeout(function() {
				that.removeStoreAllEvent(that.store);
				that.initialize(that.config);
				that.initChild();
				that.onResize();
				addScrollEvent(that.bodyEl);
				if (that.afterRender) {
					that.afterRender();
				}
				Design.setLoading(that.bodyEl, false);
			}, 1);
			
		},
		addFireEvent: function() {
			var that = this;
			if(!this.addFn) {
				this.addFn = function(ename, model) {
					var rows = that.getRows([model], that.columns.filter(function(column) {
						return column.locked === true;
					}));
					rows.forEach(function(row){
						that.children[2].getChild(0).add(row);
					});
					
					var rows = that.getRows([model], that.columns.filter(function(column) {
						return column.locked !== true;
					}))
					rows.forEach(function(row){
						that.children[3].getChild(0).add(row);
					});
				}
			}
			else {
				this.store.unEvent('insert', this.addFn);
			}
			
			if (this.store) {
				this.store.addEvent('insert', this.addFn);
			}
			
			if(!this.sortFn) {
				this.sortFn = function(ename, model) {
					that.bindStore(that.store);
				}
			}
			else {
				this.store.unEvent('sort', this.sortFn);
			}
			
			if (this.store) {
				this.store.addEvent('sort', this.sortFn);
			}
		},
		
		getDataRows: function() {
			return this.children[3].getChild(0).children;
		},
		onResize: function() {
			this.setStyleByParent($(this.el).parent());
			this.forEach(
				function(item) {
					item.onResize();
				}
			);
			
			var height = this.getHeight() - this.toolHeight - this.bodyPadding*2;
			var width = this.getWidth() - this.bodyPadding*2;
			
			this.children[2].setHeight(height - this.columnHeight);
			this.children[3].setHeight(height - this.columnHeight);
			this.children[1].setWidth(width - this.columnLeftWidth);
			this.children[3].setWidth(width - this.columnLeftWidth);
		},
		afterInit: function() {
			addScrollEvent(this.bodyEl);
			Design.grid.Panel.superclass.afterInit.call(this);
		},
		
		getCell: function(model,column) {
			var that = this;
			if (column.editor) {
			
				var editor = Design.apply({},Design.cloneJSON(column.editor));
				var items = [];
				//editor.handler = function(){
				//	column.editor.handler.call(that, model);
				//}
				
				if (editor.display === true) {
					items.push(editor);
					editor = undefined;
				}
				
				return Design.widget('gridcell', {
					model: model,
					column: column,
					items: items,
					editor: editor
				});
			}
			return Design.widget('gridcell', {
				model: model,
				column: column
			});
		},
		
		getRows: function(store,columns) {
			var rows = [],
				that = this,
				row = Design.widget('gridrow');
			
			store.getPage(this.page).forEach(function(model) {
				var row = Design.widget('gridrow');
				row.model = model;
				columns.forEach(function(column) {
					
					row.add(that.getCell(model,column));
				});
				rows.push(row);
			});
			return rows;
		},
		getColumnLeft: function(columns, store) {
			
			var row = Design.widget('gridrow'),
				width = 1,
				that = this;
			this.leftColgroup = [];
			
			var groupedHeaderRow = Design.widget('gridrow');  // ����ͷ������µõڶ�����ͷ
			
			columns.forEach(function(column) {
				
				if (column.locked === true) {
				
					if (column.columns){
						column.width = 0;
						column.columns.forEach(function(gcolumn){  
							column.width += gcolumn.width;
							that.leftColgroup.push('<col style="width:' + gcolumn.width + 'px">');
							var cell = that.getCell({get: function(key) { return gcolumn[key] }},{dataIndex: 'text'});
							groupedHeaderRow.add(cell);
						});
					}
					else {
						that.leftColgroup.push('<col style="width:' + column.width + 'px">');
						var cell = that.getCell({get: function(key) { ""; }},{dataIndex: 'text'});
						groupedHeaderRow.add(cell);
					}
					
					width += column.width;
					
					var cell = that.getCell({get: function(key) { return column[key]; }},{dataIndex: 'text', columns: column.columns, isGroupHeader: that.isGroupHeader});
					cell.tag = 'th';
					row.add(cell);
				}
			});
			var table = Design.widget('gridtable' ,{
				items: [row],
				style: {
					width: width,
					height: that.columnHeight
				},
				colgroup: that.leftColgroup.join('\n')
			});
			
			
			if (this.isGroupHeader) {
				table.add(groupedHeaderRow);
			}
			
			this.columnLeftWidth = width;
			
			return {
				xtype: 'gridcontainer',
				cls: 'container-left-header',
				style: {
					width: width,
					height: that.columnHeight+2,
					'float': 'left',
					'display': width == 1 ? 'none' :'block'
				},
				items:[table]
			}
			
		},
		getColumnRight: function(columns, store) {
			var row = Design.widget('gridrow'),
				that = this,
				width = 0 ;
			
			this.rightColgroup = [];
			
			var groupedHeaderRow = Design.widget('gridrow');  // ����ͷ������µõڶ�����ͷ
			
			columns.forEach(function(column) {
				
				if (column.locked !== true) {
					
					if (column.columns){
						column.width = 0;
						column.columns.forEach(function(gcolumn){  
							column.width += gcolumn.width;
							that.rightColgroup.push('<col style="width:' + gcolumn.width + 'px">');
							
							var cell = that.getCell({get: function(key) { return gcolumn[key] }},{dataIndex: 'text'});
							groupedHeaderRow.add(cell);
							
						});
					}
					else {
						that.rightColgroup.push('<col style="width:' + column.width + 'px">');
						
						var cell = that.getCell({get: function(key) { return ""; }},{dataIndex: 'text'});
						$(cell.bodyEl).remove();
						groupedHeaderRow.add(cell);
					}
					
					width += column.width;
					
					var cell = that.getCell({get: function(key) { return column[key] }},{dataIndex: 'text', columns: column.columns, isGroupHeader: that.isGroupHeader});
					
					row.add(cell);
				}
			});
			var table = Design.widget('gridtable', {
				style: {
					width: width,
					height: that.columnHeight
				},
				colgroup:that.rightColgroup.join('\n'),
				items: [row]
			});
			
			if (this.isGroupHeader) {
				table.add(groupedHeaderRow);
			}
			
			this.columnWidth = width;
			
			return {
				xtype: 'gridcontainer',
				cls: 'container-right-header',
				style: {
					width: 0,
					height: that.columnHeight + 2,
					'float': 'left',
					'display': width == 0 ? 'none' :'block'
				},
				items:[table]
			}
			
		},
		
		getDataLeft: function(columns, store) {
			
			var width = this.columnLeftWidth,
				rows = [],
				that = this;
			
			var rows = this.getRows(store, columns.filter(function(column) {
				return column.locked === true;
			}))
			
			
			var table = Design.widget('gridtable' ,{
				items: rows,
				style: {
					width: width
				},
				colgroup: that.leftColgroup.join('\n')
			});
			return {
				xtype: 'gridcontainer',
				cls: 'container-left-body',
				style: {
					width: width,
					height: 0,
					'float': 'left',
					'display': that.columnLeftWidth == 1? 'none' :'block'
				},
				items:[table]
			}
		},
		getDataRight: function(columns, store) {
			var rows = [],
				that = this,
				filterColumns = [];
			
			columns.forEach(function(column) {
				
				if (column.locked) return;
				if (column.columns) {
					column.columns.forEach(function(gcolumn) {
						filterColumns.push(gcolumn)
					});
				} else {
					filterColumns.push(column)
				}
			})
			
			rows = this.getRows(store, filterColumns)
			var table = Design.widget('gridtable' ,{
				items: rows,
				style: {
					width: that.columnWidth,
					height: 1
				},
				colgroup: that.rightColgroup.join('\n')
			});
			return {
				xtype: 'gridcontainer',
				cls: 'container-right-body',
				style: {
					width: 0,
					height: 0,
					'float': 'left'
				},
				items:[table]
			}
		},
		nameClick: function() {
			alert('nameClick');
		}
	});

})();
