import com = require('../Compoment')
import util = require('../core/src/Util')
import tab = require('../desktop/Table')
import om = require("../desktop/OpenMode")


export class ContextMenu extends com.Compoment{
    role = 'content-menu';
    events= {
        "click li": "click"
    };
    top = 0;
    left = 0;
    targetCmp = null;

    click(event) { 
        
        var target = $(event.target).parent("li");
        if (!$(target).hasClass('disabled')) { 
            //var code = $(target).attr('code');
            //om.Module.excute(code, this.targetCmp);
            var fn = this.items[$(target).attr('index')]['handler']
            fn && fn(event);

            $('.content-menu').remove();
        }

        event.stopPropagation();
    }


    constructor (config: Object = {}) {
        super(config);
    }

    initItems() 
    {
        var self = this;
        var childrenMenu = [];
        for (var i = 0, len = this.items.length; i < len; i++) 
        {
            var $html;
            if (this.items[i]["divider"]) {
                $html = $('<li  class="divider"></li>');
            }
            else {
                $html = $('<li><a>'+this.items[i]["text"]+'</a></li>')
            }

            $html.attr('index', i);

            if (this.items[i]['disabled']) {
                $html.addClass('disabled');
                $html.css('color', '#999');
            }



           // +(this.items[i]['children'] ? '<div class="right-arrows"></div>' : ''

            if (this.items[i]['children']) {
               
                (items, $li) => {
                    var menu;
                    var isHover = false;

                    $li.hover((event) =>
                    {
                        for (var i = 0, l = childrenMenu.length; i < l; i++) {
                            if (childrenMenu[i].pMenu !== $li) {
                                childrenMenu[i].destroy();
                                childrenMenu[i].element = null;
                            }
                        }

                        if (menu && menu.element) return;
                        menu = new ContextMenu({
                            pMenu: $li,
                            targetCmp: self.targetCmp,
                            left: self.left + 150,
                            top: $(event.target).offset().top,
                            items: items
                        });
                        childrenMenu.push(menu);
                        menu.render();

                        $(menu.element).hover(() => {
                            isHover = true;
                        }, () =>{
                            isHover = false;
                        });
                    }, () =>
                    {
                        setTimeout(() => {
                            if (!isHover) {
                                menu.destroy();
                                menu.element = null;
                            }
                        }, 10);
                    });

                } (self.items[i]['children'], $html);
            }
            else { 
                $html.hover((event) =>
                {
                    for (var i = 0, l = childrenMenu.length; i < l; i++) {
                        if (childrenMenu[i].pMenu !== $html) {
                            childrenMenu[i].destroy();
                            childrenMenu[i].element = null;
                        }
                    }
                });
            }

            $(this.bodyElement).append($html);
        }
    }

    template = 
    [
        '<div id="${me.id}" class="content-menu" style="top:${me.top}px;left:${me.left}px">',
            '<ul id="${me.id}-body">',
                
            '</ul>',
        '</div>'
    ];
}
