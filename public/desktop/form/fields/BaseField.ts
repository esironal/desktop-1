import cmp = require("../../Compoment");

declare var TrimPath;

class BaseField extends cmp.Compoment {
    label = '';
    value = '';
    top = 0;
    fieldTemplate;
    bodyPadding = 20;
    labelWidth = 40;

    initElement() {
        super.initElement();


        var template = TrimPath.parseTemplate(this.fieldTemplate.join(''));
        var element = $(template.process({ me: this, fieldTemplate: this.fieldTemplate.join('') }))[0];

        $(this.element).find('div').append(element);
    }

    template = [
        '<div id="${me.id}" class="field-container" style="top:${me.top+ me.bodyPadding}px;;left: ${me.bodyPadding}px;right:${me.bodyPadding}px;">',
        '<label style="width:${me.labelWidth}px">${me.label}:</label>',
        '<div style ="left:${me.labelWidth}px;right:0px;">',
            
        '</div>'
    ];
}
export = BaseField