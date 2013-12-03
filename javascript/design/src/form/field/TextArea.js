
	
Design.define('Design.form.field.TextArea',{
	alias:'widget.textareafield',
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
		'<textarea class="design-field-component field-text"  id = "${c.id}" style="width:100%;height:50px;${util.encodeStyle(c.fieldStyle)}"  name = "${c.name}" >${c.value}</textarea>'
	]
});