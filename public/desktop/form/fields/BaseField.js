var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../Compoment"], function(require, exports, __cmp__) {
    var cmp = __cmp__;

    var BaseField = (function (_super) {
        __extends(BaseField, _super);
        function BaseField() {
            _super.apply(this, arguments);
            this.label = '';
            this.value = '';
            this.top = 0;
            this.bodyPadding = 20;
            this.labelWidth = 40;
            this.template = [
                '<div id="${me.id}" class="field-container" style="top:${me.top+ me.bodyPadding}px;;left: ${me.bodyPadding}px;right:${me.bodyPadding}px;">',
                '<label style="width:${me.labelWidth}px">${me.label}:</label>',
                '<div style ="left:${me.labelWidth}px;right:0px;">',
                '</div>'
            ];
        }
        BaseField.prototype.initElement = function () {
            _super.prototype.initElement.call(this);

            var template = TrimPath.parseTemplate(this.fieldTemplate.join(''));
            var element = $(template.process({ me: this, fieldTemplate: this.fieldTemplate.join('') }))[0];

            $(this.element).find('div').append(element);
        };
        return BaseField;
    })(cmp.Compoment);
    
    return BaseField;
});
