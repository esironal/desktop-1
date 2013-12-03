

Design.define('Design.form.field.Radio',{
	alias:['widget.radio'],
	extend:'Design.form.field.Base',
	
	boxLabel:'',
	labelWidth:1,
	
	fieldTemplate:[
		'<div style="padding-top:2px;${util.encodeStyle(c.fieldStyle)};">',
			'<input type="Radio" name="${c.name}" {if c.checked} checked = "true" {/if} id="${c.id}" value="${c.value}" class="design-field-component ${c.cls}" style="margin-top:-3px;border:none"/>',
			'<label for="${c.id}" style=";padding-right:5px;" >${c.boxLabel}</label>',
		'</div>'
	]
})
