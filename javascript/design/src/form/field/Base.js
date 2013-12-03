Design.define('Design.form.field.Base',{
	extend:'Design.Compoment',
	labelWidth :0,
	separator: ':',
	requires: ['Design.form.field.VTypes','Design.data.Validations'],
	
	getEl: function() {
		return document.getElementById(this.id);
	},
	getElement: function() {
		return document.getElementById(this.id);
	},
	setValue: function(v) {
		$(this.getEl()).val(v);
	},
	getValue: function() {
		return $(this.getEl()).val();
	},
	focus: function() {
		$(this.getEl()).focus();
	},
	//onResize: function(){},
	validate: function() {
		var value = this.getValue(),
			el = $(document.getElementById(this.id)),
			isValid = Design.data.Validations.validate(this,value);
		
		if (isValid === true && this.vtype && value) {
			isValid = Design.form.field.VTypes[this.vtype].call(window,value);
			isValid = isValid ? isValid : Design.form.field.VTypes[this.vtype +'Text'];
		}
		
		if (isValid === true && this.customValidator) {
			isValid = this.customValidator(value);
		}
		if (isValid !== true) {
			$(el).addClass('x-form-invalid-field');
			$(el).attr('title', isValid);
		}
		else {
			$(el).removeClass('x-form-invalid-field');
			$(el).attr('title', '');
		}
		return isValid === true;
	},
    setError: function(isValid) {
        var el = $(document.getElementById(this.id));
        $(el).addClass('x-form-invalid-field');
		$(el).attr('title', isValid);
    },
    removeError: function() {
        var el = $(document.getElementById(this.id));
        $(el).removeClass('x-form-invalid-field');
		$(el).attr('title', '');
    },
	events: {
		"keyup .design-field-component" : "validate",
		"change .design-field-component" : "validate",
		"blur .design-field-component" : "validate"
	},
	constructor: function(cfg) {
	
		this.template = [
			'<table cellpadding="0" cellspacing="0" class="layout-table" id = "${c.id}-table" style="border:none;margin-top:0px;${util.encodeStyle(c.style)};">',
				'<tbody>',
					'{if c.labelWidth && c.labelAlign == "top"}',
					'<tr>',
						'<td >',
							'{if c.label}',
								'<label style= "${util.encodeStyle(c.labelStyle)}" for="${c.id}">${c.label}${c.separator} {if c.allowBlank === false}<span style="color:red;">*</span> {/if}</label>',
							'{/if}',
						'</td>',
					'</tr>',
					'{/if}',
					'<tr>',
						'{if c.labelWidth && (c.labelAlign == "left" || c.labelAlign == undefined)}',
							'<td width="${c.labelWidth}" >',
								'{if c.label}',
									'<label style = "${util.encodeStyle(c.labelStyle)}" for="${c.id}">${c.label}${c.separator} {if c.allowBlank === false}<span style="color:red;">*</span> {/if}</label>',
								'{/if}',
							'</td>',
						'{/if}',
						'<td>',
							'<div id = "${c.id}-item" class="form-item">',
								this.fieldTemplate.join('\n'),
							'</div>',
						'</td>',
						'{if c.labelWidth && c.labelAlign == "right"}',
							'<td width="${c.labelWidth}">',
								'{if c.label}',
									'<label style= "${util.encodeStyle(c.labelStyle)}" for="${c.id}">${c.label}${c.separator}</label>',
								'{/if}',
							'</td>',
						'{/if}',
					'</tr>',
				'</tbody>',
			'</table>'
		];
		Design.form.field.Base.superclass.constructor.call(this, cfg);
	}
});