
(function(Class) {

	/*
		工具类
	*/
	
	var Publisher = function() {
		this.subscribers = [];
	}
	
	Publisher.prototype.deliver = function() {
		this.subsribers.forEach(
			function(fn) {
				fn(data);
			}
		);
		return this;
	}
	
	
	Function.prototype.subscribe = function(publisher) {
		var that = this;
		var alreadyExists = publisher.subscribers.some(
			function(el) {
				return el === that;
			}
		);
		if  (!alreadyExists) {
			publisher.subscribers.push(this);
		}
		return this;
	}
	
	Function.prototype.unsubscribe = function(publisher) {
		var that = this;
		publisher.subscribers = publisher.subscribers.filter(
			function(el) {
				return el !== that;
			}
		);
		return this;
	}
	
	var publisherObject =new Publisher();
	
	var observerObject = function(data) {
		console.log(data);
		arguments.callee.unsubscribe(publisherObject);
	};
	
})(Design);



