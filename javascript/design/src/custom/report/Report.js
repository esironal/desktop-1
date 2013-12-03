
        
 
(function() {       
	var selectModels = [], 
        chartType = 0, 
        grid, 
        lineChart,
        targetCell, 
        pieChart,
        piePanel, 
        chartInfoGrid, 
        memory = {}, 
        mainGrid, 
        indexList = [];
	
    /*去除负数*/
	function parseReportNumber(number) {
		var value = parseFloat((number + "").replace(/,/g, ''));
		if (value < 0) {
			value = 0;
		}
		
		return value;
	}
	/*改变当前面板的布局*/
	function setlayout (value) {
        //隐藏图表
		if (value == 0) {
			lineChart.hide();
			piePanel.hide();
			mainGrid.resize('100%', '100%');
			return;
		}
        //子级占比
		else if (value == 1) {
			piePanel.show();
			lineChart.hide();
			mainGrid.resize('70%', '100%');
			showPieChart(selectModels);
			setInfoGrid(selectModels);
		}
        //横向占比
		else if (value == 2) {
			piePanel.show();
			lineChart.hide();
			mainGrid.resize('70%', '100%');
			showPieChart(selectModels);
			setInfoGrid(selectModels);
		}
        //趋势图
		else if (value == 3) {
			mainGrid.resize('100%', '60%');
			piePanel.hide();
			lineChart.show();
			showLineChart(selectModels);
		}
	}
	
    /*
     *  设置详细信息表格的数据
     **/
	function setInfoGrid(models) {
	  
		if (!models.length) return;
	  
		var cell = grid.targetCell,
			model = models[0],
			columns = [], 
			datas = [];
			
        
        /*
        *  为子级占比时显示数据的格式
        **/
		if (chartType == 2) {
			columns = [{dataIndex: 'date', width: 150, text: '日期'}, {dataIndex: 'value', width: 150, text: '值', align:'right'}]
			grid.columns.forEach(function(column) {
				var json = {};
				if (column.locked) {
					
				}
				else {
					if (column.columns) {
						datas.push({value:model.get(column.columns[cell.cellIndex % 2].dataIndex), date: column.text});
					}
					else {
						datas.push({value:model.get(column.dataIndex), date: column.text});
					}
				}
			});
		}
        /*
        *  为横向占比时显示数据的格式
        **/
		else if (chartType == 1 && (cell && Design.getCmp(cell.id)) || targetCell ) {
			var lockIndex = ""

			if (!cell) {
				var cellId = $(grid.el).find('.container-right-body tr:eq(' + targetCell.y + ')').find('td:eq(' + targetCell.x+ ')')[0].id;
				cell = Design.getCmp(cellId);
			}
			else {
				cell = Design.getCmp(cell.id);
			}
			
			if (cell.column.locked) return;
			grid.columns.forEach(function(column,i){
				 if(column.locked){
					  lockIndex = column.dataIndex;
				 }
			});
		   
			
			columns = [{dataIndex: 'date', width: 150, text: '名称'}, {dataIndex: 'value', width: 150, text: '值', align:'right'}];
			(cell.model.get('children') || []).forEach(function(item) {
				datas.push({value: item.get(cell.column.dataIndex), date: item.get(lockIndex)})
			});
		}
		chartInfoGrid.bindStore(datas, columns);
	}
	
	/*
     *  渲染饼图方法
     **/
	function showPieChart(models, tid) {
		var cell = grid.targetCell, values = [], count = 0, name2 = '';
		
		if (!models.length) return;
		
        /*
        *  横向占比时计算规则
        **/
		if (chartType == 2) {
			var name = "", values = [];
			grid.columns.forEach(function(column) {
				if (!column.locked) {
				
					if (column.columns) {
						if (parseReportNumber(models[0].get(column.columns[cell.cellIndex % 2].dataIndex)))
							values.push([column.text, parseReportNumber(models[0].get(column.columns[cell.cellIndex % 2].dataIndex))]);
						name2 = column.columns[cell.cellIndex % 2].text;
					}
					
					else if (parseReportNumber(models[0].get(column.dataIndex)))
						values.push([column.text, parseReportNumber(models[0].get(column.dataIndex))]);
				}
				else {
					name = models[0].get(column.dataIndex);
				}
			});
			
			pieChart.setPieChart(values, name + ' : ' + name2);
		}
        /*
        *  子级占比时计算规则
        **/
		else if (chartType == 1 && (cell && Design.getCmp(cell.id)) || targetCell ) {
			var cellId
			if (!cell) {
				cellId = $(grid.el).find('.container-right-body tr:eq(' + targetCell.y + ')').find('td:eq(' + targetCell.x+ ')')[0].id;
				cell = Design.getCmp(cellId);
			}
			else {
				cell = Design.getCmp(cell.id);
			}
			var lockIndex = ""

			grid.columns.forEach(function(column,i){
				if(column.locked){
					lockIndex = column.dataIndex;
				}else {
					if (column.columns) {
						name2 = column.columns[grid.targetCell.cellIndex % 2].text;
					}
				}
			});
			(cell.model.get('children') || []).forEach(function(model) {
				var value = parseReportNumber(model.get(cell.column.dataIndex) || 0);
				if (value)
					values.push([model.get(lockIndex), value]);
			});
			pieChart.setPieChart(values, cell.model.get(lockIndex) + ' : ' + name2);
		}
	}
	
    /*
    *  渲染趋势图方法
    **/
	function showLineChart(models) {
		var baseDate = new Date();
		var linemaps = [];
		models.forEach(function(model) {
			var values = [], values2 = [], name1 = '', name2 = '';
			var beforeValue = 0;
			var lockIndex = ""

			grid.columns.forEach(function(column,i){
				if(column.locked){
					lockIndex = column.dataIndex;
				}
			});
			//beforeValue = parseInt(model.get('baseValue')|| 0)
			//values.push([baseDate.getTime(), beforeValue] );
			grid.columns.forEach(function(column, i) {
				if (column.locked) return;
				
				if (column.columns) {
					name1 = column.columns[0].text;
					name2 = column.columns[1].text;
					values.push([new Date(column.text.replace(/-/g, '/')).getTime(),parseReportNumber(model.get(column.columns[0].dataIndex))]);
					values2.push([new Date(column.text.replace(/-/g, '/')).getTime(),parseReportNumber(model.get(column.columns[1].dataIndex))]);
					return;
				}
				
				if (model.get(column.dataIndex)) {
					beforeValue = parseInt(parseReportNumber(model.get(column.dataIndex)) || 0);
				}
				values.push([new Date(column.text.replace(/-/g, '/')).getTime(), beforeValue])
			});
			
			linemaps.push({
				name: model.get(lockIndex) + ' : ' + name1,
				data: values,
				tooltip: {
					yDecimals: 0
				}
			});
			
			if (values2.length) {
				linemaps.push({
					name: model.get(lockIndex) + ' : ' + name2,
					data: values2,
					tooltip: {
						yDecimals: 0
					}
				});
			}
		});
		if (models.length)
			lineChart.setData(linemaps);
	}
	
	
    /*
    *  遍历树形结构的工具函数
    **/
	function eachChild(items, callback) {
		items.forEach(function(item) {
			callback(item);
			if (item.get('children')) {
				eachChild(item.get('children'), callback);
			}
		});
	}
	
	/*
    *  声明一个用于显示报表类 
    **/
	Design.define('Design.custom.report.Report', {
		constructor: function(cfg) {
			Design.apply(this, cfg);
			selectModels = [];
			chartInfoGrid = null;
			grid = null;
			lineChart = null;
			pieChart = null;
            
            var that = this;
			if (cfg.showLineChart) {
				showLineChart = cfg.showLineChart;
			}
			
			if (!this.flag) {
				chartType = 0;
				indexList = [];
				selectModels = [];
				targetCell = null;
			}
			
			var list = cfg.list;
			var report ={};

			if (list.report) {
				report = getReport(list.report);
			}
			else {
				report.column = [];
				report.data = [];
			}
			var pagination = {};
			if(list.report){
				pagination = list.report.paginations;
				if(pagination)
					pagination = pagination.cfDate;
				else
					pagination = {};
			}
			if(!pagination){
				pagination = {};
			}
			report.column.forEach(function(column) {
				if (column.column) {
					column.columns = column.column;
				}
                if (!column.locked) {
                    column.renderer = function(model, value, cell) {
                        
                        if (value) {
                            value = parseFloat((value + "").replace(/,/g, ''));
                        }
                        
                        if (that.dataUnit && value) {
                            value = parseFloat(value) / parseFloat(that.dataUnit)
                        }
                        if (that.dataFormat && value) {
                            value = Design.formatNumber(value, that.dataFormat)
                        }
                        return value;
                        
                    }
                }
			});
			this.columns = report.column,
            this.datas = report.data,
            this.pageCount = pagination.pages,
            this.page = pagination.page
			
			this.initialize();
		},
		initialize: function() {
			var that = this;
			mainGrid = Design.widget('treepanel', {
				xtype: 'treepanel',
				columns: that.columns,
			
				onItemSelect: function(models, event, indexs) {
					selectModels = models;
						
					if (mainGrid.targetCell) {
						var cell = Design.getCmp(mainGrid.targetCell.id);	
						if (cell.column.locked) {
							cellId = $(grid.el).find('.container-right-body tr:eq(' + $(cell.el).parents('tr')[0].rowIndex + ')').find('td:eq(0)')[0].id;
							cell = Design.getCmp(cellId);
							grid.targetCell = cell.el;
						}
					}
					indexList = indexs;
					if (lineChart.isShow()) {
						showLineChart(selectModels, event);
					}
					else if (pieChart.isShow()) {
						showPieChart(selectModels, event);
						setInfoGrid(selectModels);
					}
				},
				afterInitStore: function(store) {
					if (!memory.expandMap) {
						return;
					}
					
					eachChild(store.models, function(item) {
						item.set('expanded', memory.expandMap[item.get('id')]);
					});
				},
				data: that.datas,
				stripeRows: true,
				toolbar: [{
					dock: 'top',
					items: [{
						xtype: 'radiogroup',
						events:{
							'change input': 'change'
						},
						bodyStyle: {
							width: '420'
						},
						change: function(e) {
							var items = panel.getItems();
							
							var value = $(e.target).val();
							chartType = value;
							setlayout(chartType);
							
						},
						style: {
							float: 'left'
						},
						items: [
							{boxLabel: '隐藏图表', value:'0', name: 'showType'},
							{boxLabel: '子级占比', name: 'showType', value:'1'},
							{boxLabel: '横向占比', value: '2', name: 'showType'},
							{boxLabel: '趋势图', value: '3', name: 'showType'}
						],
						value: chartType
					}, {
						xtype: 'button',
						label: '展开',
						iconCls: 'icon-report-expand',
						handler: function() {
							mainGrid.expand();
						}
					}, {
						xtype: 'button',
						label: '收缩',
						iconCls: 'icon-report-fold',
						handler: function() {
							mainGrid.fold();
						}
					}]
				},{
					dock: 'bottom',
					items: [{
						style: {
							'float': 'right' 
						},
						pageCount: that.pageCount || 1,
						page: (that.page || 1) - 1,
						xtype:'pagination',
						onPage: function(p) {
							
							if (mainGrid.targetCell) {
								targetCell = {};
								targetCell.x = mainGrid.targetCell.cellIndex;
								targetCell.y = $(mainGrid.targetCell).parent()[0].rowIndex;
							}
							
							var map = {};
							
							eachChild(mainGrid.store.models, function(item) {
								map[item.get('id')] = item.get('expanded');
							});
							memory.expandMap = map;
							$('form').append('<input type="hidden" name = "page" value = "'+ (p + 1) +'" >');
							$('form').submit();
						}
					}]
				}],
				style: {
					width: '100%',
					height: '100%',
					'float': 'left',
					'border': '1px solid #FFFFFF',
					'box-shadow': 'none'
				}
			});
			
			lineChart = Design.widget('chart', {
				xtype: 'chart',
				
				style: {
					width: '100%',
					'clear': 'left',
					height:'40%',
					display:'none'
				}
			});
			pieChart = Design.widget('chart', {
				
				html: 'pie',
				style: {
					width: '100%',
					'float': 'left',
					height:'50%'
				}
			});
			
			chartInfoGrid = Design.widget('treepanel', {
				html: 'grid',
				columns:[],
				data:[],
				style: {
					width: '100%',
					'float': 'left',
					height:'50%'
				}
			});
			
			piePanel = Design.widget('panel', {
				style: {
					width: '30%',
					'float': 'left',
					height:'100%',
					display:'none'
				},
				items: [pieChart, chartInfoGrid]
			});
			
			var panel = Design.widget('panel', {
				style: {
					width: '100%',
					height: '100%' 
				},
				title: {
					text: that.title || '报表'
				},
				items: [mainGrid,piePanel, lineChart]
			});
			this.panel = panel;
			grid = mainGrid;
		},
		render: function(where) {
			this.panel.render(where);
			if (this.flag) {
				setlayout(chartType);
				mainGrid.setSelect(indexList);
			}
			else {
			}
			
		}
	});
})()