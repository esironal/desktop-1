var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../Compoment", "../menu/ContextMenu", "./OpenMode"], function(require, exports, __com__, __cmenu__, __om__) {
    var com = __com__;
    var cmenu = __cmenu__;
    var om = __om__;
    
    

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
                '<div class="desktop-icon shortcut-icon" id="${me.id}" >',
                '<div class="${ me.icon || me.getIconClsByType(me.type) }"></div>',
                '<div class="shortcut-text" style="color:${me.textColor};">${me.text || me.name}</div>',
                '</div>'
            ];
        }
        Shortcut.prototype.contextmenu = function (event) {
            return true;
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
            this.setActive();
        };

        Shortcut.prototype.setActive = function () {
            $(".desktop-icon").removeClass("active");
            this.addClass("active");
        };

        Shortcut.prototype.getIconClsByType = function (type) {
            if (type === "folder") {
                return "folder-icon";
            }
            if (type === "txt") {
                return "icon-txt-icon";
            }
            if (type === "video/mp4") {
                return "video-icon";
            }
            return "default-icon";
            //return type;
        };

        Shortcut.prototype.dblclick = function (event) {
            var apps = om.Module.getAppsByType(this.type);
            om.Module.excute(apps[0].code, this);
        };
        return Shortcut;
    })(com.Compoment);
    exports.Shortcut = Shortcut;
});
