var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Compoment', '../core/src/Util'], function(require, exports, __com__, __util__) {
    var com = __com__;
    var util = __util__;
    

    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            _super.apply(this, arguments);
            this.role = 'panel';
            this.dialog = false;
            this.border = true;
            this.bodyPadding = 6;
            this.headerHeight = 30;
            this.style = {};
            this.bodyStyle = {};
            this.events = {
                'mousedown': 'setFocus',
                'click .icon-win8-min': 'hide',
                'click .icon-win8-close': 'destroy',
                'click .icon-win8-max': 'max',
                'click button': 'clickBtn'
            };
            this.max = function () {
            };
            this.template = [
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
        Panel.prototype.clickBtn = function (event) {
            var index = $(event.target).attr('index');
            this.buttons[index].handler.call(this);
        };

        Panel.prototype.setFocus = function () {
            if (this.dialog) {
                this.setMaxIndex();
                $('.win-panel').removeClass('win-panel-focus');
                this.addClass('win-panel-focus');
            }
        };

        Panel.prototype.setBorder = function (val) {
            this.setStyle('outline', val);
        };

        Panel.prototype.setMaxIndex = function () {
            window['z-index'] = window['z-index'] + 1 || 100;
            this.setStyle('z-index', window['z-index']);
        };

        Panel.prototype.setDialog = function () {
            var self = this;
            this.setStyle('position', 'absolute');
            this.setMaxIndex();

            this.max = util.dialog({
                element: self.element,
                eventEl: $(self.element).find('.header')[0],
                onMove: function () {
                    $(self.bodyElement).find('iframe').hide();
                    // $(self.bodyElement).find('object').hide();
                },
                onMouseUp: function () {
                    $(self.bodyElement).find('iframe').show();
                    // $(self.bodyElement).find('object').show();
                },
                onResize: function () {
                    self.onResize();
                }
            }).max;
        };

        Panel.prototype.initElement = function () {
            _super.prototype.initElement.call(this);
            this.setStyle(this.style);
            this.setBodyStyle(this.bodyStyle);
            this.border && this.setBorder('thin solid #9a5d5a');
            this.dialog && this.setDialog();
            this.backgroundColor && this.setBodyStyle("background", this.backgroundColor);
        };

        Panel.prototype.beforeInit = function () {
            $.extend(this, this.config);
        };

        Panel.prototype.render = function (x, y) {
            _super.prototype.render.call(this, 'body');
            if (!x)
                $(this.element).css('left', Math.random() * 100 + 'px');
else
                $(this.element).css('left', x + 'px');
            if (!y)
                $(this.element).css('top', Math.random() * 100 + 'px');
else
                $(this.element).css('top', y + 'px');
            this.setFocus();
        };

        Panel.prototype.show = function () {
            _super.prototype.show.call(this);
            this.setFocus();
        };

        Panel.prototype.setTitle = function (title) {
            this.find('.title').html(title);
            this.title = title;
        };
        return Panel;
    })(com.Compoment);
    exports.Panel = Panel;
});
