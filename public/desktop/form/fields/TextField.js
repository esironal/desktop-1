var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./BaseField"], function(require, exports, __cmp__) {
    var cmp = __cmp__;

    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            _super.apply(this, arguments);
            this.fieldTemplate = [
                '<input type = "text" value = "${me.value}" name="${me.name}" /> </div>'
            ];
        }
        return TextField;
    })(cmp);

    
    return TextField;
});
