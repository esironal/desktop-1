
	
Design.define('Design.form.field.File',{
	alias:'widget.filefield',
	extend:'Design.form.field.Base',
	fieldTemplate : [
		'<input class="design-field-component  ${c.cls}" type="file" id = "${c.id}" value = "${c.value}" style="${util.encodeStyle(c.fieldStyle)}"  name = "${c.name}" />'
	]
});