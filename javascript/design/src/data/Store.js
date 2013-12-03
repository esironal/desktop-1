
(function(){

	function initModels(datas,name,layer) {
		
		var list = [];
		
		if (!layer) {
			layer = 0;
		}
		datas.forEach(function(data,index) {
			
			var model = Design.create(name, data, true);
			if (index === 0) {
				model.first = true;
			}
			else if (index === datas.length - 1) {
				model.last = true;
			}
			
			list.push(model);
			if (data.children) {
				model.data.children = initModels(data.children,name, layer + 1);
			}
			
		})
		if (list.length == 0) {
			return [];
		}
		return list;
	}
	
	Design.define('Design.data.Store', {
		mixins: ['Design.util.Observable'],
		constructor: function(cfg) {
			this.models = [];
			var that = this;
			this.id = cfg.id;
			this.pageSize = cfg.pageSize;
			if(Design.isArray(cfg.data)){
				this.models = initModels(cfg.data, cfg.model);
			}
		},
		toJson:function(){
			var data = [];
			this.getRecords().forEach(function(model) {
				var map = {};
				for (var key in model.data) {
					if (model.data[key] == null) {
							model.data[key] = '';
					}
					if (key != 'expanded' && key != 'children' && key != 'modelId') {
						map[key] = model.data[key];
					}
				}
				data.push(map);
			});
			return data
		},
		remove: function(model) {
			var that = this;
			this.forEach(function(m, index) {
				if (m === model) {
					that.models.splice(index,1);
					model.fireEvent('delete',model);
				}
			})
		},
		count: function() {
			return this.models.length;
		},
		sort: function(fn) {
			var that = this,
				temp,
				models = this.models;
				len = models.length;
			
			for (var i = 0; i < len; i++) {
				for (var j = i; j < len; j++) {
					if(fn(models[i], models[j])){
						temp = models[i];
						models[i] = models[j];
						models[j] = temp;
					}
				}
			}
			this.fireEvent('sort',models);
			
		},
		
		add: function(model) {
			if (!model) {
				return
			}
			var isExist = false;
			this.forEach(function(m) {
				if (m.get('modelId') == model.get('modelId')) {
					isExist = true;
				}
			});
			if (!isExist) {
				this.models.push(model);
				this.fireEvent('insert',model);
			}
			return !isExist;
		},
		getRecords: function() {
			return this.models;
		},
		getModels: function() {
			return this.models;
		},
		getPage: function(page) {
			var first = page * this.pageSize || 0, last, models = []; 
			
			this.pageSize = this.pageSize || 0;
			
			if (this.pageSize) {
				last = first + this.pageSize;
			}
			else {
				last = this.models.length;
			}
			this.models.forEach(function(m, i) {
				if (i >= first && i < last) {
					models.push(m);
				}
			});
			
			return models;
		},
		getPageCount: function() {
			if (this.pageSize && this.models) {
				return Math.ceil(this.models.length / this.pageSize);
			}
			else {
				return 1;
			}
		},
		eachLayer: function(models, fn) {
			var that = this;
			if (Design.isFunction(models)) {
				fn = models;
				models = this;
			}
			models.forEach(function(model) {
				fn(model);
				if (model.get('children')) {
					that.eachLayer(model.get('children'), fn); 
				}
			});
		},
		getDirtyData: function() {
			var list = [];
			this.eachLayer(function(model) {
				if (model.isDirty()) {
					var map = {};
					for (key in model.data) {
						if(model.data[key] && key != 'chidlren' && key != 'expanded') {
							map[key] = model.data[key];
						}
					}
					list.push(map);
				}
			});
			return list;
		},
		forEach: function(fn) {
			this.models.forEach(fn);
		}
	});

})()