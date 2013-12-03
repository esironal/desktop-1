	
	Design.define('Design.custom.ProgressPanel', {
		showChart: function(){
			var records = Design.getCmp('progressPanel').getStore().getRecords(),
				baseDate = new Date('2012-12-21'),
				index = 0,
				dates = [],
				datas = [];
				
			for (var i = 0; i < this.months; i++) {
				dates.push(addMonths(baseDate, i));
			}
			
			records.forEach(function(rec){
				for(var i = rec.get('monthFrom') ; i <= rec.get('monthTo') && i<=dates.length; i++){
					datas.push([dates[index].getTime(),parseInt(rec.get('quota'))]);
					index++;
				}
			});
			
			for (len = dates.length; index < len; index++){
				datas.push([dates[index].getTime(),0]);
			}
			
			var linemaps = [{
				name: "asdfasdf",
				data: datas,
				step: true,
				tooltip: {
					yDecimals: 2
				}
			}];
			Design.getCmp('chart').setData(linemaps);
		},
		setQuota: function(){
			var quotaCount = 0;
			this.store.forEach(function(rec) {
			    var month = parseInt(rec.get('monthTo')) - parseInt(rec.get('monthFrom')) + 1;
				quotaCount += rec.get('quota') * month;
				//alert(rec.get('quota'));
				rec.set('quotaCount' , month * parseFloat(rec.get('quota')));
			});
			quotaCount = 100 / quotaCount;
			this.store.forEach(function(rec) {
				var month = parseInt(rec.get('monthTo')) - parseInt(rec.get('monthFrom')) + 1;
				rec.set('quotaCount', rec.get('quotaCount') * quotaCount);
				rec.set('quotaCount', parseFloat(rec.get('quotaCount')).toFixed(2));
				rec.set('quotaRatio', parseFloat(rec.get('quotaCount')/ month).toFixed(2));
			});
		},
		initColumns: function() {
			var that = this;
			var editor = {
				xtype: 'textfield',
				allowBlank: false,
				vtype: 'number',
				afterBlur: function() {
					that.showChart();
					that.setQuota();
				}
			}
			
			var signRender = function (model, v) {
				if(v)
					return "" + v + "%"
				else 
					return ""
				
			}
			this.columns = [
				{text: '', width: 30,  align: 'center', editor: {
					xtype:'checkbox',
					display: true,
					cls: 'remove-item',
					handler: function() {
						
					}
				}},
				{text: '起始月', width:100, dataIndex: 'monthFrom', align: 'center', editor: editor},
				{text: '终止月', width:100, dataIndex: 'monthTo', align: 'center', editor: editor},
				{text: '份额', width:100, dataIndex: 'quota', align: 'center' ,editor: {
					xtype: 'textfield',
					allowBlank: false,
					matcher: /^([0-9]{1,6})(\.[0-9]{1,2})?$/,
					matcherMsg: '只允许输入小数点前16位与后2位',
					afterBlur: function() {
						that.showChart();
						that.setQuota();
					}
				}},{
					text:'每月占比',
					width:100,
					align:'right',
					sign:'%',
					dataIndex:'quotaRatio',
					renderer:signRender
				},{
					text:'总占比',
					width:100,
					align:'right',
					sign:'%',
					dataIndex:'quotaCount',
					renderer:signRender
				},{
					text:'备注',
					width:100,
					align: 'left',
					dataIndex:'memo',
					editor:{
						name:'memo',
						xtype:'textfield'
					}
				}
			];
		},
		constructor: function(cfg) {
		},
		validate: function(){
			var rows = Design.getCmp('progressPanel').getDataRows(),
				isValidate = true,
				beforeEnd = 0,
				lastRow = rows[rows.length-1];
			
			rows.every(function(row){
				var record = row.model;
				
				row.getChild(1).removeClass('warning');
				row.getChild(2).removeClass('warning');
				row.getChild(3).removeClass('warning');
				
				if (parseInt(record.get('monthFrom')) > parseInt(record.get('monthTo'))) {
					row.getChild(2).addClass('warning');
					alert('终止日期不能小于起始日期')
					isValidate = false;
					return false;
				}
				if (beforeEnd+1 != parseInt(record.get('monthFrom'))) {
					row.getChild(1).addClass('warning');
					alert('格式有误：缺少月份')
					isValidate = false
					record.setWarning(true);
					return false;
				}
				if (record.get('quota') === null || record.get('quota') === undefined) {
					row.getChild(3).addClass('warning');
					alert('份额不允许为空')
					isValidate = false;
					return false;
				}
				beforeEnd = parseInt(record.get('monthTo'));
				return true
			})
			
			if(parseInt(lastRow.model.get('monthTo')) != this.months && isValidate){
				lastRow.getChild(2).addClass('warning');
				alert('终止日期应为 ' + this.months)
				isValidate = false
				return false
			}
			
			return  isValidate;
				 
		},
		initPanel: function() {
			var that = this;
			this.panel = Design.widget('panel', {
				style: {
					width: 650,
					height: 500 
				},
				title: {
					text: '业务目标(' + that.months + '个月)'
				},
				buttons: [{
					text: '保存',
					handler: function() {
						if (!that.validate()) return;
						var json = Design.getCmp('progressPanel').getStore().toJson();
						Design.ajax({
							params: {data:Ext.encode(json),goalId :that.id},
							url: './goalProgress/save',
							success: function(datas) {
								alert('保存成功');
								that.panel.remove();
							},
							error: function() {
								alert('保存失败');
							}
						});
					}
				},{
					text: '取消', 
					handler: function() {
						that.panel.remove();
					}
				}],
				drag: true,
				items: [{
					xtype: 'treepanel',
					id: 'progressPanel',
					columns: that.columns,
					store: that.store,
					toolbar: [{
						dock: 'top',
						items: [{
							xtype:'button',
							label: '添加',
							labelWidth: 50,
							handler: function() {
								that.store.add(new Design.models.GoalProgress());
							},
							iconCls: 'icon-plus'
						},{
							xtype:'button',
							label: '删除',
							labelWidth: 50,
							handler: function() {
								$('.remove-item	').each(function(){
									//alert(Design.getCmp(this.id))
									if(this.checked){
										var model = Design.getCmp(this.id).getParentCmp('td').model; 
										that.store.remove(model);
									}
								})
								that.showChart();
								that.setQuota();
							},
							iconCls: 'icon-remove'
						}]
					}],
					style: {
						width: '100%',
						height: '50%',
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
						height:'50%'
					}
				}]
			});
		},
		
		show: function(cfg) {
			
			var that = this;
			cfg = cfg || {};
			Design.ajax({
				params: {id:cfg.id},
				url:'./goalProgress/ajaxList',
				success: function(data) {
					var progressList = Ext.jUtil.jsonTransf(eval(data));
					progressList.each(function(item) {
						item.quotaCount = 1;
						item.quotaRatio = 1;
					});
					that.store = Design.create('Design.data.Store', {
						model: 'Design.models.GoalProgress',
						data: progressList
					});
					that.id = cfg.id;
					that.months = cfg.months;
					that.initColumns();
					that.initPanel();
					that.panel.show();
					that.showChart();
					that.setQuota();
				},
				error: function() {
					return;
					that.store = Design.create('Design.data.Store', {
						model: 'Design.models.GoalProgress',
						data: [{id:1,quota: 1, monthFrom: 1, monthTo: 60}]
					});
					that.initColumns();
					that.initPanel();
					that.panel.show();
					that.showChart();
					that.setQuota();
				}
			});
		
		}
	});