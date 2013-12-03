
(function() {
	var beforeNode;

	var resetChildNode = function (treeObj, node) {
		treeObj.getNodesByParam('baseParentId',node.id,null).forEach(function(n) {
			if (n.getParentNode() != node) {
				n.iconSkin = undefined;
				treeObj.moveNode(node, n, "inner");
			}
		});
		if (node.children) {
			node.children.forEach(function(n) {
				resetChildNode(treeObj,n);
			});
		}
	}
	
	var resetParentNode = function(organTree, virtualTree, node) {
		var pNode = virtualTree.getNodesByParam('id', node.baseParentId, null)[0];
		if (!pNode) {
			return;
		}
		resetParentNode(organTree, virtualTree, pNode);
		
		pNode.iconSkin = undefined;
		pNode.isParent = true;
		virtualTree.updateNode(pNode);
		virtualTree.removeNode(pNode);
		organTree.addNodes(organTree.getNodesByParam('id',pNode.baseParentId,null)[0], pNode);
	}
	
	function resetOrgan(organTree, node, virtualTree) {
		node.iconSkin = undefined;
		var pNode = organTree.getNodesByParam('id',node.baseParentId,null)[0];
		if (node.baseParentId && !pNode) {
			resetParentNode(organTree, virtualTree, node);
		}
		pNode = organTree.getNodesByParam('id',node.baseParentId,null)[0];
		if (!node.leaf) {
			node.isParent = true;
		}
		organTree.addNodes(pNode,node);
	}
	
	
	
	Design.define('Design.custom.bas.VirtualOrgan', {
		constructor: function(cfg) {
			this.virtualData = cfg.virtualData || [];
			this.organData = cfg.organData || [];
			this.defaultValue = cfg.defaultValue || [];
			this.virtualOrganList = cfg.virtualOrganList || [];
			this.initForm();
			this.initMenu();
			this.initVirtualTree();
			this.initOrganTree();
			this.initPanel();
		},
		afterRender: function() {
			var that = this,
				virtualObj = this.virtualTree.getTreeObj(),
				organObj = this.organTree.getTreeObj();
			this.virtualOrganList.forEach(function(organ) {
			
				var node = organObj.getNodesByParam('id', organ.organId, null)[0];
			
				if (!node) {
					node = virtualObj.getNodesByParam('id', organ.organId, null)[0];
				}
				node.type = organ.type;
				virtualObj.addNodes(virtualObj.getNodesByParam('id', organ.parentId, null)[0], node);
				organObj.removeNode(node);
				
				node = virtualObj.getNodesByParam('id', organ.organId, null)[0] || {};
				node.isParent = false;
				node.leaf = true;
				node.iconSkin = 'icon-organ';
				if (organ.type == 1) {
					node.iconSkin = 'icon-organ-add';
				}
				node.virtualId = organ.id;
				virtualObj.updateNode(node);
				if (organ.type != 1) {
					resetChildNode(virtualObj, node);
				}
			});
		},
		render: function(where) {
			this.panel.render(where);
			this.afterRender();
		},
		initForm: function() {
			var that = this;
			this.form = Design.widget('form', {
				style:{
					width: 370,
					height: 230
				},
				drag: true,
				title: {
					text: '添加'
				},
				buttons: [{
					text: '确定',
					handler: function(_form) {
						var model = _form.saveModel();
						var id = model.get('id');
						
						model.save(function(data) {
							if (id) {
								beforeNode.name = model.get('name');
								beforeNode.holdData = model.get('holdData');
								that.virtualTree.getTreeObj().updateNode(beforeNode);
							}
							else {
								that.virtualTree.getTreeObj().addNodes(beforeNode, Design.applyIf(model.data))
							}
							that.form.remove();
						},function() {
							alert('保存失败')
						})
					}
				},{
					text: '取消', 
					handler: function() {
						that.form.remove();
					}
				}],
				bodyPadding: 45,
				items: [{
					xtype:'textfield',
					label:'名称 ',
					labelWidth: 70,
					allowBlank: false,
					name:'name',
					fieldStyle: {
						width: 200
					}
				},{
					xtype:'combobox',
					label:'持有数据',
					displayField: 'value',
					valueField: 'id',
					allowBlank: false,
					data: [{id: 1, value: '是'}, {id: 0, value: '否'}],
					labelWidth: 70,
					name:'holdData',
					fieldStyle: {
						width: 200
					}
				}]
			});
		},
		initMenu: function() {
			var that = this;
			this.menu = Design.widget('menu', {
				style: {
					width: 40
				},
				items: [{
					xtype: 'button',
					text: '添加',
					handler: function() {
					
						if (!beforeNode) {
							alert('请选择节点');
							return;
						}
						if (beforeNode.isOrgan) {
							alert('机构节点不允许添加');
							return;
						}
					
						var pId ;
						if (beforeNode) {
							pId = beforeNode.id
						}
						that.form.show();
						var json = Design.apply({
							'parent.id': pId
						}, that.defaultValue);
						var model = new Design.models.bas.VirtualOrgan(json);
						
						that.form.setModel(model);
					}
				},{
					xtype: 'button',
					text: '修改',
					handler: function() {
						if (!beforeNode) {
							alert('请选择节点');
							return;
						}
						if (beforeNode.isOrgan) {
							alert('机构节点不允许编辑');
							return;
						}
						that.form.show();
						that.form.setTitle('修改');
						var json = Design.applyIf({
							id: beforeNode.id,
							name: beforeNode.name,
							holdData: beforeNode.holdData
						}, that.defaultValue);
						var model = new Design.models.bas.VirtualOrgan(json);
						that.form.setModel(model);
					}
				},{
					xtype: 'button',
					text: '删除',
					handler: function() {
						if (!confirm('是否要删除')) {
						    return;
						}
						if (!beforeNode) {
							alert('请选择节点');
							return;
						}
						var treeObj = that.virtualTree.getTreeObj();
						var treeObj2 = that.organTree.getTreeObj();
						
						var id = beforeNode.id;
						if (beforeNode.isOrgan) {
							id = beforeNode.virtualId;
						}
						var deleteOrganByNode = function(node) {
							if (node.isOrgan) { 
								resetOrgan(treeObj2, node);
							}
							else if (node.children) {
								node.children.forEach(function(n) {
									if (n.isOrgan) { 
										resetOrgan(treeObj2, n);
										return;
									}
									if (n.children) {
										deleteOrganByNode(n);
									}
								});
							}
						}
						if (!id) {
							deleteOrganByNode(beforeNode);
							treeObj.removeNode(beforeNode);
							return;
						}
						var model = new Design.models.bas.VirtualOrgan({
							id: id
						});
						model.remove(function(){
							deleteOrganByNode(beforeNode);
							treeObj.removeNode(beforeNode);
						}, function() {
							alert('删除失败');
						});
					}
				}]
			});
		},
		initVirtualTree: function() {
			var that = this;
			this.virtualTree = Design.widget('tree', {
				title: {
					text: '虚拟机构'
				},
				bodyPadding:10,
				bodyStyle: {
					overflow: 'auto'
				},
				style: {
					width: '49%',
					height: '100%',
					'margin-right': '1%',
					float: 'left'
				},
				setting: {
					callback: {
						onRightClick: function(e, treeId, treeNode) {
							var xy = Design.getLocation(this.el,e);
							that.virtualTree.getTreeObj().cancelSelectedNode();
							that.virtualTree.getTreeObj().selectNode(treeNode);
							beforeNode = treeNode;
							if (!that.virtualTree.getTreeObj().getNodes().length || treeNode){ 
								that.menu.showAt(this.el,xy);
								return false;
							}
							return true;
						},
						beforeDrop: function(treeId, treeNodes, targetNode, moveType) {
						
							var organTree = that.organTree.getTreeObj();
							var virtualTree = that.virtualTree.getTreeObj();
							if (!targetNode || targetNode.isOrgan) {
								treeNodes.forEach(function(node) {
									resetOrgan(organTree, node, virtualTree);
									that.virtualTree.getTreeObj().removeNode(node);
								});
								return false;
							}
							return true;
						}
					},
					edit: {
						drag: {
							autoExpandTrigger: true,
							prev: function() {
								return false;
							},
							inner: function(treeId, nodes, targetNode) {
								if (!targetNode){
									return false;
								}
								if (nodes && !nodes[0].isOrgan) {
									return false
								}
								return !targetNode.isOrgan;
							},
							next: function() {
								return false;
							}
						},
						enable: true,
						showRemoveBtn: false,
						showRenameBtn: false
					}
				},
				displayField: 'name',
				datas: that.virtualData
			});
		},
		initOrganTree: function() {
			var that = this;
			this.organTree = Design.widget('tree', {
				title: {
					text: '实际机构'
				},
				setting: {
					callback: {
						onDrop: function(e,treeId, treeNodes, targetNode, moveType) {
							var virtualTree = that.virtualTree.getTreeObj();
							var organTree = that.organTree.getTreeObj();
							if (treeNodes) {
								treeNodes.forEach(function(node) {
									var icon = 'icon-organ-add';
									
									var pNode =organTree.getNodesByParam('id', node.baseParentId, null)[0];
									if (pNode) {
										pNode.isParent = true;
										organTree.updateNode(pNode);
									}
									if (node.children && node.children.length) {
										resetChildNode(virtualTree, node);
										icon = 'icon-organ';
										node.type = 3;
									}
									else {
										node.type = 1;
									}
									
									organTree.expandNode(node, false, true, true);
									
									node.isParent = false;
									node.iconSkin = icon;
									organTree.updateNode(node);
									
								});
								
							}
						}
					},
					edit: {
						drag: {
							autoExpandTrigger: true,
							prev: function() {
								return false;
							},
							inner: function(treeId, nodes, targetNode) {
								
								if (!nodes){
									return false;
								}
								return nodes[0].isOrgan && !nodes[0].getParentNode().isOrgan;
							},
							next: function() {
								return false;
							}
						},
						enable: true,
						showRemoveBtn: false,
						showRenameBtn: false
					}
				},
				style: {
					width: '50%',
					height: '100%',
					float: 'left'
				},
				bodyPadding:10,
				bodyStyle: {
					overflow: 'auto'
				},
				displayField: 'name',
				datas: that.organData
			});
		},
		initPanel: function() {
			var that = this;
			this.panel = Design.widget('panel', {
			
				toolbar: [{
					dock: 'top',
					items: [{
						xtype:'button',
						label: '保存',
						labelWidth: 50,
						handler: function() {
							var treeObj = that.virtualTree.getTreeObj();
							var organs = treeObj.getNodesByParam('isOrgan', true ,null);
							
							var organIds = [],
								parentIds = [],
								names = [];
								types = [];
								
							organs.forEach(function(node){
								if (!node.getParentNode().isOrgan) {
									organIds.push(node.id);
									parentIds.push(node.getParentNode().id);
									names.push(node.name);
									types.push(node.type);
								}
							});
							Design.ajax({
								params: Design.applyIf({types: types, names: names, ids: organIds, pIds: parentIds},that.defaultValue),
								url: './virtualOrgan2/saveOrgan',
								success: function(data) {
									alert('保存成功');
								},
								error: function() {
									
									alert('提交失败');
								}
							});
							
						},
						iconCls: 'icon-save'
					}]
				}],
				bodyPadding: 20,
				style: {
					width: '100%',
					height: '100%'
				},
				items: [that.virtualTree,that.organTree]
			});
		}
	});
})();