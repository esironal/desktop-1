
import BaseField = require("./BaseField");

class Combobox extends BaseField
{ 
    displayField = 'value';
    valueField = 'key';
    data = [];

    fieldTemplate = [
        '<select name="${me.name}"> ',
            '{for data in me.data}',
            '<option value = "${data[me.valueField]}" {if me.value == data[me.valueField]} selected {/if}>',
                '${data[me.displayField]}',
            '</option>',
            '{/for}',
        '</select>',
    ]
}

export = Combobox;

