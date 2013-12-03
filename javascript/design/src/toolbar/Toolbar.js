function strlen(s) {
	var l = 0;
	var a = s.split("");
	for (var i = 0; i < a.length; i++) {
		if (a [i].charCodeAt(0) < 299) {
			l++;
		}
		else {
			l+=2;
		}
	}
	return l;
}
Design.define('Design.toolbar.Toolbar',{
	extend:'Design.Compoment',
	alias:['widget.toolbar'],
	requires: 'Design.button.Button',
	initialize: function(cfg) {
		cfg.items.forEach(function(item) {
			item.style = item.style || {};
			item.style['float'] = item.style['float'] || 'left';
			item.style['padding-right'] = item.style['padding-right'] || '10px';
            item.style['padding-top'] = item.style['padding-top'] || '8px';
			if (item.xtype == 'button') {
				item.separator = '';
				item.labelWidth = strlen(item.label)*9 + 16;
				item.labelDock = 'right';
			}
		});
	},
	afterInit: function() {
		$(this.el).find('.layout-table').css('padding-top','5px');
		$(this.el).find('.field-container-body').css('padding-top','0px');
		
		
	},
	template:[
		'<div id="${c.id}" class="gridToolbar" style="${util.encodeStyle(c.style)};padding-left:10px;">', 
			'<ul id="${c.id}-body" style = "margin-top:0px;" >',
				
			'</ul>',
		'</div>',
	]

});
