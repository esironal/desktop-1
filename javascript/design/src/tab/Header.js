
Design.define('Design.tab.Header',{
	extend:'Design.Compoment',
	alias:['widget.tabheader'],
	events:{
		"click .tabHeader" : "clickItem",
	    'click .close': 'close',
		    'click .min': 'min'
    },
    close: function() {
        this.fireEvent('close');
    },
    min: function () {
        this.fireEvent('min');
    },
	clickItem:function(e,t){

		$('.tabHeader').removeClass('tabHeader-active');
		$(e.target).parents('.tabHeader').addClass('tabHeader-active');
		var index = $(e.target).parents('.tabHeader').attr('item');
		
		this.fireEvent('active', index);
		
	},
	template:[
		'<div id="${c.id}" class="design-modal-header" style="height:30px;${util.encodeStyle(c.style)}">', 
			'<div id="${c.id}-body" class="design-panel-header-title" style="height:30px;">',
				'{for item in c.tabItems}',
					'<div id="${item.tabId}" class = "tabHeader {if item_index == 0} tabHeader-active {/if} " item = "${item_index}">',
						'<div class="l"></div>',
						'<div class="c"> <span>${item.title.text} </span></div>',
						'<div class="r"></div>',
					'</div>',
				'{/for}',
					'<a sign="" class="min" style="" id="ext-gen8">-</a>',
					'<a sign="" class="close" style="" id="ext-gen8">x</a>',
				
			'</div>',
			'<div style="float:right"></div>',
		'</div>',
	]

});
