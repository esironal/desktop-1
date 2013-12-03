
	
Design.define('Design.form.field.Date',{
	alias:'widget.datefield',
	extend:'Design.form.field.Text',
	fieldTemplate : [
		'<input class="design-field-component field-text" value = "${c.value}"  type="text" id = "${c.id}" style="width: 100%;${util.encodeStyle(c.fieldStyle)}"  name = "${c.name}" />'
	],
	afterInit : function(){
		var root = this
		if (root.isRender === true) return;
		root.isRender = true;
		setTimeout(function() {
			Calendar.setup({ 
				animation: false,
				trigger: root.id,
				inputField: root.id,
				dateFormat: "%Y-%m-%d",
				onSelect: function(cal) {
					if(root.onSelect)
						root.onSelect.call(root);
					cal.hide();
					$(root.getEl()).trigger('change');
				
				},
				onTimeChange:function(){
					if(root.onTimeChange)
						root.onTimeChange.call(root);
				},
				onFocus:function(){
					if(root.onFocus)
						root.onFocus.call(root);
				},
				onBlur:function(){
					
					if(root.onBlur)
						root.onBlur.call(root);
				}	
			});
		},0);
	}
	
});