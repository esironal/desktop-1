Design.define('Design.util.HashMap',{
	mixins: ['Design.util.Observable'],
	generation:0,
	constructor:function(keyFn){
		var me = this;
		me.items = [];
		me.map = {};
		me.keys = [];
		me.length = 0;
		
		if (keyFn) {
			me.getKey = keyFn;
		}
		//me.mixins.observable.constructor.call(me);
	},
	indexOfKey : function(key){
		var index = null;
		this.keys.forEach(function(k, i) {
			if (k === key) {
				index = i;
			}
		});
		
		return index;
	},
	getKey : function(o){
        return o.id;
    },
	add : function(key, obj){
		var me = this,
			old;
		if(arguments.length == 1){
			obj = key;
			key = me.getKey(obj);
		}
		if(typeof key != 'undefined' && key !==null){
			old = me.map[key];
			if(typeof old != 'undefined'){
				me.items[me.indexOfKey(key)] = obj;
			}else{
				me.items.push(obj);
				me.length++;
				me.keys.push(key);
			}
			me.map[key] = obj;
			me.generation++;
		}
		return obj;
	},
	get:function(fieldName){
		return this.map[fieldName]
	}
})