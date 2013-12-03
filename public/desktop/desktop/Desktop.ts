import com = require('../Compoment')
import tas = require('./TaskBar')
import tab = require('./Table')
import sho = require('./Shortcut')
import om = require("./OpenMode")

export class Desktop extends com.Compoment
{
    taskBar: tas.TaskBar;
    shortcuts= [];
    id = 'desktop';
    path = "desktop";
    template= [
        '<div id="${me.id}" style="width:100%;height:100%">',
            '<div class="fullscreen_post_bg"  style="background-image:url(\'../../resource/themes/images/kungfupanda6.jpg\');">',
            '</div>',
        '</div>'
    ];

    initItems() { 

        var that = this
            , shortcuts = [];
            
        this.beforeInit();
        
        this.taskBar = new tas.TaskBar()
        for (var i = 0, l = this.shortcuts.length; i < l; i++) 
        { 
            var item = this.shortcuts[i];
            item.textColor = "#fff";
            item.taskBar = this.taskBar;
            item.path = 'desktop';
            
            shortcuts.push(new sho.Shortcut(item));
        }
        var table = new tab.Table(
        {
            targetCmp: that,
            vertical: true,
            items: shortcuts
        });
        this.add(table);
        this.add(this.taskBar);
        
        super.initItems();
    }

    initialize() 
    { 
        super.initialize();
    }

}
