import cmp = require("./BaseField");

class TextField extends cmp
{   
    fieldTemplate = [
        '<input type = "text" value = "${me.value}" name="${me.name}" /> </div>'
    ]
}

export = TextField;