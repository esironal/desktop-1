import panel = require("../panel/Panel");
import util = require('../core/src/Util')

export class Player extends panel.Panel { 
    filePath = 'video/Gee.mp4';
    icon = 'bplayer';
    type = '';
    width = $("body").width() / 2;
    height = $("body").height() / 1.5; 
    backgroundColor = '#000';
    initElement() { 
        super.initElement();
        //this.setTitle(this.name);
        if (this.type === "baiduPlayer") {
            this.setHtml('<object id="BaiduPlayer" name="BaiduPlayer" type="application/player-activex" width="100%" height="100%" progid="Xbdyy.PlayCtrl.1"  param_url="' + this.filePath + '"  param_onplay="onPlay" param_onpause="onPause" param_onfirstbufferingstart="onFirstBufferingStart" param_onfirstbufferingend="onFirstBufferingEnd" param_onplaybufferingstart="onPlayBufferingStart" param_onplaybufferingend="onPlayBufferingEnd" param_oncomplete="onComplete" param_autoplay="1" param_showstartclient="1"></object><object classid = "clsid:02E2D748-67F8-48B4-8AB4-0A085374BB99" width = "100%" height = "100%" id = "BaiduPlayer" name = "BaiduPlayer" >  <param name = "URL" value = "' + this.filePath + '" >  <param name = "Autoplay" value = "1" ></object> '); 
        }
        else if(this.type === 'flashPlayer') {
            this.setHtml('<embed src="' + this.filePath + '" allowFullScreen="true" quality="high" width="100%" height="100%" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>');
        }
        else if (this.type === 'qvodPlayer') {
            this.setHtml('<object classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" width="100%" height="100%" id="QvodPlayer" name="QvodPlayer" onError=if(window.confirm(\'请您先安装QvodPlayer软件,然后刷新本页才可以正常播放.\')){window.open(\'http://www.qvod.com/download.htm\')}else{self.location=\'http://www.qvod.com/\'}><PARAM NAME=\'URL\' VALUE=\'' + this.filePath + '\'><PARAM NAME=\'Autoplay\' VALUE=\'1\'><embed URL=\'qvod://222013754|2741085D552DB65D5E71B767BB1473EEC4B0626E|总理和我第08集.rmvb|\' type=\'application/qvod-plugin\'></embed></object>');
        }
    }

    hide() {
        //alert('h')
        this.setStyle('z-index', '-1000');
        this.removeClass('win-panel-focus');
        //super.hide();
    }

    setDialog() {
        var self = this
        ;
        this.setStyle('position', 'absolute');
        this.setMaxIndex();

        this.max = util.dialog(
        {
            element: self.element,
            eventEl: $(self.element).find('.header')[0],

            onMove: () => {
               // $(self.bodyElement).find('iframe').hide();
               // $(self.bodyElement).find('video').hide();

                // $(self.bodyElement).find('object').hide();
            },
            onMouseUp: () => {
              //  $(self.bodyElement).find('iframe').show();
               // $(self.bodyElement).find('video').show();
                // $(self.bodyElement).find('object').show();
            },
            onResize: () => {
                self.onResize();
            }
        }).max;
    }
}