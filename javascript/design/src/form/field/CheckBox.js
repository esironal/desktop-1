
Design.define('Design.form.field.CheckBox',{
	alias:['widget.checkbox'],
	extend:'Design.form.field.Base',
	
	boxLabel:'',
	labelWidth:0,
	height:30,
	
	fieldTemplate:[
		'<div  style="${util.encodeStyle(c.fieldStyle)};" >',
			'<input type="checkbox" name="${c.name}" id="${c.id}" style = "border: none" class="design-field-component ${c.cls}" />',
			'<label for="${c.id}" style="padding-right:10px;" >${c.boxLabel}</label>',
		'</div>'
	]
})