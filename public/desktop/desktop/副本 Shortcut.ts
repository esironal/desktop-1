
import com = require("../Compoment")
import cmenu = require("../menu/ContextMenu")
import om = require("./OpenMode")
import tb = require("./TaskBar")
import util = require("../core/src/Util")


om.Module.addApplication([{
    name: 'rename',
    code: 'rename',
    openType: 'rename',
    handler: function (cmp) 
    {
        var text = cmp.find('.shortcut-text').html()
            , el = <HTMLInputElement>document.createElement('input')
        ;

        $(el).attr('type', 'text').css({width: '100px'}).val(text);
        $(el).height(13)
        cmp.find('.shortcut-text').html(el);

        $(cmp.element).attr('draggable', 'false');
        function rename() {
            $.ajax(
            {
                type: 'POST',
                data: { id: cmp._id, name: $(el).val() },
                url: 'updateFileName',
                success: function (data) {

                    $('div[fileId=' + cmp._id + ']').each(function () {
                        var cmp = util.getCmp(this.id)
                        cmp.find('.shortcut-text').html($(el).val());
                        cmp.name = $(el).val();
                        cmp.path = cmp.targetCmp.path ? (cmp.targetCmp.path + "/" + cmp.name) : cmp.name;
                    });

                    $(cmp.element).attr('draggable', 'true');

                },
                error: function () {

                }
            });
        }

        $(el).blur(rename);
        $(el).keydown(function (event)
        {
            if (event.keyCode == 13) {
                rename();
            }
        });
        $(el).focus();
    }
}, {
    name: 'delete',
    code: 'delete',
    openType: 'delete',
    handler: function (cmp) 
    {
        $.ajax(
        {
            type: 'POST',
            data: { id: cmp._id},
            url: 'deleteFile',
            success: function (data) {
                $('div [fileId=' + cmp._id + ']').each(function () {
                    $(this).remove();
                });
            },
            error: function () {

            }
        });
    }
}]);

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
        "dblclick " : "dblclick",
        "click " : "click",
        "contextmenu": 'contextmenu'
        , 'dragstart': 'onDragstart'
        , 'drag': 'onDrag'
    };

    contextmenu(event) {
        //return true
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
        
    }

    getIconCls(type: string) 
    {
        if(type==="folder" ){
            return "folder";
        }
        if (type === "txt") {
            return "icon-txt";
        }
        if (type === "video/mp4") { 
            return "video";
        }
        return "default";
        //return type;
    }
    
    dblclick(event) 
    { 
        var apps = om.Module.getAppsByType(this.type);
        om.Module.excute(apps[0].code, this);
    }

    onDrop(trigger, target) {

    }

    onDragstart(e) {

    }

    onDrag(e) {

    }

    _afterRender()
    {
        var self = this
            ;


        if(this.type !== 'folder') {
            return;
        }

        this.element.addEventListener('drop', function (e)
        {
            e.stopPropagation();
            e.preventDefault();
            self.removeClass('shortcut-dragover');

            var ids = e.dataTransfer.getData("moveCmp").split(',');

            var cmps = [];

            for (var i = 0; i < ids.length; i++) {
                cmps.push(util.getCmp(ids[i]));
            }

            self.onDrop(cmps, self);
            //util.getCmp(md).destroy();
        });

        this.element.addEventListener('dragover', function (e) {
            self.addClass('shortcut-dragover')
        });

        this.element.addEventListener('dragleave', function (e) {
            self.removeClass('shortcut-dragover')
        });
    }
    template = [
        '<div class="desktop-icon " id="${me.id}" draggable="true" fileId="${me._id}">', 
            '<div class="{if me.type !=="image/jpeg"}${ me.icon || me.getIconCls(me.type)}-icon{/if}">{if me.type =="image/jpeg"} <div style="width:110px;text-align:center;height:90px"><img style="max-height:90px" src="${me.filePath}" draggable="false"></img></div> {/if}</div>',
            '<div class="shortcut-text" style="color:${me.textColor};">${me.text || me.name}</div>',
        '</div>'
    ];
}