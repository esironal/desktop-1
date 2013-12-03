var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Compoment', "../desktop/OpenMode"], function(require, exports, __com__, __om__) {
    var com = __com__;
    
    
    var om = __om__;

    var ContextMenu = (function (_super) {
        __extends(ContextMenu, _super);
        function ContextMenu(config) {
            if (typeof config === "undefined") { config = {}; }
            _super.call(this, config);
            this.role = 'content-menu';
            this.events = {
                "click li": "click"
            };
            this.top = 0;
            this.left = 0;
            this.targetCmp = null;
            this.template = [
                '<div id="${me.id}" class="content-menu" style="top:${me.top}px;left:${me.left}px">',
                '<ul id="${me.id}-body">',
                '</ul>',
                '</div>'
            ];
        }
        ContextMenu.prototype.click = function (event) {
            var target = $(event.target).parent("li");
            if (!$(target).find('.right-arrows')[0]) {
                var code = $(target).attr('code');
                om.Module.excute(code, this.targetCmp);
                $('.content-menu').remove();
            }

            event.stopPropagation();
        };

        ContextMenu.prototype.initItems = function () {
            var self = this;
            var childrenMenu = [];
            for (var i = 0, len = this.items.length; i < len; i++) {
                var $html;
                if (this.items[i]["divider"]) {
                    $html = $('<li  class="divider"></li>');
                } else {
                    $html = $('<li code="' + (this.items[i]['code'] || '') + '" ><a>' + (this.items[i]["name"] || this.items[i]["text"]) + (this.items[i]['children'] ? '<div class="right-arrows"></div>' : '') + '</a></li>');
                }

                if (this.items[i]['children']) {
                    (function (items, $li) {
                        var menu;
                        var isHover = false;

                        $li.hover(function (event) {
                            for (var i = 0, l = childrenMenu.length; i < l; i++) {
                                if (childrenMenu[i].pMenu !== $li) {
                                    childrenMenu[i].destroy();
                                    childrenMenu[i].element = null;
                                }
                            }

                            if (menu && menu.element)
                                return;
                            menu = new ContextMenu({
                                pMenu: $li,
                                targetCmp: self.targetCmp,
                                left: self.left + 150,
                                top: $(event.target).offset().top,
                                items: items
                            });
                            childrenMenu.push(menu);
                            menu.render();

                            $(menu.element).hover(function () {
                                isHover = true;
                            }, function () {
                                isHover = false;
                            });
                        }, function () {
                            setTimeout(function () {
                                if (!isHover) {
                                    menu.destroy();
                                    menu.element = null;
                                }
                            }, 10);
                        });
                    })(self.items[i]['children'], $html);
                } else {
                    $html.hover(function (event) {
                        for (var i = 0, l = childrenMenu.length; i < l; i++) {
                            if (childrenMenu[i].pMenu !== $html) {
                                childrenMenu[i].destroy();
                                childrenMenu[i].element = null;
                            }
                        }
                    });
                }

                $(this.bodyElement).append($html);
            }
        };
        return ContextMenu;
    })(com.Compoment);
    exports.ContextMenu = ContextMenu;
});
