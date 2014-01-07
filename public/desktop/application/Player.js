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
                this.setHtml('<object classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" width="100%" height="100%" id="QvodPlayer" name="QvodPlayer" onError=if(window.confirm(\'�����Ȱ�װQvodPlayer���,Ȼ��ˢ�±�ҳ�ſ�����������.\')){window.open(\'http://www.qvod.com/download.htm\')}else{self.location=\'http://www.qvod.com/\'}><PARAM NAME=\'URL\' VALUE=\'' + this.filePath + '\'><PARAM NAME=\'Autoplay\' VALUE=\'1\'><embed URL=\'qvod://222013754|2741085D552DB65D5E71B767BB1473EEC4B0626E|������ҵ�08��.rmvb|\' type=\'application/qvod-plugin\'></embed></object>');
            } else if (this.type === 'flashPlayer') {
                this.setHtml('<embed src="' + this.filePath + '" allowFullScreen="true" quality="high" width="100%" height="100%" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>');
            } else if (this.type === 'qvodPlayer') {
                this.setHtml('<object classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" width="100%" height="100%" id="QvodPlayer" name="QvodPlayer" onError=if(window.confirm(\'�����Ȱ�װQvodPlayer���,Ȼ��ˢ�±�ҳ�ſ�����������.\')){window.open(\'http://www.qvod.com/download.htm\')}else{self.location=\'http://www.qvod.com/\'}><PARAM NAME=\'URL\' VALUE=\'' + this.filePath + '\'><PARAM NAME=\'Autoplay\' VALUE=\'1\'><embed URL=\'qvod://222013754|2741085D552DB65D5E71B767BB1473EEC4B0626E|������ҵ�08��.rmvb|\' type=\'application/qvod-plugin\'></embed></object>');
            }
        };

        Player.prototype.hide = function () {
            //alert('h')
            this.setStyle('z-index', '-1000');
            this.removeClass('win-panel-focus');
            //super.hide();
        };

        Player.prototype.setDialog = function () {
            var self = this;
            this.setStyle('position', 'absolute');
            this.setMaxIndex();

            this.max = util.dialog({
                element: self.element,
                eventEl: $(self.element).find('.header')[0],
                onMove: function () {
                    // $(self.bodyElement).find('iframe').hide();
                    // $(self.bodyElement).find('video').hide();
                    // $(self.bodyElement).find('object').hide();
                },
                onMouseUp: function () {
                    //  $(self.bodyElement).find('iframe').show();
                    // $(self.bodyElement).find('video').show();
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
