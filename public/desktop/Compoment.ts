
import util = require("./core/src/Util")

declare var TrimPath;
declare var exports;

var _index = 0;

export class Compoment 
{
    public events :any;
    private eventMap: Object = {};
    public config: Object;
    public parentCmp: Compoment;
    public items:  Compoment[] = [];
    public role: string;
    public id: string;
    public name: string;
    public element: HTMLElement;
    public bodyElement: HTMLElement;
    public template: String[] = [];
    private eventSplitter = /^(\S+)\s*(.*)$/;
    width;
    height;

    constructor(config: Object = {}) {
        this.config = config;
    }

    addEvent(eventname, fn) 
    {
        if (!this.eventMap[eventname])
            this.eventMap[eventname]= [fn];
        else
            this.eventMap[eventname].push(fn);
    }

	fireEvent(eventname) 
    {
		var arg = arguments
		    , that = this;

		if( this.eventMap[eventname] ) 
        {
		    this.eventMap[eventname].forEach((fn) => {
		        fn.apply(that, arg);
		    });
		}
	}

	unEvent(eventname,unFn) 
    {
		if( this.eventMap[eventname] )
        {
			if( !unFn ){
				this.eventMap[eventname]= [];
				return;
			}
		
			this.eventMap[eventname] = this.eventMap[eventname].filter((fn) => {
				return fn!==unFn;
			});
		}
	}

	createId() { 
        return this.id || (this.role + '-' + _index++);
    }

	initElement() 
    {
        this.id = this.createId();
        util.setCmp(this.id, this)
	    var template = TrimPath.parseTemplate(this.template.join(''));
	    this.element = $(template.process({ me: this }))[0];
	    this.bodyElement = this.find('#' + this.id + '-body')[0] || this.element;
	    this.width && this.setWidth(this.width);
	    this.height && this.setHeight(this.height);

	}

	delegateEvents(events) 
    {
	    if (!events) {
	        return;
	    }

	    var that = this;

	    for (var key in events) 
        {
			var method = <Function>this[events[key]]
			    , match = key.match(this.eventSplitter)
				, eventName = match[1]
				, selector = match[2];

	        if (!method)
	            throw new Error('Event "' + events[key] + '" does not exist');

	        if (selector === '')
	            $(this.element).bind(eventName, method.bind(this));
	        else
	            $(this.element).delegate(selector, eventName, <(event) =>any>method.bind(this));
	    }
	}

    getItem(num) { 
        return this.items[num];
    }

    bindItems(items) 
    { 
        this.setHtml('');
        this.items = items;
        this.initItems();
    }

    initItems() 
    {
        var that = this;

        for (var i = 0, len = this.items.length; i < len; i++) { 
            this.items[i].parentCmp = that;
            $.extend(this.items[i], this.items[i].config);
            this.items[i].initialize();
            that.bodyElement.appendChild(this.items[i].element);
        }
    }

    beforeInit() { 
        $.extend(this, this.config);
    }

    initialize() {
        this.initElement();
        this.initItems();
        this.delegateEvents(this.events);
    }

    _afterRender() { 
        
    }

    add(cmp: Compoment) { 
        this.items.push(cmp)
    }
    
    show () { 
        $(this.element).show();
    }

    hide () { 
        $(this.element).hide();
    }

    isShow () { 
        return $(this.element).css('display') == 'block' ? true : false;
    }

    find(selector) { 
        return $(this.element).find(selector);
    }

    setHtml(content) {
        $(this.bodyElement).html(content);
    }

    getHtml() {
        return $(this.bodyElement).html();
    }

    setWidth(width) { 
        $(this.element).width(width);
    }
    
    setHeight(height) { 
        $(this.element).height(height);
    }
    
    removeClass(name) { 
        $(this.element).removeClass(name);
    }

    addClass(name) {
        $(this.element).addClass(name);
    }

    toggleClass(name) {
        $(this.element).toggleClass(name);
    }

    addBodyClass(name) {
        $(this.bodyElement).addClass(name);
    }
    
    setStyle(key, value?) { 
        $(this.element).css(key, value);
    }

    setBodyStyle(key, value?) { 
        $(this.bodyElement).css(key, value);
    }

    destroy() { 
        $(this.element).remove();
        this.fireEvent('destroy');
    }

    onResize() { 
        for (var i = 0, len = this.items.length; i < len; i++) { 
            this.items[i].onResize();
        }
    }

    render(where?) 
    {
        where = where ||  "body"
        this.beforeInit();
        this.initialize();
        $(where).append(this.element);
        this._afterRender();
    }
}