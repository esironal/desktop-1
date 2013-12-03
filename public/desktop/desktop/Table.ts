import com = require("../Compoment")
import cmenu = require("../menu/ContextMenu")
import om = require("./OpenMode")
import form = require("../form/Form")

om.Module.addApplication([{
    name: 'createFloder',
    code: 'createFloder',
    openType: 'createFloder',
    handler: function (cmp) {
        $.ajax({
            type: 'POST',
            data: { parent_id: cmp.folder_id, type: 'folder', name: '新建文件夹' },
            url: 'createFile',
            success: function (data) {
                cmp.getItemsByPath(cmp.path);
            },
            error: function () {

            }
        });
    }
}]);

om.Module.addApplication([{
    name: 'createVideo',
    code: 'createVideo',
    openType: 'createVideo',
    handler: function (cmp) {
        var panel = new form.Form({
            url: 'createFile',
            items: [{
                xtype: 'textfield',
                label: '名称',
                name: 'name'
            }, {
                xtype: 'combobox',
                label: '类型',
                data: [{
                    key: 'baiduPlayer',
                    value: '百度影音'
                }, {
                    key: 'flashPlayer',
                    value: 'flash视频'
                }, {
                    key: 'image/jpeg',
                    value: '图片'
                }],
                name: 'type'
            }, {
                xtype: 'textfield',
                label: '地址',
                name: 'filePath'
            }],
            dialog: true,
            width: 300,
            height: 400,
            buttons: [ {
                text: '取消',
                handler: function () {
                    panel.destroy();
                }
            }, {
                text: '确定',
                handler: function () {
                    panel.submit({
                        params: {
                            parent_id: cmp.folder_id
                        },
                        success: () => {
                            cmp.getItemsByPath(cmp.path);
                            panel.destroy();
                        }
                    });
                }
            }]
        });

        panel.render(($('body').width() - 300) / 2, ($('body').height() - 600) / 2);
    }
}]);

export class Table extends com.Compoment
{
    tableElement: HTMLTableElement;
    role= "table";
    layout= "";
    horiz= false;
    vertical= false;
    targetCmp = {};
    events= {
        "click ": "clickShortcut",
        "contextmenu": 'contextmenu'
    };
    
    clickShortcut(event)
    { 
        if (window['keyDownMap'] && window['keyDownMap']['17']) {
            return;
        }

        $(this.element).find(".desktop-icon").removeClass("active");
        $(event.target).parents(".desktop-icon").addClass("active");
        $('.content-menu').remove();
    }

    contextmenu(event) 
    { 
        //return true
        $('.content-menu').remove();
        var self = this;

        var menu = new cmenu.ContextMenu(
        {
            top: event.pageY,
            left: event.pageX,
            targetCmp: self.targetCmp,
            items: [{
                text: "粘贴"
            },{
                text: "刷新"
            },
            {
                text: "",
                divider: true
            },
            {
                text: "新建",
                children: [{
                    text: '文件夹',
                    code: 'createFloder'
                },
                {
                    text: '影视资源',
                    code: 'createVideo'
                }]
            },
            {
                text: "属性"
            }]
        });
        menu.render(); 

        return false;
    }
    
    initItems(item?)
    { 
        var that = this;
        var items = item? [item] : this.items;

        if (this.vertical !== true) 
        {
            for (var i = 0, len = items.length; i < len; i++) 
            { 
                $.extend(items[i], items[i].config);
                items[i].initialize();
                items[i].setStyle("display", "inline-block");
                items[i].setStyle("vertical-align", "top");
                that.bodyElement.appendChild(items[i].element);
                items[i]._afterRender();
            }
        }
        else 
        { 
            for (var i = 0, len = items.length; i < len; i++) { 
                $.extend(items[i], items[i].config);
                items[i].initialize();
                that.bodyElement.appendChild(items[i].element);
                items[i]._afterRender();
            }
        }
    }

    onResize() 
    { 
        var self = this;
        if( $(this.element).parent().width() < $(this.element).find("tbody").width() )
        {
            
        }
    }

    template= [
        '<div id="${me.id}" class="desktop-table-container" style="height:100%">'
            , '<table class="desktop-table">'
                , '<tbody id="${me.id}-body">'
                , '</tbody>'
             , '</table>'
        , '</div>'
    ];
}