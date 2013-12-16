var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Compoment', './TaskBar', './Table', './Shortcut'], function(require, exports, __com__, __tas__, __tab__, __sho__) {
    var com = __com__;
    var tas = __tas__;
    var tab = __tab__;
    var sho = __sho__;
    

    var Desktop = (function (_super) {
        __extends(Desktop, _super);
        function Desktop() {
            _super.apply(this, arguments);
            this.shortcuts = [];
            this.id = 'desktop';
            this.path = "desktop";
            this.template = [
                '<div id="${me.id}" style="width:100%;height:100%">',
                '<div class="fullscreen_post_bg"  style="background-image:url(\'../../resource/themes/images/img0.jpg\');">',
                '</div>',
                '</div>'
            ];
        }
        Desktop.prototype.initItems = function () {
            var that = this, shortcuts = [];

            this.beforeInit();

            this.taskBar = new tas.TaskBar();
            for (var i = 0, l = this.shortcuts.length; i < l; i++) {
                var item = this.shortcuts[i];
                item.textColor = "#fff";
                item.taskBar = this.taskBar;
                item.path = 'desktop';

                shortcuts.push(new sho.Shortcut(item));
            }
            var table = new tab.Table({
                targetCmp: that,
                vertical: true,
                items: shortcuts
            });
            this.add(table);
            this.add(this.taskBar);

            _super.prototype.initItems.call(this);
        };

        Desktop.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
        };
        return Desktop;
    })(com.Compoment);
    exports.Desktop = Desktop;
});
