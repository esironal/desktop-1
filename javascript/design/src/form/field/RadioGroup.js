

Design.define('Design.form.field.RadioGroup',{
	alias:['widget.radiogroup'],
	extend:'Design.form.field.FieldContainer',
	boxLabel:'',
	labelWidth:1,
	afterInit: function() {
		$(this.el).css('width', "auto");
		$(this.el).css('padding-top', "0");
	},
	initialize:function(c){
		c.items.forEach(function(item) {
            
			Design.applyIf(item, {
				xtype: 'radio'
			});
            if (item.value == c.value) {
                item.checked = true;
            }
		})
	}
});
