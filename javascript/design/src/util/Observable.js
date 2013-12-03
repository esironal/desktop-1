


Design.define('Design.util.Observable', {
	constructor: function() {
		
	},

	addEvent: function(eventname, fn) {
		if (!this.eventMap) {
			this.eventMap = {};
		}
		if (!this.eventMap[eventname]) {
			this.eventMap[eventname] = [fn];
		}
		else {
			this.eventMap[eventname].push(fn);
		}
	},
	on: function() {
		return this.addEvent.apply(this, arguments);
	},
	fireEvent: function(eventname) {
		if (!this.eventMap) {
			this.eventMap = {};
		}
		var arg = arguments;
		var that = this;
		if (this.eventMap[eventname]) {
			this.eventMap[eventname].forEach(function(fn){
				fn.apply(that, arg);
			});
		}
	},
	unEvent: function(eventname,unFn) {
		if (!this.eventMap) {
			this.eventMap = {};
		}
		if (this.eventMap[eventname]) {
			
			if (!unFn) {
				this.eventMap[eventname] = [];
				return;
			}
		
			this.eventMap[eventname] = this.eventMap[eventname].filter(function(fn){
				return fn !== unFn;
			});
		}
	}
});

