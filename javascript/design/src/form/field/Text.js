
	
Design.define('Design.form.field.Text',{
	alias:'widget.textfield',
	extend:'Design.form.field.Base',
	
	setStyleByParent: function(where) {
		Design.form.field.Text.superclass.setStyleByParent.apply(this, arguments);
		var labelWidth = this.labelWidth;
		if (this.labelAlign == "top") {
			labelWidth = 0;
		}
		if (!(this.fieldStyle || {}).width)
			$('#' + this.id).css('width', Design.getNumByPercent(this.width, where.width()) - labelWidth - 5 + 'px');
		
	},
	fieldTemplate : [
		
		'<input class="design-field-component field-text ${c.cls}" type="text" id = "${c.id}" value = "${c.value}" style="padding-top:0px;margin-top:0px;width: 100%;height:17px;${util.encodeStyle(c.fieldStyle)}"  name = "${c.name}" />'
	]
});