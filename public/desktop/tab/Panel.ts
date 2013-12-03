import basePanel = require("../panel/Panel");

export class Panel extends basePanel.Panel { 
    

    
    headerHeight= 40;

    
    onResize () { 
        
        super.onResize();
        var elWidth = $(this.element).width();
        
        $(this.element).find(".tab-title-bar").width(elWidth - 14);
    }
    
    
    initItems() 
    { 
        var that = this;

        this.items.forEach(function (cmp) 
        { 
            cmp.parentCmp = that;
            cmp.initialize();
        });

        
        that.bodyElement.appendChild(this.items[0].element);
    }

    template = [
        '<div class="win-panel ${me.className}" id="${me.id} " style ="${me.style}">',
            '<div class="header">',
                '{for tab in me.items}',
                    '<div class="tab-title "><span>${tab.title}</span></div>',
                '{/for}',
                '<div class="panel-title-buttons">',
                    '<div class="icon icon-win8-close"> </div>',
                    '<div class="icon icon-win8-max"> </div>',
                    '<div class="icon icon-win8-min"> </div> ',
                '</div>',
            '</div>',
            '<div id="${me.id}-body" class="win-panel-body">',
            '</div>',
        '</div>'
    ];
}
