


Design.define('Design.form.field.DisplayField',{
	alias:['widget.displayfield'],
	extend:'Design.Compoment',
	
	initialize:function (c) {
		
	},
	
	setValue: function(val) {
		$(this.bodyEl).html(val);
	},
	template:[
		'<table id = "${c.id}" class = "" style=" ${util.encodeStyle(c.style)}">',
			'<tbody>',
				'<tr>',
					'<td style = "">',
						'<div id="${c.id}-body" class="form-display-field" style="margin-top:0px;${util.encodeStyle(c.fieldStyle)};">',
							'${c.value}',
						'</div>',
					'</td>',
				'</tr>',
			'</tbody>',
		'</table>'
	]
	
});
