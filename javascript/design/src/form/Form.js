



Design.define('Design.form.Form',{
	extend: 'Design.panel.Panel', 
	alias: 'widget.form',
	requires: [
		'Design.form.field.Text', 
		'Design.form.field.TextArea', 
		'Design.form.field.Date', 
		'Design.form.field.Combobox', 
		'Design.form.field.FieldContainer', 
		'Design.form.field.DisplayField', 
		'Design.form.field.FieldSet', 
		'Design.form.field.CheckBox', 
		'Design.form.field.File', 
		'Design.form.field.Radio',
		'Design.data.Model',
		'Design.form.field.RadioGroup'
	],
	config:{
		model:null
	},
	getModel: function() {
		return this.model;
	},
	validate: function() {
		var isValid = true;
		this.forEach(function(item) {
			if (!item.validate()){
				isValid = false;
			}
		});
		return isValid;
	},
	submit: function(o) {
	
		if (!this.validate()) {
			return;
		}
	
		var fieldField = false, that = this;
		this.forEach(function(item) {
			if (item.xtype == "filefield") {
				fieldField = item;
			}
		});
		
		if (fieldField) {
			$.ajaxFileUpload({ 
				url: that.url,//用于文件上传的服务器端请求地址
				data: o.params,
				secureuri: false,//一般设置为false
				fileElementId: fieldField.id,//文件上传空间的id属性  <input type="file" id="file" name="file" />
				dataType: 'json',//返回值类型 一般设置为json
				success: o.success ? o.success: function(){alert('上传成功');},
				error: function(data, status, e) {
                    if (o.error){
                        o.error(data, status, e);
                        return
                    }
					alert('上传失败');
				}
			});
		}
		else {
			
			Design.ajax({
				params: Design.apply(that.getValues(),o.params),
				url: that.url,
				success: function(data) {
					if (o.success) {
						o.success.call(that, data);
					}
				},
				error: function(data) {
					if (o.error) {
						o.error.call(that, data);
						return;
					}
					alert('提交失败');
				}
			});
		}
	},
	afterInit: function() {
		Design.form.Form.superclass.afterInit.call(this);
	},
	setModel: function(model) {
		var that = this;
		this.model = model;
		this.initChild();
		model.forEach(function(name,value) {
			var radio = $('body').find('input:radio[name="'+name+'"]');
			if (radio[0]) {
				radio = $('body').find('input:radio[value="'+value+'"]');
				radio.attr('checked', true);
				return;
			}
			
			var input = $('body').find('input[name="'+name+'"]');
			if (input[0]) {
				input.val(value);
				return;
			}
			
			var select = $('body').find('select[name="'+name+'"]');
			if (select[0]) {
				select.val(value);
				return;
			}
			
		});
	},
  
	initialize:function(c){
        
		if (Design.isObject(c.fieldDefaults)) {
			c.items.forEach(function(item) {
				Design.applyIf(item, c.fieldDefaults);
			})
		}
        c.items.forEach(function(item) {
			item.style = item.style || {};
            item.style['padding-top'] = item.style['padding-top'] || '8px';
		});
        
		if (c.model && c.items) {
			c.items.forEach(function(item) {
				item.value = c.model.get(item.name) || ''
			})
		}
		Design.form.Form.superclass.initialize.call(this,c);
		$(this.bodyEl).css('overflow-y', 'auto');
	},
	saveModel:function(){
		var model = this.model;
		
		this.forEach(function(item) {
			model.set(item.name,item.getValue());
		});
		return model;
	},
	getValues:function(){
		var json = {};
		this.forEach(function(item){
			if (item.name) {
				json[item.name] = item.getValue();
			}
		});
		return json;
	}
}) 