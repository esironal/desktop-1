import panel = require("../panel/Panel");
import TextField = require('./fields/TextField');
import Combobox = require('./fields/Combobox');

export class Form extends panel.Panel 
{
    url = '';
    initElement()
    {
        var items = this.items;
        this.items = [];
        
        for (var i = 0, len = items.length; i < len; i++)
        { 
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
        super.initElement();
        $(this.bodyElement).append('<form class="form-panel"></form>');
        this.bodyElement = $(this.bodyElement).find('form')[0];
    }

    getValues() {
        var json = {}
            , array = $(this.bodyElement).serializeArray();

        for (var i = 0, length = array.length; i < length; i++) {
            json[array[i].name] = array[i].value;
        }

        return json;
    }

    submit(cfg) {

        $.ajax({
            type: 'POST',
            data: $.extend(this.getValues(), cfg.params),
            url: this.url,
            success: cfg.success,
            error: cfg.error
        });

        console.log();
    }
}
