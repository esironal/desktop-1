import panel = require("../panel/Panel");

export class Picasa extends panel.Panel { 
    filePath = '';
    icon = 'picasa';
    width = $("body").width() / 1.5;
    height = $("body").height() / 1.5; 
    backgroundColor = '#000';
    initElement() { 
        super.initElement();
        //this.setTitle(this.name);
        this.setHtml('<div style="text-align:center;width:100%;height:100%"><img style="max-height:100%;height:100%"  src="' + this.filePath + '" />');

    }
}
