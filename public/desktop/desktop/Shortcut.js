var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../Compoment", "../menu/ContextMenu", "./OpenMode", "../core/src/Util"], function(require, exports, __com__, __cmenu__, __om__, __util__) {
    var com = __com__;
    var cmenu = __cmenu__;
    var om = __om__;
    
    var util = __util__;

    om.Module.addApplication([
        {
            name: 'rename',
            code: 'rename',
            openType: 'rename',
            handler: function (cmp) {
                var text = cmp.find('.shortcut-text').html(), el = document.createElement('input');

                $(el).attr('type', 'text').css({ width: '100px' }).val(text);
                $(el).height(13);
                cmp.find('.shortcut-text').html(el);

                $(el).blur(function (event) {
                    $.ajax({
                        type: 'POST',
                        data: { id: cmp._id, name: $(el).val() },
                        url: 'updateFileName',
                        success: function (data) {
                            cmp.find('.shortcut-text').html($(el).val());
                            cmp.name = $(el).val();
                            cmp.path = cmp.targetCmp.path ? (cmp.targetCmp.path + "/" + cmp.name) : cmp.name;
                        },
                        error: function () {
                        }
                    });
                });

                $(el).focus();
            }
        },
        {
            name: 'delete',
            code: 'delete',
            openType: 'delete',
            handler: function (cmp) {
                $.ajax({
                    type: 'POST',
                    data: { id: cmp._id },
                    url: 'deleteFile',
                    success: function (data) {
                        cmp.destroy();
                    },
                    error: function () {
                    }
                });
            }
        }
    ]);

    var Shortcut = (function (_super) {
        __extends(Shortcut, _super);
        function Shortcut() {
            _super.apply(this, arguments);
            this.role = "shortcut";
            this.color = "#fff";
            this.image = "wodediannao.png";
            this.iconCls = "";
            this.type = "";
            this.openMode = "";
            this.events = {
                "dblclick ": "dblclick",
                "click ": "click",
                "contextmenu": 'contextmenu'
            };
            this.template = [
                '<div class="desktop-icon " id="${me.id}" draggable="true" fileId="${me._id}">',
                '<div class="{if me.type !=="image/jpeg"}${ me.icon || me.getIconCls(me.type)}-icon{/if}">{if me.type =="image/jpeg"} <div style="width:110px;text-align:center;height:90px"><img style="max-height:90px" src="${me.filePath}" draggable="false"></img></div> {/if}</div>',
                '<div class="shortcut-text" style="color:${me.textColor};">${me.text || me.name}</div>',
                '</div>'
            ];
        }
        Shortcut.prototype.contextmenu = function (event) {
            //return true
            event.stopPropagation();

            $('.content-menu').remove();
            $(".desktop-icon").removeClass("active");
            this.addClass("active");
            var self = this;
            var openModes = om.Module.getAppNames(this.type);

            var menu = new cmenu.ContextMenu({
                top: event.pageY,
                left: event.pageX,
                targetCmp: self,
                items: (function () {
                    var list = [];

                    list.push({
                        text: "打开"
                    });

                    if (openModes) {
                        list.push({
                            text: "打开方式",
                            children: openModes
                        });
                    }
                    list.push({
                        text: "复制"
                    }, {
                        text: "",
                        divider: true
                    }, {
                        text: "删除",
                        code: 'delete'
                    }, {
                        text: "重命名",
                        code: 'rename'
                    }, {
                        text: "属性"
                    });

                    return list;
                })()
            });
            menu.render();

            return false;
        };
        Shortcut.prototype.click = function () {
        };

        Shortcut.prototype.getIconCls = function (type) {
            if (type === "folder") {
                return "folder";
            }
            if (type === "txt") {
                return "icon-txt";
            }
            if (type === "video/mp4") {
                return "video";
            }
            return "default";
            //return type;
        };

        Shortcut.prototype.dblclick = function (event) {
            var apps = om.Module.getAppsByType(this.type);
            om.Module.excute(apps[0].code, this);
        };

        Shortcut.prototype.onDrop = function (trigger, target) {
        };

        Shortcut.prototype._afterRender = function () {
            var self = this;

            this.element.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData("moveCmp", (e.target).id);
            });

            if (this.type !== 'folder') {
                return;
            }

            this.element.addEventListener('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
                self.removeClass('shortcut-dragover');

                var md = e.dataTransfer.getData("moveCmp");
                self.onDrop(util.getCmp(md), self);
                //util.getCmp(md).destroy();
            });

            this.element.addEventListener('dragover', function (e) {
                self.addClass('shortcut-dragover');
            });

            this.element.addEventListener('dragleave', function (e) {
                self.removeClass('shortcut-dragover');
            });
        };
        return Shortcut;
    })(com.Compoment);
    exports.Shortcut = Shortcut;
});
