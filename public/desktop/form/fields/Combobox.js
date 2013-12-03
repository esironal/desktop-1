var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./BaseField"], function(require, exports, __BaseField__) {
    var BaseField = __BaseField__;

    var Combobox = (function (_super) {
        __extends(Combobox, _super);
        function Combobox() {
            _super.apply(this, arguments);
            this.displayField = 'value';
            this.valueField = 'key';
            this.data = [];
            this.fieldTemplate = [
                '<select name="${me.name}"> ',
                '{for data in me.data}',
                '<option value = "${data[me.valueField]}" {if me.value == data[me.valueField]} selected {/if}>',
                '${data[me.displayField]}',
                '</option>',
                '{/for}',
                '</select>'
            ];
        }
        return Combobox;
    })(BaseField);

    
    return Combobox;
});
