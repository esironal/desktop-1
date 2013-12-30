import com = require('../Compoment')
import util = require('../core/src/Util')
import tab = require('../desktop/Table')

export class Panel extends com.Compoment{
    role = 'panel';
    dialog= false;
    border= true;
    bodyPadding= 6;
    headerHeight= 30;
    backgroundColor;
    title;
    style = {};
    buttons;
    bodyStyle= {};
    events ={
        'mousedown': 'setFocus'
        , 'click .icon-win8-min': 'hide'
        , 'click .icon-win8-close': 'destroy'
        , 'click .icon-win8-max': 'max'
        , 'click button': 'clickBtn'
    };
    max = () => { };

    mousedownTitle(event) {

    }

    clickBtn(event) {
        var index = $(event.target).attr('index');
        this.buttons[index].handler.call(this);
    }

    setFocus() 
    {
        if( this.dialog ) 
        {
            this.setMaxIndex();
            $('.win-panel').removeClass('win-panel-focus');
            this.addClass('win-panel-focus');
        }
        
    }

    setBorder(val) { 
        this.setStyle('outline', val);
    }

    setMaxIndex() { 
        window['z-index'] = window['z-index'] + 1 || 100
        this.setStyle('z-index', window['z-index']);
    }

    setDialog() 
    { 
        var self = this
            ;
        this.setStyle('position', 'absolute');
        this.setMaxIndex();

        this.max = util.dialog(
        {
            element: self.element, 
            eventEl: $(self.element).find('.header')[0], 
         
            onMove: () => {
                $(self.bodyElement).find('iframe').hide();
               // $(self.bodyElement).find('object').hide();
			},
			onMouseUp: () => {
                $(self.bodyElement).find('iframe').show();
               // $(self.bodyElement).find('object').show();
			}, 
            onResize: () => {
                self.onResize();
            }
        }).max;
    }

    initElement() 
    { 
        super.initElement();
        this.setBodyStyle(this.bodyStyle);
        this.border && this.setBorder('thin solid #5284bc');
        this.dialog && this.setDialog();
        this.backgroundColor && this.setBodyStyle("background", this.backgroundColor);
    }

    beforeInit() { 
        $.extend(this, this.config);
    }

    render(x?, y?) { 
        super.render('body');
        if (!x)
            $(this.element).css('left', Math.random() * 100 + 'px')
        else
            $(this.element).css('left', x + 'px')
        if (!y)
            $(this.element).css('top', Math.random() * 100 + 'px')
        else
            $(this.element).css('top', y + 'px')
        this.setFocus();
    }

    show() {
        super.show();
        this.setFocus();
    }

    hide() {
        super.hide();
        this.removeClass('win-panel-focus');
    }

    setTitle(title) { 
        this.find('.title').html(title);
        this.title = title;
    }

    template = 
    [
        '<div class="win-panel ${me.className}" id="${me.id} " style ="${me.style};width:${me.width};height:${me.heigh}">',
            '{if me.dialog}',
                '<div class="header">',
                    '<span class="title">${me.title}</span>',
                    '<div class="panel-title-buttons">',
                        '<div class="icon icon-win8-close"> </div>',
                        '<div class="icon icon-win8-max"> </div>',
                        '<div class="icon icon-win8-min"> </div> ',
                    '</div>',
                '</div>',
            '{/if}',
            '<div id="${me.id}-body" class="win-panel-body"  style="left:${me.bodyPadding};right:${me.bodyPadding};bottom:${(me.buttons?40:0) + me.bodyPadding}px;top:${me.bodyPadding};{if me.dialog} top:30px; {/if}{if me.overflow_y} overflow-y:${me.overflow_y}; {/if}">',
                '${me.html}',
        '</div>',

        '{if me.buttons}',
            '<div class="panel-buttons" style="left:${me.bodyPadding}px;right:${me.bodyPadding}px;bottom:${me.bodyPadding}px">',
                '{for btn in me.buttons}',
                    '<button class="panel-btn" index="${btn_index}">${btn.text}</button>',
                    '',
                    '',
                    '',
                    '',
                '{/for}',
            '</div>',
        '{/if}',
        '</div>'
    ];
}
