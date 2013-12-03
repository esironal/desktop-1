var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../Compoment", "../menu/ContextMenu", "./OpenMode", "../form/Form"], function(require, exports, __com__, __cmenu__, __om__, __form__) {
    var com = __com__;
    var cmenu = __cmenu__;
    var om = __om__;
    var form = __form__;

    om.Module.addApplication([
        {
            name: 'createFloder',
            code: 'createFloder',
            openType: 'createFloder',
            handler: function (cmp) {
                $.ajax({
                    type: 'POST',
                    data: { parent_id: cmp.folder_id, type: 'folder', name: '新建文件夹' },
                    url: 'createFile',
                    success: function (data) {
                        cmp.getItemsByPath(cmp.path);
                    },
                    error: function () {
                    }
                });
            }
        }
    ]);

    om.Module.addApplication([
        {
            name: 'createVideo',
            code: 'createVideo',
            openType: 'createVideo',
            handler: function (cmp) {
                var panel = new form.Form({
                    url: 'createFile',
                    items: [
                        {
                            xtype: 'textfield',
                            label: '名称',
                            name: 'name'
                        },
                        {
                            xtype: 'combobox',
                            label: '类型',
                            data: [
                                {
                                    key: 'baiduPlayer',
                                    value: '百度影音'
                                },
                                {
                                    key: 'youkuPlayer',
                                    value: '优酷视频'
                                }
                            ],
                            name: 'type'
                        },
                        {
                            xtype: 'textfield',
                            label: '地址',
                            name: 'filePath'
                        }
                    ],
                    dialog: true,
                    width: 300,
                    height: 400,
                    buttons: [
                        {
                            text: '取消',
                            handler: function () {
                                alert('取消');
                            }
                        },
                        {
                            text: '确定',
                            handler: function () {
                                panel.submit({
                                    params: {
                                        parent_id: cmp.folder_id
                                    },
                                    success: function () {
                                        cmp.getItemsByPath(cmp.path);
                                    }
                                });
                            }
                        }
                    ]
                });

                panel.render();
            }
        }
    ]);

    var Table = (function (_super) {
        __extends(Table, _super);
        function Table() {
            _super.apply(this, arguments);
            this.role = "table";
            this.layout = "";
            this.horiz = false;
            this.vertical = false;
            this.targetCmp = {};
            this.events = {
                "click ": "clickShortcut",
                "contextmenu": 'contextmenu'
            };
            this.template = [
                '<div id="${me.id}" class="desktop-table-container" style="height:100%">',
                '<table class="desktop-table">',
                '<tbody id="${me.id}-body">',
                '</tbody>',
                '</table>',
                '</div>'
            ];
        }
        Table.prototype.clickShortcut = function (event) {
            if (window['keyDownMap'] && window['keyDownMap']['17']) {
                return;
            }

            $(this.element).find(".desktop-icon").removeClass("active");
            $(event.target).parents(".desktop-icon").addClass("active");
            $('.content-menu').remove();
        };

        Table.prototype.contextmenu = function (event) {
            //return true
            $('.content-menu').remove();
            var self = this;

            var menu = new cmenu.ContextMenu({
                top: event.pageY,
                left: event.pageX,
                targetCmp: self.targetCmp,
                items: [
                    {
                        text: "粘贴"
                    },
                    {
                        text: "刷新"
                    },
                    {
                        text: "",
                        divider: true
                    },
                    {
                        text: "新建",
                        children: [
                            {
                                text: '文件夹',
                                code: 'createFloder'
                            },
                            {
                                text: '影视资源',
                                code: 'createVideo'
                            }
                        ]
                    },
                    {
                        text: "属性"
                    }
                ]
            });
            menu.render();

            return false;
        };

        Table.prototype.initItems = function (item) {
            var that = this;
            var items = item ? [item] : this.items;

            if (this.vertical !== true) {
                for (var i = 0, len = items.length; i < len; i++) {
                    $.extend(items[i], items[i].config);
                    items[i].initialize();
                    items[i].setStyle("display", "inline-block");
                    items[i].setStyle("vertical-align", "top");
                    that.bodyElement.appendChild(items[i].element);
                    items[i]._afterRender();
                }
            } else {
                for (var i = 0, len = items.length; i < len; i++) {
                    $.extend(items[i], items[i].config);
                    items[i].initialize();
                    that.bodyElement.appendChild(items[i].element);
                    items[i]._afterRender();
                }
            }
        };

        Table.prototype.onResize = function () {
            var self = this;
            if ($(this.element).parent().width() < $(this.element).find("tbody").width()) {
            }
        };
        return Table;
    })(com.Compoment);
    exports.Table = Table;
});
