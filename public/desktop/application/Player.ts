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
            this.setHtml('<object classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" width="100%" height="100%" id="QvodPlayer" name="QvodPlayer" onError=if(window.confirm(\'请您先安装QvodPlayer软件,然后刷新本页才可以正常播放.\')){window.open(\'http://www.qvod.com/download.htm\')}else{self.location=\'http://www.qvod.com/\'}><PARAM NAME=\'URL\' VALUE=\'' + this.filePath + '\'><PARAM NAME=\'Autoplay\' VALUE=\'1\'><embed style="width:100%;height:100%;" URL=\'' + this.filePath + '\' type=\'application/qvod-plugin\'></embed></object>');
        }
        else if(this.type === 'flashPlayer') {
            this.setHtml('<embed src="' + this.filePath + '" allowFullScreen="true" quality="high" width="100%" height="100%" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>');
        }
        else if (this.type === 'qvodPlayer') {
            this.setHtml('<object classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" width="100%" height="100%" id="QvodPlayer" name="QvodPlayer" onError=if(window.confirm(\'请您先安装QvodPlayer软件,然后刷新本页才可以正常播放.\')){window.open(\'http://www.qvod.com/download.htm\')}else{self.location=\'http://www.qvod.com/\'}><PARAM NAME=\'URL\' VALUE=\'' + this.filePath + '\'><PARAM NAME=\'Autoplay\' VALUE=\'1\'><embed style="width:100%;height:100%;" URL=\'' + this.filePath + '\' type=\'application/qvod-plugin\'></embed></object>');
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