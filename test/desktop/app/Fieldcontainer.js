Design.define('Design.app.FieldContainer', {
    extend: "Design.form.Form",
    style: {
        width: 610,
        height: 360
    },
    title: {
        text: 'fieldcontainer'
    },
    bodyPadding: "20 50",
    fieldDefaults: {
        labelWidth: 100,
        fieldStyle: {}
    },
    items: [
        {
            xtype: 'textfield',
            label: 'Email Address',
            allowBlank: false,
            name: 'email',
            vtype: 'email',
            style: {
                width: '100%'
            }
        },
        {
            xtype: 'fieldcontainer',
            label: 'Date Range',
            items: [
                { xtype: 'datefield', name: 'startDate', labelWidth: 0, allowBlank: false, style: { width: '50%' } },
                { xtype: 'datefield', name: 'endDate', labelWidth: 10, allowBlank: false, style: { width: '50%' } }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Details',
            items: [
                {
                    xtype: 'fieldcontainer',
                    label: 'phone',
                    labelWidth: 100,
                    items: [
                        { xtype: 'displayfield', value: '(', fieldStyle: { 'padding-right': '5px' } },
                        { xtype: 'textfield', labelWidth: 0, fieldStyle: { width: '23px' } },
                        { xtype: 'displayfield', value: ')', fieldStyle: { 'padding-left': '5px', 'padding-right': '5px' } },
                        { xtype: 'textfield', labelWidth: 0, fieldStyle: { width: '30px' } },
                        { xtype: 'displayfield', value: '-', fieldStyle: { 'padding-left': '5px', 'padding-right': '5px' } },
                        {
                            xtype: 'textfield',
                            labelWidth: 0,
                            fieldStyle: { width: '30px' }
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    label: 'Time worked',
                    labelWidth: 100,
                    items: [
                        { xtype: 'textfield', name: 'hours', labelWidth: 0, fieldStyle: { width: '35px' } },
                        { xtype: 'displayfield', value: 'hours', fieldStyle: { 'padding-right': '1px' } },
                        { xtype: 'textfield', name: 'mins', fieldStyle: { width: '35px' } },
                        { xtype: 'displayfield', value: 'mins', fieldStyle: { 'padding-right': '1px' } }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    label: 'Full Name',
                    labelWidth: 100,
                    items: [
                        { xtype: 'combobox', name: 'hours', labelWidth: 0, style: { width: '20%' }, value: 'mrs', displayField: 'name', valueField: 'value', data: [{ name: 'Mr', value: 'mr' }, { name: 'Mrs', value: 'mrs' }, { name: 'Miss', value: 'miss' }] },
                        { xtype: 'textfield', name: 'firstName', labelWidth: 10, allowBlank: false, style: { width: '40%' } },
                        { xtype: 'textfield', name: 'lastName', labelWidth: 10, allowBlank: false, style: { width: '40%' } }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save',
            handler: function () {
                alert('ff');
            }
        },
        {
            text: 'Cancel',
            handler: function () {
                alert('cancel');
            }
        }
    ]
});
