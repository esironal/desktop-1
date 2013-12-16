define(["require", "exports", "./core/src/Util"], function(require, exports, __util__) {
    Function.prototype.bind = function () {
        var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };

    var util = __util__;

    var _index = 0;

    var Compoment = (function () {
        function Compoment(config) {
            if (typeof config === "undefined") { config = {}; }
            this.eventMap = {};
            this.items = [];
            this.style = {};
            this.template = [];
            this.eventSplitter = /^(\S+)\s*(.*)$/;
            this.config = config;
        }
        Compoment.prototype.addEvent = function (eventname, fn) {
            if (!this.eventMap[eventname])
                this.eventMap[eventname] = [fn];
else
                this.eventMap[eventname].push(fn);
        };

        Compoment.prototype.fireEvent = function (eventname) {
            var arg = arguments, that = this;

            if (this.eventMap[eventname]) {
                for (var i = 0; i < this.eventMap[eventname].length; i++) {
                    this.eventMap[eventname][i].apply(that, arg);
                }
            }
        };

        Compoment.prototype.unEvent = function (eventname, unFn) {
            if (this.eventMap[eventname]) {
                if (!unFn) {
                    this.eventMap[eventname] = [];
                    return;
                }

                this.eventMap[eventname] = this.eventMap[eventname].filter(function (fn) {
                    return fn !== unFn;
                });
            }
        };

        Compoment.prototype.createId = function () {
            return this.id || (this.role + '-' + _index++);
        };

        Compoment.prototype.initElement = function () {
            this.id = this.createId();
            util.setCmp(this.id, this);
            var template = TrimPath.parseTemplate(this.template.join(''));
            this.element = $(template.process({ me: this }))[0];
            this.bodyElement = this.find('#' + this.id + '-body')[0] || this.element;
            this.width && this.setWidth(this.width);
            this.height && this.setHeight(this.height);

            this.setStyle(this.style);
        };

        Compoment.prototype.delegateEvents = function (events) {
            if (!events) {
                return;
            }

            var that = this;

            for (var key in events) {
                var method = this[events[key]], match = key.match(this.eventSplitter), eventName = match[1], selector = match[2];

                if (!method)
                    throw new Error('Event "' + events[key] + '" does not exist');

                if (selector === '')
                    $(this.element).bind(eventName, method.bind(this));
else
                    $(this.element).delegate(selector, eventName, method.bind(this));
            }
        };

        Compoment.prototype.getItem = function (num) {
            return this.items[num];
        };

        Compoment.prototype.bindItems = function (items) {
            this.setHtml('');
            this.items = items;
            this.initItems();
        };

        Compoment.prototype.initItems = function () {
            var that = this;

            for (var i = 0, len = this.items.length; i < len; i++) {
                this.items[i].parentCmp = that;
                $.extend(this.items[i], this.items[i].config);
                this.items[i].initialize();
                that.bodyElement.appendChild(this.items[i].element);
            }
        };

        Compoment.prototype.beforeInit = function () {
            $.extend(this, this.config);
        };

        Compoment.prototype.initialize = function () {
            this.initElement();
            this.initItems();
            this.delegateEvents(this.events);
        };

        Compoment.prototype._afterRender = function () {
        };

        Compoment.prototype.add = function (cmp) {
            this.items.push(cmp);

            if (this.bodyElement) {
                cmp.render(this.bodyElement);
            }
        };

        Compoment.prototype.show = function () {
            $(this.element).show();
        };

        Compoment.prototype.hide = function () {
            $(this.element).hide();
        };

        Compoment.prototype.isShow = function () {
            return $(this.element).css('display') == 'block' ? true : false;
        };

        Compoment.prototype.find = function (selector) {
            return $(this.element).find(selector);
        };

        Compoment.prototype.setHtml = function (content) {
            $(this.bodyElement).html(content);
        };

        Compoment.prototype.getHtml = function () {
            return $(this.bodyElement).html();
        };

        Compoment.prototype.setWidth = function (width) {
            $(this.element).width(width);
        };

        Compoment.prototype.setHeight = function (height) {
            $(this.element).height(height);
        };

        Compoment.prototype.removeClass = function (name) {
            $(this.element).removeClass(name);
        };

        Compoment.prototype.addClass = function (name) {
            $(this.element).addClass(name);
        };

        Compoment.prototype.toggleClass = function (name) {
            $(this.element).toggleClass(name);
        };

        Compoment.prototype.addBodyClass = function (name) {
            $(this.bodyElement).addClass(name);
        };

        Compoment.prototype.setStyle = function (key, value) {
            $(this.element).css(key, value);
        };

        Compoment.prototype.setBodyStyle = function (key, value) {
            $(this.bodyElement).css(key, value);
        };

        Compoment.prototype.destroy = function () {
            $(this.element).remove();
            this.fireEvent('destroy');
        };

        Compoment.prototype.onResize = function () {
            for (var i = 0, len = this.items.length; i < len; i++) {
                this.items[i].onResize();
            }
        };

        Compoment.prototype.render = function (where) {
            where = where || "body";
            this.beforeInit();
            this.initialize();
            $(where).append(this.element);
            this._afterRender();
        };
        return Compoment;
    })();
    exports.Compoment = Compoment;
});
