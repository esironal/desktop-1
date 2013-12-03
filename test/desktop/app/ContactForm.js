Design.define("Design.app.ContactForm", {
    extend: "Design.form.Form",
    style: {
        width: 406,
        height: 460
    },
    title: {
        text: 'fieldcontainer'
    },
    bodyPadding: 15,
    fieldDefaults: {
        labelWidth: 100,
        labelStyle: {
            'font-weight': 'bold',
            'padding': '0'
        },
        labelAlign: 'top'
    },
    items: [
        {
            xtype: 'fieldcontainer',
            label: 'Your Name',
            labelWidth: 100,
            fieldDefaults: {
                labelWidth: 50
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'firstName',
                    labelAlign: 'top',
                    label: 'First',
                    style: {
                        width: "45%"
                    },
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    labelAlign: 'top',
                    name: 'middleInitial',
                    label: 'MI',
                    labelWidth: 30,
                    style: {
                        width: "10%"
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'lastName',
                    labelAlign: 'top',
                    label: 'Last',
                    allowBlank: false,
                    style: {
                        width: "45%"
                    }
                }
            ]
        },
        {
            xtype: 'textfield',
            name: 'firstName',
            vtype: 'email',
            label: 'Your Email Address',
            allowBlank: false,
            style: {
                width: "100%"
            }
        },
        {
            xtype: 'textfield',
            label: 'Subject',
            allowBlank: false,
            style: {
                width: "100%"
            }
        },
        {
            xtype: 'textareafield',
            label: 'Message',
            allowBlank: false,
            style: {
                width: "100%"
            },
            fieldStyle: {
                height: 130
            }
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
