
import com = require('../Compoment')
import util = require('../core/src/Util')

declare var TrimPath;

export class TaskBar extends com.Compoment{
    id= 'bottomBar';
    iconMap: Object= {};
    beforeShowCmp= [];

    events = {
        'click .task-icon':'clickIcon',
        'dblclick .task-scan-item':'clickItem',
        'hover .task-scan-item':'hoverItem'
    };
    
    template = [
        '<div id="bottomBar">',
		    '<div id="backDiv" class="backgroundDiv">',
                '<div class="task-start"></div>',
            '</div>',
        '</div>'
    ];
    
    checkCmpTpl = [
        '<div class="task-scan">',
           '<div class="task-scan-body">',
            '</div>',
        '</div>'
    ];

    checkCmpItemTpl = [
        '<div class="task-scan-item" code="${me.openMode}">',
            '<div class="task-scan-item-text">${me.title} <div class="task-can-item-close" style=""></div></div>',
            '<div class="task-scan-item-img"></div>',
        '</div>'
    ];

    
    iconTpl = [
        '<div class="task-icon-many task-icon" >',
            '<div class="task-icon-img bg-icon"></div>',
        '</div>'
    ];

    initialize() 
    {
        super.initialize();
        var that = this;
        $('body').click(this.hideTaskScan.bind(this));
    }

    hideTaskScan() 
    {
        if (!$('.task-scan')[0])
            return;

        $('.task-scan').remove();
        this.hideAllCmp();

        this.showBeforeCmp();
        this.beforeShowCmp = [];
    }

    clickIcon(event) 
    {
        var code = $(event.target).parents('.task-icon').attr('code') || $(event.target).attr('code'), cmp,that = this;

        if( this.iconMap[code].length===1 ) 
        {
            cmp = this.iconMap[code][0];

            if (cmp.isShow()) {
                this.iconMap[code][0].hide();
            } 
            else {
                this.iconMap[code][0].show(true);
            }

            window['z-index']= window['z-index'] + 1 || 100
            $(cmp.element||cmp['el']).css('z-index', window['z-index']);
        }
        else 
        {
            var top = $(event.target).position().top;
            var left = 10;
            var checkEl = $(this.checkCmpTpl.join(''));
            
            checkEl.css('width', this.iconMap[code].length * 210 + 10);

            for (var i = 0, l = this.iconMap[code].length; i < l; i++) 
            { 
                var template = TrimPath.parseTemplate(this.checkCmpItemTpl.join(''));
                var $itemEl = $(template.process({ me: { code: code, title: this.iconMap[code][i].title } }));
                
                this.clickItem($itemEl, that.iconMap[code][i]);
                this.hoverItem($itemEl, that.iconMap[code][i]);
                this.closeItem($itemEl, that.iconMap[code], that.iconMap[code][i]);
              
                checkEl.find('.task-scan-body').append($itemEl);
            }
            checkEl.css({
                top: $('body').height() - 210,
                left: left
            });

            setTimeout(function () {
                $('body').append(checkEl);

                for (var code in that.iconMap) 
                { 
                    for (var i = 0, l = that.iconMap[code].length; i < l; i++) 
                    { 
                        if (that.iconMap[code][i].isShow()) { 
                            that.beforeShowCmp.push(that.iconMap[code][i]);
                        }
                    }
                }

                checkEl.mouseleave(function () { 
                    that.hideTaskScan()
                })
            }, 100);
            
        }
    }
    hideAllCmp() 
    { 
        for(var code in this.iconMap) 
        { 
            for(var i = 0, l = this.iconMap[code].length; i < l; i++) { 
                this.iconMap[code][i].hide();
            }
        }
    }

    showBeforeCmp() 
    { 
        for (var i = 0, len = this.beforeShowCmp.length; i < len; i++) { 
            this.beforeShowCmp[i].show(true);
        }
    }

    closeItem($itemEl,list:Array, cmp: com.Compoment) 
    { 
        var that = this;
        $itemEl.find('.task-can-item-close').click(function (event) { 
            util.array.remove(list, cmp);
            cmp.destroy();

            if( $('.task-scan-item').length <= 1 ) {
                $('.task-scan').remove();
            }
            else { 
                $itemEl.remove();
                $('.task-scan').width($('.task-scan').width() - 210);
            }
            
            event.stopPropagation();
        });
    }

    clickItem($itemEl, cmp: com.Compoment) 
    { 
        var that = this;
        $itemEl.click(function () 
        { 
            that.hideAllCmp();
            that.beforeShowCmp.push(cmp);
            
            window['z-index'] = window['z-index'] + 1 || 100
            $(cmp.element||cmp['el']).css('z-index', window['z-index']);
        });
    }

    hoverItem($itemEl, cmp: com.Compoment) 
    { 
        var that = this;
        $itemEl.hover(function(){ 
            that.hideAllCmp();
            cmp.show();
        });
    }

    destroyCompoment(code:string, cmp: com.Compoment) { 
        
    }

    addTaskIcon(app) 
    {
        var list= <Array>(this.iconMap[app.code]= this.iconMap[app.code] || []);
        console.log(app.code)
        app.addEvent('destroy', () =>
        { 
            util.array.remove(list, app);
            
            if( list.length == 0 ){ 
                $(this.element).find('.task-icon').filter("div[code='" + app.code + "']").remove();
            }
            else if( list.length===1 ) 
            { 
                var $el = $(this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
                $el.addClass('task-icon-one');
                $el.removeClass('task-icon-double');
            }
            else if( list.length===2 ) 
            {
                var $el = $(this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
                $el.addClass('task-icon-double');
                $el.removeClass('task-icon-many');
            }
        });
       
        if( list.length===0 ) 
        {
            var elTpl = [
                '<div class="task-icon-one task-icon" code="'+ app.code +'">',
                    '<div class="task-icon-bg">',
                            '<div  class="fl ' + (app.icon)+ "-task-icon" + '"></div>',
                    '</div>',
                '</div>'
            ];
            $(this.element).find('.backgroundDiv').append(elTpl.join(''));
        }
        if( list.length===1 ) 
        {
            var $el = $(this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
            $el.addClass('task-icon-double');
            $el.removeClass('task-icon-one');
        }
        if( list.length===2 ) 
        {
            var $el = $(this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
            $el.addClass('task-icon-many');
            $el.removeClass('task-icon-double');
        }
        list.push(app);
    }
}
