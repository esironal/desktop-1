	
	Design.define('Design.custom.AccitemStrategy', {
		
		constructor: function(cfg) {
			
		},
		show: function(cfg) {
			var that = this;
			cfg = cfg || {};
			this.id = cfg.id;
			this.model = cfg.model;
			Design.ajax({
				params: {id:cfg.id},
				url: './goalStrategy/loadAccitem',
				success: function(datas) {
					var accitemIds = Ext.jUtil.jsonTransf(Ext.decode(datas).list,true);
					var notAccitemIds = Ext.jUtil.jsonTransf(Ext.decode(datas).accList,true);
					
					cfg.data.forEach(function(data) {
						data.checked = false;
						data.chkDisabled = false;
					});
					
					cfg.data = Ext.jUtil.buildTreeJson(0,cfg.data);
					
					var setNotCheck = function(datas) {
						datas.forEach(function(data) {
							data.checked = true;
							data.chkDisabled = true;
							if (data.children) {
								setNotCheck(data.children);
							}
						});
						
					}
					
					var eachTree = function(datas){
						datas.forEach(function(data) {
							accitemIds.forEach(function(item) {
								if (data.id === item.accitemId) {
									data.checked = true;
									if (data.children) {
										setNotCheck(data.children);
									}
								}
							});
							notAccitemIds.forEach(function(item) {
								if (data.id === item.accitemId) {
									data.checked = true;
									data.chkDisabled = true;
									if (data.children) {
										setNotCheck(data.children); 
									}
								}
							});
							if (data.children) {
								eachTree(data.children);
							}
						});
					}
					eachTree(cfg.data);
					that.initTreePanel(cfg.data);
					that.panel.show();
				},
				error: function() {
					
					alert('获取失败');
				}
			});
			
		},
		initTreePanel: function(data) {
			var that = this;
			this.panel = Design.widget('tree', {
				title: {
					text: '关联账户项'
				},
				drag: true,
				
				setting: {
					callback: {
						onCheck: function(e,d,treeNode) {
							var zTree = this.getTreeObj(),
								disabled = treeNode.checked,
								nodes = treeNode.children;
							if (!nodes) {
								return;
							}
							for (var i = 0, l = nodes.length; i < l; i++) {
								zTree.setChkDisabled(nodes[i], disabled);
								zTree.checkNode(nodes[i], disabled, true);
							}
						}
					},
					check: {
						chkboxType: { "Y" : "s", "N" : "ps" },
						enable: true
					}
				},
				style: {
					width: '370',
					height: '400'
				},
				bodyPadding:10,
				bodyStyle: {
					overflow: 'auto'
				},
				displayField: 'name',
				datas: data,
				buttons: [{
					text: '确定',
					handler: function() {
						var zTree = that.panel.getTreeObj(),
							ids = [],
							names = [],
							checkNode = zTree.getCheckedNodes(true);
						
						checkNode.forEach(function(node) {
							if (!node.chkDisabled) {
								ids.push(node.id);
								names.push(node.name);
							}
						});
						
						Design.ajax({
							params: {ids:ids,gsId:that.id},
							url: './goalStrategy/saveAccitem',
							success: function(data) {
								alert('提交成功');
								that.panel.remove();
								that.model.set('accitems', names.join(' '));
							},
							error: function() {
								
								alert('提交失败');
							}
						});
					}
				},{
					text: '取消', 
					handler: function() {
						that.panel.remove();
					}
				}]
			});
		}
	});
	