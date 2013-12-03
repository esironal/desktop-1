

	Design.define('Design.data.Model',{
		requires: [
			'Design.data.Field',
			'Design.data.Validations',
			'Design.util.HashMap'
		],
		alias: ['widget.model'],
		
		mixins: ['Design.util.Observable'],
		
		dirty:false,
		
		getDirty: function() {
			return this.dirty;
		},
		setDirty: function(dirty) {
			this.dirty = dirty;
		},
		save: function(params,success,error) {
			
			if (Design.isFunction(params)) {
				error = success;
				success = params;
				params = {};
			}
			
			var that = this;
			Design.ajax({
				params: Design.apply(that.toJson(),params),
				url: that.url + '/save',
				success: function(data) {
					var datas = Ext.decode(data).data;
					that.set(datas);
					if(success){
						success.call(that,data);
					}
					
				},
				error: function(data) {
					if(error){
						error.call(that,data);
						return;
					}
					alert('提交失败');
				}
			});
		},
		remove: function(params,success,error) {
			if (Design.isFunction(params)) {
				error = success;
				success = params;
				params = {};
			}
			
			var that = this;
			Design.ajax({
				params: Design.apply(that.toJson(),params),
				url: that.url + '/delete',
				success: function(data) {
					if(success){
						success.call(that,data);
					}
				},
				error: function() {
					if(error){
						error.call(that,data);
						return;
					}
					alert('提交失败');
				}
			});
		},
		toJson: function() {
			return this.data;
		},
		
		persistenceProperty:'data',
		onClassExtended: function(cls, data, hooks) {
		
			var me = this,
				//name = Ext.getClassName(cls),
				prototype = cls.prototype,
				superCls = cls.prototype.superclass;
			data.fields.unshift( {name: 'modelId' ,type: 'int' ,convert: function(modelId){
				return modelId || (modelId = 'model-' + (++Design.data.Model.AUTO_ID));
			}});
			data.fields.unshift( {name: 'children' ,type: 'array'} );
			data.fields.unshift( {name: 'expanded' ,type: 'boolean'} );
			me.prototype.setFields.call(cls,data.fields)
			delete data.fields;
			//	prototype.modelName = name;
		},
		vtype:{
			string:'alphanum',
			'int':'num'
		},
		validate: function() {
			var errors = new Design.data.Errors(function(o){return o.field}),
				validations = this.validations,
				validators  = Design.data.validations,
				length, validation, field, valid, type, i;

			if (validations) {
				length = validations.length;

				for (i = 0; i < length; i++) {
					validation = validations[i];
					field = validation.field || validation.name;
					type  = validation.type;
					valid = validators[type](validation, this.get(field));

					if (!valid) {
						errors.add({
							field  : field,
							message: validation.message || validators[type + 'Msg']
						});
					}
				}
			}

			return errors;
		},
		setFields: function(fields) {
			var me = this,
				prototypeFields = me.prototype.fields,
				len = fields.length,
				i = 0;
			if (prototypeFields) {
				prototypeFields.clear();
			}
			else {
				prototypeFields = me.prototype.fields = new Design.util.HashMap(function (field) {
					return field.name;
				});
			}
			for (; i < len; i++) {
				prototypeFields.add(new Design.data.Field(fields[i]));
			}
			me.fields = prototypeFields;
			
			return prototypeFields;
		},
		addChild:function(model){
			if (model instanceof Design.data.Model) {
				this.children.push(model);
			}
		},
		getChild: function() {
			return this.children;
		},
		constructor: function(data) {
			var me = this ,
				field,
				fields = me.fields.items;
			data = data ||{};
			me.children = me.children || [];
			if (!me.data) {
				me.data = {};
			}
			if (!me.modified) {
				me.modified = {};
			}
			
			fields.forEach(function(field){
				var name  = field.name;
				var value = data[name];
				if (value === undefined) {
					value = field.defaultValue;
				}
				if (field.convert) {
					value = field.convert(value, me);
				}
				me.data[name] = value ;
			});
			
		},
		isParent: function() {
			return (this.get('children') || []).length ? true : false;
		},
		toString: function(){ return "model"},
		get: function(field) {
			return this.data[field];
		},
		forEach: function(fn) {
			for (var key in this.data) {
				fn(key, this.data[key]);
			}
		},
		set: function(o, v, is) {
			var me = this;
			
			var set = function(fieldName, value) {
				var currentValue = me.get(fieldName);
				var field = me.fields.get(fieldName);

				if(field && value !== undefined && currentValue !== value || is){
					
					if (fieldName != 'expanded' && fieldName != 'children'){
						me.setDirty(true);
					}
					
					if(field.convert){
						value = field.convert(value,me);
					}
					me.data[fieldName] = value;
					me.modified[fieldName] = currentValue;
					me.fireEvent('update',fieldName,value,currentValue,me);
					return true;
				}
				return false;
			}
			
			if(Design.isObject(o)){
				for (k in o) {
					set(k, o[k]);
				}
			}
			else {
				return set(o, v);
			}
		},
		setWarning: function(field) {
			this.warning = field;
			this.fireEvent('warning',this.warning,this);
		},
		isDirty:function(){
			return this.getDirty();
		}
	})