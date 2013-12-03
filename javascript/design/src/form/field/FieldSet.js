

Design.define('Design.form.field.FieldSet',{
	alias:['widget.fieldset'],
	extend:'Design.Compoment',
	cutWidth: 25,
	labelWidth:50,
	label:'',
	//bodyPadding: 10,
	separator:':',
	title:'',
	width: '100%',
	events:{
		"click legend" : "clickLegend"
	},
	initialize:function(c){
		
		c.items.forEach(function(item) {
			item.style = item.style || {};
            item.style['padding-top'] = item.style['padding-top'] || '8px';
		});
		if (Design.isObject(c.fieldDefaults)) {
			c.items.forEach(function(item) {
				Design.applyIf(item, c.fieldDefaults);
			})
		}
	},
	setStyleByParent: function(where) {
		Design.form.field.FieldSet.superclass.setStyleByParent.call(this, where);
		$(this.el).width($(this.bodyEl).width());
		
	},
	clickLegend:function(e,t){
		var me = this;
		var isClass = $(me.el).toggleClass('fieldset-hide');
		$(me.el).find('.legendToggle').toggleClass('legendToggle-hide');
		if($(me.bodyEl).css('display')!='none'){
			$(me.bodyEl).css('display','none');
		}else{
			$(me.bodyEl).show();
		}
	},
	template:[
		'<fieldset id="${c.id}" style="">',
			'<legend style = "">',
				'<div class="legendToggle"></div>',
				'<div class="legendTitle">{if c.title}${c.title}{/if}</div>',
			'</legend>',
			'<div id="${c.id}-body" class="fieldset-body" style="">',
				
			'</div>',
		'</fieldset>'
	]
	
});