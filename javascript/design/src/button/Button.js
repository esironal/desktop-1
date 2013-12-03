
(function(){
	
	
	
	Design.define('Design.button.Button',{
		extend:'Design.Compoment',
		alias:['widget.button'],
		events: {
			'click button': 'handler'
		},
		label: '',
		labelAlign: 'right',
		initialize: function(cfg) {
			$(this.el).find('label').css('cursor', 'pointer');
		},
		handler: function() {
			this.fireEvent('click');
		},
		template:[
			'<div class = "x-btn" style="float:left;margin-left:5px; margin-top:5px;">',
				'<button id = "${c.id}" type = "button" style="height: 17px;width:${c.labelWidth}px;cursor: pointer;">',
					'<div class="${c.iconCls}" title = "" style="float:left"></div><div class = "" style="margin-top:0px;float:left">${c.label}</div>',
				'</button>',
			'</div>'
		]
	});

})()
