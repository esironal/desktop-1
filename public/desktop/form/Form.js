var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../panel/Panel", './fields/TextField', './fields/Combobox'], function(require, exports, __panel__, __TextField__, __Combobox__) {
    var panel = __panel__;
    var TextField = __TextField__;
    var Combobox = __Combobox__;

    var Form = (function (_super) {
        __extends(Form, _super);
        function Form() {
            _super.apply(this, arguments);
            this.url = '';
        }
        Form.prototype.initElement = function () {
            var items = this.items;
            this.items = [];

            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                if (item['xtype'] === 'textfield') {
                    item['top'] = 30 * i;
                    this.items.push(new TextField(item));
                }
                if (item['xtype'] === 'combobox') {
                    item['top'] = 30 * i;
                    this.items.push(new Combobox(item));
                }
            }
            _super.prototype.initElement.call(this);
            $(this.bodyElement).append('<form class="form-panel"></form>');
            this.bodyElement = $(this.bodyElement).find('form')[0];
        };

        Form.prototype.getValues = function () {
            var json = {}, array = $(this.bodyElement).serializeArray();

            for (var i = 0, length = array.length; i < length; i++) {
                json[array[i].name] = array[i].value;
            }

            return json;
        };

        Form.prototype.submit = function (cfg) {
            $.ajax({
                type: 'POST',
                data: $.extend(this.getValues(), cfg.params),
                url: this.url,
                success: cfg.success,
                error: cfg.error
            });

            console.log();
        };
        return Form;
    })(panel.Panel);
    exports.Form = Form;
});
