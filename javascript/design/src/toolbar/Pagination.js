
Design.define('Design.toolbar.Pagination',{
	extend: 'Design.Compoment',
	alias: ['widget.pagination'],
	requires: ['Design.form.field.Text'],
	
	setPage: function(page) {
        if (Design.isFunction(this.onPage)) {
            if (!this.onPage(page)) {
                return;
            }
            
        }
		var grid = this.findParentItem('grid') || this.findParentItem('treepanel');
		this.page = page;
		grid.setPage.call(grid,page);
		$(this.el).find('input').val(page + 1);
		
	},
	setPageCount: function(page) {
		var cmps = this.findItem('displayfield');
		if(cmps.length == 2) {
			cmps[1].setValue('of ' + page);
		}
	},
	onPrev: function() {
		if (this.page > 0) {
			this.setPage(this.page - 1);
		}
	},
	onNext: function() {
		if (this.page < this.pageCount - 1) {
			this.setPage(this.page + 1);
		}
	},
	onFirst: function() {
		if (this.page != 0) {
			this.setPage(0);
		}
	},
	onLast: function() {
		if (this.page != this.pageCount - 1) {
			this.setPage(this.pageCount - 1);
		}
	},
	onRefresh: function() {
		this.setPage(this.page);
	},
	constructor: function(cfg) {
		var that = this;
		this.page = cfg.page || 0;
		
		if (cfg.manyColumns) {
			this.pageCount = cfg.manyColumns.length;
		}
		else if (cfg.pageCount != undefined) {
			this.pageCount = cfg.pageCount;
		}
        else if (cfg.store) {
            this.pageCount = cfg.store.getPageCount();
        }
        
		cfg.items = [{
			xtype: 'button',
			style: {
				'float': 'left'
			},
			handler: function() {
				that.onFirst();
			},
			iconCls: 'x-tbar-page-first'
		},{
			xtype: 'button',
			style: {
				'float': 'left'
			},
			handler: function() {
				that.onPrev();
			},
			iconCls: 'x-tbar-page-prev'
		},{
			xtype: 'button',
			style: {
				'float': 'left',
				'padding-right': '0px'
			},
			iconCls: 'x-toolbar-separator-horizontal'
		},{
			xtype: 'displayfield',
			value: 'Page',
			style: {
				'margin-top': '5px',
				'margin-right': '5px',
				'float': 'left'
			}
		},{
			xtype: 'textfield',
			value: that.page + 1,
			fieldStyle: {
				width: 30
			},
			style: {
				'float': 'left'
			},
			events: {
				"keyup input" : "onKeyup"
			},
			onKeyup: function(event) {
				var page = parseInt(this.getValue()) - 1;
				if (event.keyCode=="13" && page < that.pageCount && page >= 0){
					that.setPage(page);
				}
			}
		},{
			xtype: 'displayfield',
			value: (function() {
				if (cfg.manyColumns) {
					return 'of '+ cfg.manyColumns.length;
				}
				return 'of '+ that.pageCount
			
			})(),
			style: {
				'margin-top': '5px',
				'margin-right': '5px',
				'margin-left': '5px',
				'float': 'left'
			}
		},{
			xtype: 'button',
			style: {
				'float': 'left',
				'padding-right': '0px'
			},
			iconCls: 'x-toolbar-separator-horizontal'
		},{
			xtype: 'button',
			style: {
				'float': 'left'
			},
			handler: function() {
				that.onNext();
			},
			iconCls: 'x-tbar-page-next'
		},{
			xtype: 'button',
			style: {
				'float': 'left'
			},
			handler: function() {
				that.onLast();
			},
			iconCls: 'x-tbar-page-last'
		},{
			xtype: 'button',
			style: {
				'float': 'left',
				'padding-right': '0px'
			},
			iconCls: 'x-toolbar-separator-horizontal'
		},{
			xtype: 'button',
			style: {
				'float': 'left'
			},
			handler: function() {
				that.onRefresh();
			},
			iconCls: 'x-tbar-page-refresh'
		}];
		
		Design.toolbar.Pagination.superclass.constructor.call(this,cfg);
	},
	bindManyColumns: function(manyColumns) {
		this.manyColumns = manyColumns;
		this.pageCount = this.manyColumns.length;
		this.setPageCount(this.pageCount);
		this.setPage(0);
	},
	afterRender: function() {
		//alert($(this.el).parent().parent()[0].id);
		
		//this.grid = this.findParentItem('grid');
		//alert(this.grid);
		
	},
	template:[
		'<div id="${c.id}" class="" style="${util.encodeStyle(c.style)};padding-top:0px">', 
			'<div id="${c.id}-body", class = "x-btn" >',
			'</div>',
		'</div>'
	]

});
