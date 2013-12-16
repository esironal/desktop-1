
import com = require("../Compoment")
import cmenu = require("../menu/ContextMenu")
import om = require("./OpenMode")
import tb = require("./TaskBar")
import util = require("../core/src/Util")



export class Shortcut extends com.Compoment{
    
    role = "shortcut";
    color = "#fff";
    image = "wodediannao.png";
    iconCls = "";
    type = "";
    taskBar: tb.TaskBar;
    openMode = "";
    targetCmp: any;
    events = {
        "dblclick ": "dblclick",
        "click ": "click",
        "contextmenu": 'contextmenu'
    };

    contextmenu(event) {
        return true
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
            items: () =>{ 
                var list = [];
                
                list.push({
                    text: "打开"
                });
                
                if (openModes)
                { 
                    list.push({
                        text: "打开方式",
                        children: openModes
                    })
                } 
                list.push({
                    text: "复制"
                }, {
                    text: "",
                    divider: true
                }, {
                    text: "删除",
                    code: 'delete'
                },
                {
                    text: "重命名",
                    code: 'rename'
                },
                {
                    text: "属性"
                });

                return list;
            }()
        });
        menu.render(); 

        return false;
    }
    click()
    { 
        this.setActive();
    }

    setActive() {
        $(".desktop-icon").removeClass("active");
        this.addClass("active");
    }

    getIconClsByType(type: string) 
    {
        if(type==="folder" ){
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
    }
    
    dblclick(event) 
    { 
        var apps = om.Module.getAppsByType(this.type);
        om.Module.excute(apps[0].code, this);
    }

    template = [
        '<div class="desktop-icon shortcut-icon" id="${me.id}" >', 
            '<div class="${ me.icon || me.getIconClsByType(me.type) }"></div>',
            '<div class="shortcut-text" style="color:${me.textColor};">${me.text || me.name}</div>',
        '</div>'
    ];
}

