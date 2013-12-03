

Design.define('Design.tab.Panel',{
	extend:'Design.panel.Panel',
	alias: ['widget.tabpanel'],
	requires: ['Design.tab.Header'],
	events:{
	    'click .close': 'close',
		'click .min': 'min'
    },
	close: function () {
        this.fireEvent('close');
    },
    min: function () {
        this.fireEvent('min');
},
	addHeader: function(cfg) {
		var that = this;
		if (cfg.items) {
			this.header = Design.widget('tabheader', {
				tabItems: cfg.items
			});
			this.toolHeight = 30;
			this.header.addEvent('active', function (name, index) {
			    that.activeIndex = index;
				that.forEach(function(item, i){
					if (item instanceof Design.Compoment) {
						item.hide();
					}
					if (i == index) {
					    item.show();
					}
				});
				
			});
			this.header.addEvent('close', function () {
			    that.remove()
			});
			this.header.addEvent('min', function () {
			    that.hide()
			});
			cfg.items.forEach(function(item) {
			    if (item instanceof Design.Compoment) {
			        item.header = undefined;
			        item.toolHeight -= 30;
			    }
			    else {
			        item.title = undefined;
			    }
			});
		}
	},
	onResize: function () {
	    Design.tab.Panel.superclass.onResize.call(this);
	    var that = this;
	    
	},
	render: function(where) {
		var that = this;
		
		this.initChild(0);
		
		if(where){
			$(where).append(this.el);
			
			
			this.afterInit.call(that,that);
			
			this.onResize();
			this._afterRender();
		}
		else{
			return this.el;
		}
	},
	
	setItem:function(item){
		var me = this;
		if(typeof item === 'number'){
			item = me.getItems()[item]
		}
		if(me.getCurrentItem()===item){
			return;
		}
		if(me.getCurrentItem()){
			me.getCurrentItem().cmp.hide();
		}
		if(item.cmp){
			item.cmp.show();
			item.cmp.callResize();
			me.setCurrentItem(item);
		}else{
			if(!item.xtype) item.xtype = 'panel'
			item.header = null
			item.cmp = Design.widget(item.xtype,item);
			me.setCurrentItem(item);
		}
	}
	
	
})