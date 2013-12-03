

Design.define('Design.form.field.Combobox',{
	alias:['widget.combobox','widget.combo'],
	extend:'Design.form.field.Base',
    events: {
        "change select" : "onChange"
    },
    onChange: {
        
    },
    setSelected:function(value){
        var options = this.getEl().options;
        for(var i = 0;i<options.length; i++) {
             if(options[i].value == value)
                options[i].selected = true
        }
    },
    update:function(items){
        var that = this ;
        $(this.getEl()).html("");
        items.forEach(function(item){
            that.getEl().options.add(new Option(item[that.displayField],item[that.valueField]));
        }) 
        this.setSelected(this.value);
    },
	fieldTemplate:[
		'<select name="${c.name}" id="${c.id}" class="design-field-component field-select${c.cls}" style="width: 100%;margin-top: 0px;${util.encodeStyle(c.fieldStyle)}" > ',
			'{for data in c.data}',
			'<option value = "${data[c.valueField]}" {if c.value == data[c.valueField]} selected {/if}>',
				'${data[c.displayField]}',
			'</option>',
			'{/for}',
		'</select>',
	],
	setStyleByParent: function(where) {
		Design.form.field.Combobox.superclass.setStyleByParent.apply(this, arguments);
		var labelWidth = this.labelWidth;
		if (this.labelAlign == "top") {
			labelWidth = 0;
		}
		if (!(this.fieldStyle || {}).width)
			$('#' + this.id).css('width', parseInt(Design.getNumByPercent(this.width, where.width())) - labelWidth - 5 + 'px');
	},
	/*
	setValue: function(value) {
		var options = this.getEl().options;
		for (var i = 0, len = options.length; i < len; i++) {
			if (options[i].value == value) {
				options[i].selected = true
			}
		}
	},
	*/
	initialize:function(){
		
		//var that = this;
		//this.data.forEach(function(data) {
		//	$(that.el).find('#'+that.id)[0].options.add(new Option(data[that.displayField],data[that.valueField]));
		//})
		
	}
})