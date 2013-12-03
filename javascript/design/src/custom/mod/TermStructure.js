
(function() {
	var baseDate = new Date(), selectModels = [];
	function updateDataRender(v) {
		return '<span style = "color: #3366CC">'+v+'</span>';
	}
	
	var setNextValue = function(cell, model, dataIndex) {
		
		var row = cell.parent;
		var isStart = false;
		if(!row) return;
		row.forEach(function(cel) {
			if (cel == cell) {
				isStart = true;
			}
			if (isStart) {
				if (!cel.model.get(cel.column.dataIndex)) {
					$(cel.content).html("<span style='color:#ccc'> "+ model.get(dataIndex) + " % </span>");
				}
			}
		});
	}
	
	var config = null;
	
	Design.define('Design.custom.mod.TermStructure', {
		renderer: function(model, value, cell) {
			if (value === undefined || value === null || value === ''){
				if (true) {
					var value = config.findPrevValue(model, cell.column.dataIndex);
					if (value ) {
                        if (model.get('isTerm') && !model.get('noEdit')) {
                            return  "<span style='color:#ccc'> "+ Design.formatNumber(parseFloat(value), '##,#00.00') + " % </span>";
                        }
						else {
                            if (value) {
                                value = Design.formatNumber(parseFloat(value), '##,#00.00');
                            }
                            return  "<span style='color:#ccc'> "+ value + "  </span>";
                        }
					}
					return value;
				}
			}
			if (value !== undefined && value !== null &&model.get('isTerm')) {
				setNextValue(cell, model, cell.column.dataIndex);
                value = Design.formatNumber(parseFloat(value), '##,#00.00');
				return value + (!model.get('noEdit')?" %":"");
			}
            
            if (value) {
                value = Design.formatNumber(parseFloat(value), '##,#00.00');
            }
            
            return value
		},
		editor: {
			afterBlur: function(cell, value) {
				
				var row = cell.getParent('tr').parentRow || {}, count = 0;
				var rows = row.childRows || [];
				if (rows.length ) {
					for (var i = 0, len = rows.length - 1; i < len; i++) {
						var val = rows[i].model.get(cell.column.dataIndex);
						if (val) {
							count += parseFloat(val);
						}
					}
					if (count > 100) {
						cell.model.set(cell.column.dataIndex, value - (count - 100));
						count = 100;
					}
					rows[rows.length-1].model.set(cell.column.dataIndex,100 - count);
				}
				
			},
			beforeRender: function(cell) {
				var rows = cell.getParent('tr').parentRow || {}, isLast = false;
				rows = rows.childRows || [];
				
				if (rows.length) {
					if (rows[rows.length - 1].model.get('modelId') == cell.model.get('modelId')) {
						return false;
					}
				}
				return (cell.model.get('isTerm') && !cell.model.get('noEdit') );
			},
			beforeOver: function(cell) {
				var rows = cell.getParent('tr').parentRow || {}, isLast = false;
				rows = rows.childRows || {};
				
				if (rows.length) {
					if (rows[rows.length - 1].model.get('modelId') == cell.model.get('modelId')) {
						return false;
					}
				}
				return (cell.model.get('isTerm') &&  !cell.model.get('noEdit'));
			},
			xtype:'textfield'
		},
		
		findPrevValue: function(model, dataIndex) {
			
			var index = parseInt(dataIndex.replace('month', ''));
			for (var i = index - 1; i > 0; i--) {
				var value = model.get('month' + i);
				if (value) {
					return value;
				}
			}
			return ""
		},
		getCollstByMonths: function(months, type) {
			
			var addMonth = 0,that = this;
			var manyColumns = [];
			for (var i = 0; i < months.length / 12 / type; i++) {
				var columns = [{
					text:'名称',
					width:300,
					locked:true,
					treeColumn:true,
					dataIndex:'name'
				}];
				
                //if (that.checkStructure == 'index') {
                columns.push({
                    text:'基期',
                    align: 'right',
                    width: 120,
                    renderer: that.renderer,
                    dataIndex: 'baseValue',
                    align: 'right'
                })
                // }
                
				for (var j = 0; j < 12; j++) {
					addMonth += type - 1;
					if (months[i * 12 + j + addMonth]) {
						columns.push({
							text: '第'+(i * 12 + j + 1  + addMonth)+'月',
							width: 120,
							align: 'right',
							renderer: that.renderer,
							dataIndex: months[i * 12 + j + addMonth],
							editor: that.editor
						});
					}
				}
				manyColumns.push(columns);
			}
			
			return manyColumns;
			
		},
		constructor: function(cfg) {
			Design.apply(this,cfg);
			this.initStore(cfg);
			this.initPanel(cfg);
			config = this;
		},
		initStore: function(cfg){
			 Design.define('Structure', {
				extend: 'Design.data.Model',
				url: './TermStructure',
				fields: (function() {
					var fields = [
						{name:'id', type:'int'},
						{name:'name', type:'string'},
						{name:'basePercent', type:'string'},
						{name:'baseValue', type:'string'},
						{name:'accitemId', type:'string'},
						{name:'parentId', type:'string'},
						{name:'termId', type:'string'},
						{name:'reprice', type:'string'},
						{name:'isTerm', type:'string'},
						{name:'value', type:'string'},
						{name:'spreadType', type:'string'},
						{name:'termSetId', type:'string'},
                        {name:'rateMark', type:'string'},
						{name:'noPercent', type:'string'},
						{name:'noEdit', type:'string'},
						{name:'isTermItem', type:'string'}
					], i = 0, len = 60;
					
					for (; i < len; i++) {
						fields.push({name: 'month' + (i+1)});
					}
					
					return fields;
				})()
			});
			this.store = Design.create('Design.data.Store', {
				model: 'Structure',
				type: 'tree',
				data: cfg.data,
				id:'col2'
			});
		},
		
		showPieChart: function(models) {
			var cell = this.panel.findItem('treepanel').targetCell, values = [], count = 0;
			var that = this;
			
			
			if (cell && Design.getCmp(cell.id)) {
				cell = Design.getCmp(cell.id);
                
				if (cell.model.get('children') && cell.column.dataIndex != 'name') {
					cell.model.get('children').forEach(function(model) {
						var value = parseInt(model.get(cell.column.dataIndex) || 0);
						count += value;
                        if (!value) {
                            value = that.findPrevValue(model, cell.column.dataIndex)
                        }
                        if (value)
						values.push([model.get('name'), value]);
					});
					this.panel.findItem('chart').setPieChart(values, cell.model.get('name'));
				}
			}
		},
		
		showChart: function(models) {
			var chartType = $('input[name="chartType"]').filter(':checked').val();
			if (chartType == 1) {
				this.showLineChart(models);
			}
			else {
				this.showPieChart(models);
			}
		},
		
		showLineChart: function(models) {
			
			var linemaps = [], that = this;
			models.forEach(function(model) {
				var values = []
				var name = model.get('name');
				beforeValue = parseInt(model.get('baseValue')|| 0)
				values.push([baseDate.getTime(), beforeValue] );
				that.monthList.forEach(function(month, i) {
					if (model.get(month)) {
						beforeValue = parseInt(model.get(month) || 0);
					}
					values.push([Design.addMonths(baseDate, i + 1).getTime(), beforeValue])
				});
				linemaps.push({
					name: name,
					data: values,
					tooltip: {
						yDecimals: 0
					}
				});
			});
			this.panel.getItems()[1].setData(linemaps);
		},
		toolbarItems: [{
			xtype: 'button',
			iconCls: 'icon-export',
			style: {
				'float': 'left'
			},
			label: '导出',
			handler: function() {
				window.open(config.url + "/export"+'?id='+ config.structureSetId);
			}
		},{
			xtype: 'button',
			iconCls: 'icon-import',
			style: {
				'float': 'left'
			},
			label: '导入',
			handler: function() {
			
				var importFile = Design.widget('form', {
					title: {
						text: '导入'
					},
					url: config.url + '/upload',
					drag: true,
					style: {
						width:350,
						height:150
					},
					bodyPadding: 20,
					items: [{
						xtype: 'filefield',
						label: '选择文件',
						name: 'files',
						id: 'files',
						allowBlank: false,
						labelWidth: 80
					}],
					buttons: [{
						text: '导入文件',
						handler: function() {
							importFile.submit({
								error: function(data, status, e) {
									var str = data.responseText;
									var mess = str.split(":")[1];
									alert(mess);
								},
								success: function() {
									alert('文件导入成功');
									Design.ajax({
										type: 'POST',
										params: {'id':config.structureSetId},
										url: config.url + '/list',
										update: 'main'
									});
									importFile.destroy();
								},
								params: {structureSetId: config.structureSetId}
							});
						}
					}, {
						text: '取消',
						handler: function() {
							importFile.destroy();
						}
					}]
				});
				
				importFile.show();
			}
		},{
			xtype: 'button',
			iconCls: 'icon-save',
			style: {
				'float': 'left'
			},
			label: '保存',
			handler: function() {
				Design.ajax({
					params: {datas:Design.encode(config.store.getDirtyData()), structureSetId: config.structureSetId},
					url: config.url + '/save',
					success: function(data) {
						alert('保存成功');
						Design.ajax({
							type: 'POST',
							params: {'id':config.structureSetId},
							url: config.url + '/list',
							update: 'main'
						});
					},
					error: function(data) {
						alert('提交失败');
					}
				});
			}
		},{
            xtype:'button',
            label:'导入基期值',
            iconCls:'icon-import',
            cls:'button-icon',
            handler:function(){

                var importBase = Design.widget('form', {
                    title: {
                        text: '导入基期值'
                    },
                    url:    config.url+'/importBase',
                    drag: true,
                    style: {
                        width:350,
                        height:150
                    },
                    bodyPadding: 20,
                    items: [{
                        xtype: 'combobox',
                        label: '选择情景模型',
                        allowBlank: false,
                        fieldStyle: {
                            width: 200
                        },
                        name: 'staticId',
                        displayField: 'name',
                        valueField: 'id',
                        data: config.staticModel,
                        labelWidth: 120
                    }],
                    buttons: [{
                        text: '导入',
                        handler: function() {

                            importBase.submit({
                                params:{goalId:config.structureSetId},
                                success: function() {

                                        alert('保存成功')

                                    Ext.jutil.setLoading(false);

                                   Design.ajax({
                                        type: 'POST',
                                        params: {'id':config.structureSetId},
                                        url: config.url + '/list',
                                        update: 'main'
                                    });
                                },
                                error: function() {
                                    Ext.jutil.setLoading(false);
                                    alert('基期数据表不存在');
                                }
                            });
                            importBase.destroy();
                        }
                    }, {
                        text: '取消',
                        handler: function() {
                            importBase.destroy();
                        }
                    }]
                });

                importBase.show();
            
            }
        }],
		initPanel: function() {
			var that = this;
			this.panel = Design.widget('panel', {
				style: {
					width: '100%',
					height: '100%' 
				},
				title: {
					text: that.title || ''
				},
				items: [{
					xtype: 'treepanel',
					manyColumns: that.getCollstByMonths(that.monthList, that.monthType || 1),
					onItemSelect: function(models, event) {
						var chart = that.panel.findItem('chart');
						selectModels = models;
						if (chart.isShow()) {
							that.showChart(selectModels, event);
						}
					},
					store: that.store,
					stripeRows: true,
					toolbar: [{
						dock: 'top',
						items: (function() {
						
							var list = [{
								xtype: 'radiogroup',
								events:{
									'change input': 'change'
								},
								change: function(e) {
									var val = $(e.target).val();
									var grid = that.panel.findItem('treepanel');
									var pagination = that.panel.findItem('pagination');
									var columns = that.getCollstByMonths(that.monthList, val);
									grid.bindManyColumns(columns);
									pagination.bindManyColumns(columns);
                                    that.monthType = val
								},
								style: {
									float: 'left'
								},
								items:(function() {
                                    var list = [
                                        {boxLabel: '按月查看', value:'1', name: 'showType', checked: true},
                                        {boxLabel: '按季查看', name: 'showType', value:'3'},
                                        {boxLabel: '按半年查看', value: '6', name: 'showType'},
                                        {boxLabel: '按年查看', value: '12', name: 'showType'}
                                    ]
                                    list.forEach(function(item){
                                        if (item.value == that.monthType) {
                                            item.checked = true;
                                        }
                                    });
                                    return list;
                                })() 
							},{
								xtype: 'button',
								iconCls: 'icon-grow',
								style: {
									'float': 'right'
								},
								label: '显示图表',
								handler: function() {
									var items = that.panel.getItems();
									if (items[1].isShow()) {
										items[0].resize('100%', '100%');
										items[1].hide();
									}
									else {
										items[1].show();
										items[0].resize('100%', '60%');
										that.showChart(selectModels);
									}
								}
							},{
								xtype: 'radiogroup',
								style: {
									float: 'right',
									'padding-right' : '10px'
								},
								items: [
									{boxLabel: '趋势图', value:'1', name: 'chartType'},
									{boxLabel: '占比图', name: 'chartType', value:'2', checked: true}
								],
                                events:{
									'change input': 'change'
								},
                                change: function(e) {
									that.showChart(selectModels);
								}
							}];
							
							that.toolbarItems.forEach(function(item) {
								list.push(item);
							});
							
							return list;
						})()
					},{
						dock: 'bottom',
						items: [{
							style: {
								'float': 'right' 
							},
							manyColumns: that.getCollstByMonths(that.monthList, 1),
							store: this.store,
							xtype:'pagination'
						}]
					}],
					style: {
						width: '100%',
						height: '100%',
						'float': 'left'
					}
				},{
					xtype: 'chart',
					id: 'chart',
					title: {
						text: 'chart' 
					},
					style: {
						width: '100%',
						'clear': 'left',
						height:'40%',
						display:'none'
					}
				}]
			});
		},
		render: function(renderer) {
			renderer = renderer || 'body';
			this.panel.render(renderer);
		}
	});

})()
