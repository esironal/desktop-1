
	Design.define('Design.tree.Tree', {
		extend: 'Design.panel.Panel',
	
		alias: 'widget.tree',
		events:{
			'click li': 'itemcontextmenu'
		},
		itemcontextmenu: function(e) {
			
		},
		searchNode: function(value) {
						
			if (!value) {
				value = "#########";
			}
			
			var itemTreeObj = this.getObject();
			var isSelect = false;
			itemTreeObj.selectNode(null, false);
			
			itemTreeObj.transformToArray(itemTreeObj.getNodes()).forEach(function(item) {
				item.highlight = undefined;
				if (item.name.indexOf(value) > -1) {
					if (isSelect == false) {
						itemTreeObj.selectNode(item, false);
						isSelect = true;
					}
					else {
						itemTreeObj.selectNode(item, true);
					}
					item.highlight = true;
				} 
				itemTreeObj.updateNode(item);
			});
		},
		initialize: function(cfg) {
		    var that = this;
		    cfg.setting = cfg.setting || {};
		    var setting = {
		        callback: {},
		        edit: {},
		        view: {
		            fontCss: function (treeId, treeNode) {
		                return treeNode.highlight ? { color: "#A60000", "font-weight": "bold" } : { color: "#333", "font-weight": "normal" }
		            }
		        }
		    }

		    Design.apply(setting, cfg.setting)

		    if (cfg.setting.callback) {
		        for (var i in cfg.setting.callback) {
		            setting.callback[i] = Design.bind(cfg.setting.callback[i], this)
		        }
		    }

		    $.fn.zTree.init($(this.bodyEl), setting, cfg.datas);
		    $(this.bodyEl).addClass('ztree');
		    $(this.bodyEl).css('overflow-y', 'auto');
		    this.setting = setting;
		    Design.tree.Tree.superclass.initialize.call(this, cfg);
		},
		bindData: function(data) {
			$.fn.zTree.init($(this.bodyEl), this.setting, data);
		},
		getTreeObj: function() {
			return $.fn.zTree.getZTreeObj(this.bodyEl.id);
		},
		getObject: function() {
			return this.getTreeObj();
		},
		onTreeClick: function(event, treeId, treeNode, clickFlag){
			if (Design.isFunction(this.onClick)) {
				this.onClick(treeId, treeNode)
			}
		},
		onCheck: function() {}
	});
	
