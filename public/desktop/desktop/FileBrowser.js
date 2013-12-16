var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../panel/Panel", "./Shortcut"], function(require, exports, __pan__, __sho__) {
    var pan = __pan__;
    
    
    var sho = __sho__;
    
    

    var FileBrowser = (function (_super) {
        __extends(FileBrowser, _super);
        function FileBrowser() {
            _super.apply(this, arguments);
            this.role = "file-browser";
            this.title = "Root";
            this.icon = 'file-browser';
            this.dialog = true;
            this.backs = [];
            this.aheads = [];
            this.table = null;
            this.folder_id = '';
            this.overflow_y = "auto";
            this.path = "";
            this.pathMap = {};
            this.selectMap = {};
            this.events = {
                "mousedown": "setFocus",
                "click .icon-win8-min": "hide",
                "click .icon-win8-close": "destroy",
                "click .icon-win8-max": "max",
                "click .fb-icon-back": "back",
                "click .fb-icon-ahead": "ahead",
                "click .fb-icon-back-active": "back",
                "click .fb-icon-ahead-active": "ahead",
                "click .win-panel-body": "clickBodyPanel",
                'click button': 'clickBtn',
                'mousedown .title': 'mousedownTitle'
            };
            this.template = [
                '<div class="win-panel ${me.className}" id="${me.id}" filebrowser="${me.file_id}" style ="${me.style}">',
                '<div class="header">',
                '<span class="title">${me.title}</span>',
                '<div class="panel-title-buttons">',
                '<div class="icon icon-win8-close"> </div>',
                '<div class="icon icon-win8-max"> </div>',
                '<div class="icon icon-win8-min"> </div>',
                '</div>',
                '</div>',
                '<div class="fb-tool" style="">',
                '<div class="icon fb-icon-go fb-icon-back"></div>',
                '<div class="icon fb-icon-go fb-icon-ahead"></div>',
                '<div class="icon fb-icon-triangle"></div>',
                '<div class="icon fb-icon-arrow"></div>',
                '<div class="fb-src-input">',
                '<div class="fb-icon-computer"></div>',
                '<input type="text" class="fb-path-input" readonly="readonly" value="" />',
                '</div>',
                '<div class="fb-icon-refresh" style="">',
                '<div class="refresh"></div>',
                '</div>',
                '</div>',
                '<div  class="win-panel-body" style="top:71px;overflow-y:auto">',
                '<div id="${me.id}" class="desktop-table-container" style="height:100%">',
                '<table class="desktop-table">',
                '<tbody id="${me.id}-body">',
                '</tbody>',
                '</table>',
                '</div>',
                '</div>',
                '</div>'
            ];
        }
        FileBrowser.prototype.clickBodyPanel = function (event) {
            if (!$(event.target).hasClass('shortcut-icon') && !$(event.target).parents('.shortcut-icon').length)
                this.find('.desktop-icon').removeClass("active");
        };

        FileBrowser.prototype.addShortcuts = function (items) {
            var shorts = [];

            for (var i = 0, len = items.length; i < len; i++) {
                var shortcut = new sho.Shortcut(items[i]);

                shortcut['style'] = {
                    "display": "inline-block",
                    "vertical-align": "top"
                };

                shorts.push(shortcut);
            }

            this.bindItems(shorts);
        };

        FileBrowser.prototype.activeAheadIcon = function (isActive) {
            if (isActive) {
                this.find('.fb-icon-ahead').addClass('fb-icon-ahead-active');
                this.find('.fb-icon-ahead').removeClass('fb-icon-ahead');
            } else {
                this.find('.fb-icon-ahead-active').addClass('fb-icon-ahead');
                this.find('.fb-icon-ahead-active').removeClass('fb-icon-ahead-active');
            }
        };

        FileBrowser.prototype.activeBackIcon = function (isActive) {
            if (isActive) {
                this.find('.fb-icon-back').addClass('fb-icon-back-active');
                this.find('.fb-icon-back').removeClass('fb-icon-back');
            } else {
                this.find('.fb-icon-back-active').addClass('fb-icon-back');
                this.find('.fb-icon-back-active').removeClass('fb-icon-back-active');
            }
        };

        FileBrowser.prototype.ahead = function () {
        };

        FileBrowser.prototype.back = function () {
        };

        FileBrowser.prototype.setPath = function (path) {
            $(this.element).find(".fb-path-input").val(path);
            this.path = path;
        };

        FileBrowser.prototype.setTitle = function (name) {
            this.find('.title').html(name);
            this.title = name;
        };

        FileBrowser.prototype.getPath = function () {
            return this.path;
        };
        return FileBrowser;
    })(pan.Panel);
    exports.FileBrowser = FileBrowser;
});
