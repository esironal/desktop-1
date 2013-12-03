


Design.define('Design.form.field.FieldContainer',{
	alias:'widget.fieldcontainer',
	extend:'Design.Compoment',
	initialize:function(c){
	
		if (Design.isObject(c.fieldDefaults)) {
			c.items.forEach(function(item) {
				Design.applyIf(item, c.fieldDefaults);
			})
			
		}
	},
	setStyleByParent: function(where) {
		this.cutWidth = this.labelWidth;
		if (this.labelAlign == "top") {
			this.cutWidth = 0;
		}
		//console.log(1)
		Design.form.field.FieldContainer.superclass.setStyleByParent.call(this, where);
	},
	afterInit: function() {
		this.forEach(function(cmp) {
			$(cmp.el).css('padding-top', 0)
		})
	},
	labelWidth:0,
	label:'',
	width: '100%',
	separator:':',
	title:'',
	template:[
		'<table cellpadding="0" id = "${c.id}" cellspacing="0" class="fieldcontainer" style= "${util.encodeStyle(c.style)}">',
			'<tbody>',
				'{if c.labelWidth && c.labelAlign == "top"}',
					'<tr>',
						'<td width="">',
							'{if c.label}',
								'<label style= "${util.encodeStyle(c.labelStyle)}" for="${c.id}">${c.label}${c.separator} {if c.allowBlank === false}<span style="color:red;">*</span> {/if}</label>',
							'{/if}',
						'</td>',
					'</tr>',
				'{/if}',
				'<tr>',
					'{if c.labelWidth && (c.labelAlign == "left" || c.labelAlign == undefined)}',
						'<td width="${c.labelWidth}">',
							'{if c.label}',
								'<label style= "${util.encodeStyle(c.labelStyle)}">${c.label}${c.separator}</label>',
							'{/if}',
						'</td>',
					'{/if}',
					'<td>',
						'<div id="${c.id}-body" class="field-container-body" style="padding-top:8px;${util.encodeStyle(c.fieldStyle)};width:100%">',
						'</div>',
					'</td>',
				'</tr>',
			'</tbody>',
		'</table>'
	]
	
});