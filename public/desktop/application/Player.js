var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../panel/Panel", '../core/src/Util'], function(require, exports, __panel__, __util__) {
    var panel = __panel__;
    var util = __util__;

    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            _super.apply(this, arguments);
            this.filePath = 'video/Gee.mp4';
            this.icon = 'bplayer';
            this.type = '';
            this.width = $("body").width() / 2;
            this.height = $("body").height() / 1.5;
            this.backgroundColor = '#000';
        }
        Player.prototype.initElement = function () {
            _super.prototype.initElement.call(this);

            if (this.type === "baiduPlayer") {
                this.setHtml('<object id="BaiduPlayer" name="BaiduPlayer" type="application/player-activex" width="100%" height="100%" progid="Xbdyy.PlayCtrl.1"  param_url="' + this.filePath + '"  param_onplay="onPlay" param_onpause="onPause" param_onfirstbufferingstart="onFirstBufferingStart" param_onfirstbufferingend="onFirstBufferingEnd" param_onplaybufferingstart="onPlayBufferingStart" param_onplaybufferingend="onPlayBufferingEnd" param_oncomplete="onComplete" param_autoplay="1" param_showstartclient="1"></object><object classid = "clsid:02E2D748-67F8-48B4-8AB4-0A085374BB99" width = "100%" height = "100%" id = "BaiduPlayer" name = "BaiduPlayer" >  <param name = "URL" value = "' + this.filePath + '" >  <param name = "Autoplay" value = "1" ></object> ');
            } else {
                //this.setHtml('<embed src = "http://player.youku.com/player.php/Type/Folder/Fid/20902708/Ob/1/sid/XNjM4NDYzNjI4/v.swf" quality = "high" width = "480" height = "400" align = "middle" allowScriptAccess = "always" allowFullScreen = "true" mode = "transparent" type = "application/x-shockwave-flash" >< / embed>');
                //this.setHtml('<iframe height = 498 width = 510 src = "http://player.youku.com/embed/XNjM4NDYzNjI4" frameborder = 0 allowfullscreen >< / iframe>');
                this.setHtml('<video  width="100%" height="100%" src="' + this.filePath + '" controls="controls"></video>');
            }
        };

        Player.prototype.setDialog = function () {
            var self = this;
            this.setStyle('position', 'absolute');
            this.setMaxIndex();

            this.max = util.dialog({
                element: self.element,
                eventEl: $(self.element).find('.header')[0],
                onMove: function () {
                    $(self.bodyElement).find('iframe').hide();
                    $(self.bodyElement).find('video').hide();
                    // $(self.bodyElement).find('object').hide();
                },
                onMouseUp: function () {
                    $(self.bodyElement).find('iframe').show();
                    $(self.bodyElement).find('video').show();
                    // $(self.bodyElement).find('object').show();
                },
                onResize: function () {
                    self.onResize();
                }
            }).max;
        };
        return Player;
    })(panel.Panel);
    exports.Player = Player;
});
