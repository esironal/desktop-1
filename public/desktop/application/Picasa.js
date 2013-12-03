var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../panel/Panel"], function(require, exports, __panel__) {
    var panel = __panel__;

    var Picasa = (function (_super) {
        __extends(Picasa, _super);
        function Picasa() {
            _super.apply(this, arguments);
            this.filePath = '';
            this.icon = 'picasa';
            this.width = $("body").width() / 1.5;
            this.height = $("body").height() / 1.5;
            this.backgroundColor = '#000';
        }
        Picasa.prototype.initElement = function () {
            _super.prototype.initElement.call(this);

            //this.setTitle(this.name);
            this.setHtml('<div style="text-align:center;width:100%;height:100%"><img style="max-height:100%;height:100%"  src="' + this.filePath + '" />');
        };
        return Picasa;
    })(panel.Panel);
    exports.Picasa = Picasa;
});
