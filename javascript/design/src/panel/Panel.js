

(function() {

	
	
	Design.define('Design.panel.Panel',{
		extend:'Design.Compoment',
		alias: 'widget.panel',
		events: {
		    'click .design-modal-footer': 'buttonClick',
		    'mousedown' : 'clickPanel'
		},
		
		requires : ['Design.header.Header', 'Design.toolbar.Toolbar', 'Design.toolbar.Pagination', 'Design.form.field.DisplayField'],
		addHeader: function(cfg) {
			var that = this;
			if (cfg.title) {
				this.header = Design.widget('header', {
					text: cfg.title.text,
					drag: cfg.drag
				});

				this.header.addEvent('close', function () {
				    that.remove()
				});
				this.header.addEvent('min', function () {
				    that.hide()
				});
				
				this.toolHeight += 30;
			}
		},
		setTitle: function(text) {
			this.header.setText(text);
		},
		addToolbar: function(cfg) {
			cfg.toolbar = cfg.toolbar || [];
			var that = this;
			cfg.toolbar.forEach(function(toolbar) {
				
				toolbar.dock = toolbar.dock || 'top';
				if (toolbar.dock == 'top') {
					that.toolHeight += 32;
					that.topbar = Design.widget('toolbar', toolbar);
				}
				if (toolbar.dock == 'bottom') {
					that.toolHeight += 32;
					that.bbar = Design.widget('toolbar', toolbar);
				}
			});
			
		},
		getToolbar: function(type) {
			if (type == 'top') {
				return this.topbar;
			}
			else if (type == 'bottom'){
				return this.bbar;
			}
		},
		addButtons: function() {
			
		},
		setHtml: function(html) {
			$(this.bodyEl).html(html);
		},
		initialize: function(cfg) {
			//cfg.buttons = cfg.buttons || [];
		    if (this.buttons) {
				this.toolHeight += 50;
			}
			this.addHeader(this);
			this.addToolbar(this);
		},
		bodyPadding: 1, 
		border: 2,
		afterInit: function(that) {
			
			var that = this;
			if (this.topbar){
				this.topbar.render(function(el) {
					$(that.el).prepend(el);
				}, true);
			}
			var div = null;
			if (this.header){
				this.header.render(function(el) {
					$(that.el).prepend(el);
				}, true);
				if (this.drag === true) {
					Design.drag.Move({
						moveEl:that.el,
						eventEl:that.header.el,
						onMove: function() {
							if (div == null) {
								div = document.createElement("div")
								div = $(that.bodyEl).children().appendTo($(div));
							}
							$(that.el).find('.design-modal-footer').hide();
							$(that.el).find('.gridToolbar').hide();
							
						},
						onMouseUp: function() {
							
							$(that.bodyEl).append(div)
							div = null;
							$(that.el).find('.design-modal-footer').show();
							$(that.el).find('.gridToolbar').show();
							
						}
					});
					Design.resize({
						cmp:that,
						eventEl:that.header.el,
						
						onMove: function() {
							$(that.bodyEl).hide();
							$(that.bodyEl).children()
							if (div == null) {
								div = document.createElement("div")
								div = $(that.bodyEl).children().appendTo($(div));
							}
							$(that.el).find('.design-modal-footer').hide();
							$(that.el).find('.gridToolbar').hide();
							
						},
						onBeforeMouseUp: function() {
							$(that.bodyEl).show();
							$(that.bodyEl).append(div)
							div = null;
							$(that.el).find('.design-modal-footer').show();
							$(that.el).find('.gridToolbar').show();
						}, 
						onMouseUp: function() {
							
							//$(that.bodyEl).children().show();
						}
					});
					
				}
			}
			if (this.bbar){
				this.bbar.render(function(el) {
					$(that.el).append(el);
				}, true);
			}
		},

		clickPanel: function () {
		    window["z-index"] = window["z-index"] + 1 || 100
		    $(this.el).css("z-index", window["z-index"]);
		},

		show: function (x, y) {

		    if (x == true) {

		        $(this.el).show();
		        return;
		    }

			var render = "body";
			var that = this, isMax = false, bWidth, bHeight, bTop, bLeft;
			if (this.drag === true) {
			
				if (Design.isString(x)) {
					render = x;
					x = undefined;
				}
				
				x = x || $('body').width()/2 - this.width/2;
				y = y || $('body').height()/2 - this.height/2;
				$(this.el).css('z-index', '100');
				
				this.render(render); 
				
				$(this.el).css('left', x);
				$(this.el).css('top',  y);
				$(that.header.el).dblclick(function(event) {
					var start = new Date
					$(that.bodyEl).children().hide();
					
					
					if (isMax) {
						that.resize(bWidth, bHeight);
						$(that.el).css('left', bLeft);
						$(that.el).css('top', bTop);
						isMax = false;
					}
					else {
						bWidth = that.getWidth();
						bHeight = that.getHeight();
						bTop = $(that.el).css('top');
						bLeft = $(that.el).css('left');
                        
						that.resize($("body").width(), $("body").height()-40);
						$(that.el).css('left', 0);
						$(that.el).css('top', 0);
						isMax = true;
					}
					$(that.bodyEl).children().show();
					
					
				});
				
				
				
			}
			else {
				$(this.el).show();
			}
		},
		buttonClick: function(e,t) {
			var button = this.buttons[$(e.target).attr('index')];
			if (button)
				this.buttons[$(e.target).attr('index')].handler.call(this,this);
		},
		template: [
		
			'<div id="${c.id}" name="${c.name}" class="design-panel design-modal" style="${util.encodeStyle(c.style)}" >',
				'<div id="${c.id}-body" class="design-panel-body" style=" overflow-y: hidden;overflow-x: hidden;${util.encodeStyle(c.bodyStyle)};">',
					'${c.html}', 
				'</div>',
				'{if c.buttons}',
					'<div class="design-modal-footer" >',
						'{for button in c.buttons}',
							'<a class="btn primary" index = "${button_index}"> ${button.text} </a>',
						'{/for}',
					'</div>',
				'{/if}',
				
				'{if c.drag}',
					'<div class="design-resize-left design-resize"></div>',
					'<div class="design-resize-right design-resize"></div>',
					'<div class="design-resize-bottom design-resize"></div>',
					'<div class="design-resize-right-bottom design-resize"></div>',
					'<div class="design-resize-left-bottom design-resize" ></div>',
				'{/if}',
			'</div>'
		]
	});

})();