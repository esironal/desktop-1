var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../panel/Panel"], function(require, exports, __basePanel__) {
    var basePanel = __basePanel__;

    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            _super.apply(this, arguments);
            this.headerHeight = 40;
            this.template = [
                '<div class="win-panel ${me.className}" id="${me.id} " style ="${me.style}">',
                '<div class="header">',
                '{for tab in me.items}',
                '<div class="tab-title "><span>${tab.title}</span></div>',
                '{/for}',
                '<div class="panel-title-buttons">',
                '<div class="icon icon-win8-close"> </div>',
                '<div class="icon icon-win8-max"> </div>',
                '<div class="icon icon-win8-min"> </div> ',
                '</div>',
                '</div>',
                '<div id="${me.id}-body" class="win-panel-body">',
                '</div>',
                '</div>'
            ];
        }
        Panel.prototype.onResize = function () {
            _super.prototype.onResize.call(this);
            var elWidth = $(this.element).width();

            $(this.element).find(".tab-title-bar").width(elWidth - 14);
        };

        Panel.prototype.initItems = function () {
            var that = this;

            this.items.forEach(function (cmp) {
                cmp.parentCmp = that;
                cmp.initialize();
            });

            that.bodyElement.appendChild(this.items[0].element);
        };
        return Panel;
    })(basePanel.Panel);
    exports.Panel = Panel;
});
