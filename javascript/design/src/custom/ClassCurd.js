
	Design.define('Design.custom.ClassCurd', {
	
		constructor: function(cfg) {
			this.newRecord = [];
			this.store = cfg.store;
			
			this.initColumns(cfg.grid);
			this.initGrid(cfg);
			this.initForm(cfg.form);
			
		},
		newRecordRender: function (model, v) {
			if (this.newRecord[model.get('id')] && v !== null && v !== undefined) {
				return "<span style = 'color: #3366CC'>" + v + "</span>"
			}
			return v;
		},
		initForm: function(form) {
			var that = this;
			
			this.form = Design.widget('form', Design.apply({
				style:{
					width: 370,
					height: 310
				},
				drag: true,
				title: {
					text: '添加'
				},
				buttons: [{
					text: '确定',
					handler: function(_form) {
						if (!_form.validate())
							return;
						var model = _form.saveModel();
						
						
						model.save({},function() {
							that.newRecord[model.get('id')] = true;
							that.store.add(model);
							_form.remove();
						}, function() {
							that.newRecord[model.get('id')] = true;
							that.store.add(model);
							_form.remove();
							return;
						});
					
					}
				},{
					text: '取消', 
					handler: function(_form) {
						_form.remove();
					}
				}],
				bodyPadding: 50
			}, form));
		},
		initColumns: function(grid) {
			var that = this;
			this.columns = grid.columns;
			
			this.columns.forEach(function(column) {
				if (!column.renderer) {
					column.renderer = Design.bind(that.newRecordRender, that);
				}
			});
			
			if (grid.editing) {
				var items = grid.editing.prepend || [];
				
				if (grid.editing.defaultAction) {
					grid.editing.defaultAction.forEach(function(value) {
						if (value.type == 'update') {
							items.push({
								xtype:'button',
								iconCls: 'icon-edit',
								tip:'编辑',
								style: {'padding-left': '5px', 'float': 'left'},
								handler: function() {
									if (value.beforeClick && !value.beforeClick.call(this)) {
										return;
									}
									var model = (Design.getCmp($(this.el).parents('td')[0].id).model)
                                
									that.form.show();
									that.form.setModel(model); 
								}
							})
						}
						else if (value.type == 'delete') {
							items.push({
								xtype:'button',
								iconCls: 'icon-remove',
								tip:'删除',
								style: {'padding-left': '5px', 'float': 'left'},
								handler: function(m) {
									if (value.beforeClick && !value.beforeClick.call(this)) {
										return;
									}
									if (!confirm('是否要删除')) {
										return;
									}
									var model = (Design.getCmp($(this.el).parents('td')[0].id).model);
									model.remove({}, function() {
										that.store.remove(model);
									}, function() {
										that.store.remove(model);
									});
								}
							})
						
						}
					});
				}
				
				var editor = {text: '编辑',width:200, align:'center', editor:{
					xtype: 'container',
					display: true,
					style: {'display': 'inline-block'},
					items: items
				}}
				this.columns.push(editor);
			}
			
		},
		initGrid: function(cfg) {
			var that = this;
			var toolbar = [];
			if (cfg.grid.toolbar) {
				cfg.grid.toolbar.defaultAction.forEach(function(value) {
					if (value == 'insert') {
						toolbar.push({
							xtype:'button',
							label: '添加',
							labelWidth: 50,
							handler: function() {
								that.form.show();
								that.form.setModel(new Design.models.GoalStrategy(cfg.form.defaultValue));
							},
							iconCls: 'icon-plus'
						});
					}
				});
			}
			
			this.grid = Design.widget('treepanel', {
				columns: that.columns,
				store: that.store,
				toolbar: [{
					dock: 'top',
					items: toolbar
				}],
				title: cfg.grid.title,
				style: {
					width: '100%',
					height: '100%',
					'float': 'left'
				}
			});
		},
		render: function(renderer) {
			renderer = renderer || 'body';
			this.grid.render(renderer);
		}
	});