var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Compoment', '../core/src/Util'], function(require, exports, __com__, __util__) {
    var com = __com__;
    var util = __util__;

    var TaskBar = (function (_super) {
        __extends(TaskBar, _super);
        function TaskBar() {
            _super.apply(this, arguments);
            this.id = 'bottomBar';
            this.iconMap = {};
            this.beforeShowCmp = [];
            this.events = {
                'click .task-icon': 'clickIcon',
                'dblclick .task-scan-item': 'clickItem',
                'hover .task-scan-item': 'hoverItem'
            };
            this.template = [
                '<div id="bottomBar">',
                '<div id="backDiv" class="backgroundDiv">',
                '</div>',
                '</div>'
            ];
            this.checkCmpTpl = [
                '<div class="task-scan">',
                '<div class="task-scan-body">',
                '</div>',
                '</div>'
            ];
            this.checkCmpItemTpl = [
                '<div class="task-scan-item" code="${me.openMode}">',
                '<div class="task-scan-item-text">${me.title} <div class="task-can-item-close" style=""></div></div>',
                '<div class="task-scan-item-img"></div>',
                '</div>'
            ];
            this.iconTpl = [
                '<div class="task-icon-many task-icon" >',
                '<div class="task-icon-img bg-icon"></div>',
                '</div>'
            ];
        }
        TaskBar.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            var that = this;
            $('body').click(this.hideTaskScan.bind(this));
        };

        TaskBar.prototype.hideTaskScan = function () {
            if (!$('.task-scan')[0])
                return;

            $('.task-scan').remove();
            this.hideAllCmp();

            this.showBeforeCmp();
            this.beforeShowCmp = [];
        };

        TaskBar.prototype.clickIcon = function (event) {
            var code = $(event.target).parents('.task-icon').attr('code') || $(event.target).attr('code'), cmp, that = this;

            if (this.iconMap[code].length === 1) {
                cmp = this.iconMap[code][0];

                if (cmp.hasClass('win-panel-focus')) {
                    this.iconMap[code][0].hide();
                } else {
                    this.iconMap[code][0].show(true);
                    window['z-index'] = window['z-index'] + 1 || 100;
                    $(cmp.element || cmp['el']).css('z-index', window['z-index']);
                }
            } else {
                var top = $(event.target).position().top;
                var left = 10;
                var checkEl = $(this.checkCmpTpl.join(''));

                checkEl.css('width', this.iconMap[code].length * 210 + 10);

                for (var i = 0, l = this.iconMap[code].length; i < l; i++) {
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

                    for (var code in that.iconMap) {
                        for (var i = 0, l = that.iconMap[code].length; i < l; i++) {
                            if (that.iconMap[code][i].isShow()) {
                                that.beforeShowCmp.push(that.iconMap[code][i]);
                            }
                        }
                    }

                    checkEl.mouseleave(function () {
                        that.hideTaskScan();
                    });
                }, 100);
            }
        };
        TaskBar.prototype.hideAllCmp = function () {
            for (var code in this.iconMap) {
                for (var i = 0, l = this.iconMap[code].length; i < l; i++) {
                    this.iconMap[code][i].hide();
                }
            }
        };

        TaskBar.prototype.showBeforeCmp = function () {
            for (var i = 0, len = this.beforeShowCmp.length; i < len; i++) {
                this.beforeShowCmp[i].show(true);
            }
        };

        TaskBar.prototype.closeItem = function ($itemEl, list, cmp) {
            var that = this;
            $itemEl.find('.task-can-item-close').click(function (event) {
                util.array.remove(list, cmp);
                cmp.destroy();

                if ($('.task-scan-item').length <= 1) {
                    $('.task-scan').remove();
                } else {
                    $itemEl.remove();
                    $('.task-scan').width($('.task-scan').width() - 210);
                }

                event.stopPropagation();
            });
        };

        TaskBar.prototype.clickItem = function ($itemEl, cmp) {
            var that = this;
            $itemEl.click(function () {
                that.hideAllCmp();
                that.beforeShowCmp.push(cmp);

                window['z-index'] = window['z-index'] + 1 || 100;
                $(cmp.element || cmp['el']).css('z-index', window['z-index']);
            });
        };

        TaskBar.prototype.hoverItem = function ($itemEl, cmp) {
            var that = this;
            $itemEl.hover(function () {
                that.hideAllCmp();
                cmp.show();
            });
        };

        TaskBar.prototype.destroyCompoment = function (code, cmp) {
        };

        TaskBar.prototype.addTaskIcon = function (app) {
            var _this = this;
            var list = (this.iconMap[app.code] = this.iconMap[app.code] || []);
            console.log(app.code);
            app.addEvent('destroy', function () {
                util.array.remove(list, app);

                if (list.length == 0) {
                    $(_this.element).find('.task-icon').filter("div[code='" + app.code + "']").remove();
                } else if (list.length === 1) {
                    var $el = $(_this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
                    $el.addClass('task-icon-one');
                    $el.removeClass('task-icon-double');
                } else if (list.length === 2) {
                    var $el = $(_this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
                    $el.addClass('task-icon-double');
                    $el.removeClass('task-icon-many');
                }
            });

            if (list.length === 0) {
                var elTpl = [
                    '<div class="task-icon-one task-icon" code="' + app.code + '">',
                    '<div class="task-icon-bg">',
                    '<div  class="fl ' + (app.icon) + "-task-icon" + '"></div>',
                    '</div>',
                    '</div>'
                ];
                $(this.element).find('.backgroundDiv').append(elTpl.join(''));
            }
            if (list.length === 1) {
                var $el = $(this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
                $el.addClass('task-icon-double');
                $el.removeClass('task-icon-one');
            }
            if (list.length === 2) {
                var $el = $(this.element).find('.task-icon').filter('div[code="' + app.code + '"]');
                $el.addClass('task-icon-many');
                $el.removeClass('task-icon-double');
            }
            list.push(app);
        };
        return TaskBar;
    })(com.Compoment);
    exports.TaskBar = TaskBar;
});
