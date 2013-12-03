setTimeout(function () {
    var dataMap = {}, idIndex = 1, currentFactor = null, grid, newDateIds = {}, loadparams = null;
    Design.define('Simulating', {
        extend: 'Design.data.Model',
        url: './rateSimulating',
        fields: [
            { name: 'takeEffectDate', type: 'date' },
            { name: 'value', type: 'string' },
            { name: 'rateFactorId', type: 'string' },
            { name: 'curveId', type: 'string' },
            { name: 'termId', type: 'string' },
            { name: 'id', type: 'int' }
        ]
    });

    var store = Design.create('Design.data.Store', {
        model: 'Simulating',
        type: 'tree',
        data: [],
        id: 'col2'
    });
    var panel;
    function dateRender(model, v) {
        if (newDateIds[model.get('id')]) {
            return "<span style = 'color: #3366CC'>" + v + "</span>";
        }
        return v;
    }
    function valueRender(model, v) {
        if (newDateIds[model.get('id')]) {
            return "<span style = 'color: #3366CC'>" + v + " %</span>";
        }
        return v + " %";
    }
    function showChart(store) {
        if (!store.models.length)
            return;
        var values = [], baseDate = new Date(store.models[store.count() - 1].get('takeEffectDate').replace(/-/g, '/')), before = store.models[store.count() - 1].get('value');

        for (var i = 0; i < 60; i++) {
            var date = addMonths2(baseDate, i, 2), month = date.getMonth(), year = date.getFullYear(), dayCount = getMonthDays(year, month), isFind = false;

            for (var j = dayCount - 1; j >= 0 && !isFind; j--) {
                var date_str = year + "-" + (month + 1 < 10 ? '0' + (month + 1) : (month + 1)) + "-" + (j < 10 ? ('0' + j) : j + '');
                store.forEach(function (model) {
                    if (date_str == model.get('takeEffectDate') && !isFind) {
                        before = model.get('value');
                        isFind = true;
                    }
                });
            }
            values.push([date.getTime(), parseInt(before || 0)]);
        }

        var linemaps = [
            {
                name: currentFactor.termName,
                data: values,
                step: true,
                tooltip: {
                    yDecimals: 2
                }
            }
        ];
        panel.getItems()[2].setData(linemaps);
    }

    function loadSimulating(params) {
        dataMap[params.curveId] = dataMap[params.curveId] || [];
        store = Design.create('Design.data.Store', {
            model: 'Simulating',
            type: 'tree',
            data: dataMap[params.curveId]
        });
        store.sort(function (m1, m2) {
            var d1Arr = m1.get('takeEffectDate').split('-');
            var d2Arr = m2.get('takeEffectDate').split('-');

            var v1 = new Date(d1Arr[0], d1Arr[1], d1Arr[2]);
            var v2 = new Date(d2Arr[0], d2Arr[1], d2Arr[2]);
            return v1 < v2;
        });
        panel.getChild(1).bindStore(store);
        showChart(store);
    }
    var columns = [
        { text: '生效日期', width: 200, dataIndex: 'takeEffectDate', align: 'center', renderer: dateRender },
        { text: '利率', width: 200, dataIndex: 'value', align: 'right', renderer: valueRender },
        {
            text: '编辑',
            width: 200,
            align: 'center',
            editor: {
                xtype: 'container',
                display: true,
                style: { 'display': 'inline-block' },
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'icon-edit',
                        tip: '编辑',
                        style: { 'float': 'left', 'padding-top': 0 },
                        handler: function () {
                            var model = (Design.getCmp($(this.el).parents('td')[0].id).model);
                            form.show();
                            form.setModel(model);
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon-remove',
                        tip: '删除',
                        style: { 'padding-left': '10px', 'float': 'left', 'padding-top': 0 },
                        handler: function (m) {
                            if (!confirm('是否要删除')) {
                                return;
                            }
                            var model = (Design.getCmp($(this.el).parents('td')[0].id).model);

                            var id = model.get('id');
                            dataMap[model.get('curveId')].forEach(function (item, index) {
                                if (item.id == id) {
                                    dataMap[model.get('curveId')].splice(index, 1);
                                }
                            });
                            store.remove(model);
                        }
                    }
                ]
            }
        }
    ];

    var form = Design.widget('form', {
        style: {
            width: 370,
            height: 260
        },
        drag: true,
        title: {
            text: '添加'
        },
        buttons: [
            {
                text: '确定',
                handler: function (_form) {
                    if (!form.validate())
                        return;

                    var model = _form.saveModel();
                    var id = model.get('id');
                    if (!id) {
                        model.set('id', idIndex++);
                    }
                    dataMap[model.get('curveId')].forEach(function (item, index) {
                        if (item.id == id) {
                            dataMap[model.get('curveId')].splice(index, 1);
                        }
                    });
                    store.remove(model);

                    store.add(model);
                    dataMap[model.get('curveId')].push(model.data);
                    store.sort(function (m1, m2) {
                        var d1Arr = m1.get('takeEffectDate').split('-');
                        var d2Arr = m2.get('takeEffectDate').split('-');

                        var v1 = new Date(d1Arr[0], d1Arr[1], d1Arr[2]);
                        var v2 = new Date(d2Arr[0], d2Arr[1], d2Arr[2]);
                        return v1 < v2;
                    });
                    showChart(store);
                    form.remove();
                }
            },
            {
                text: '取消',
                handler: function () {
                    form.remove();
                }
            }
        ],
        bodyPadding: 50,
        items: [
            {
                xtype: 'datefield',
                label: '生效日期',
                allowBlank: false,
                labelWidth: 70,
                name: 'takeEffectDate',
                fieldStyle: {
                    width: 200
                }
            },
            {
                xtype: 'textfield',
                label: '利率值',
                labelWidth: 70,
                allowBlank: false,
                matcher: /^([0-9]{1,3})(\.[0-9]{1,6})?$/,
                matcherMsg: '只允许输入小数点前两位与后两位',
                name: 'value',
                customValidator: function (value) {
                    if (parseFloat(value) <= 100) {
                        return true;
                    }
                    return "请输入100以下的小数";
                },
                fieldStyle: {
                    width: 200
                }
            }
        ]
    });

    panel = Design.widget('panel', {
        style: {
            width: 1300,
            height: 750
        },
        drag: true,
        title: {
            text: ''
        },
        items: [
            {
                xtype: 'tree',
                title: {
                    text: '利率曲线'
                },
                setting: {
                    callback: {
                        onClick: function (e, id, data) {
                            if (data.basTermId != -1) {
                                currentFactor = data;
                                loadparams = {
                                    rateFactorId: 100,
                                    curveId: currentFactor.icurveId,
                                    termId: currentFactor.basTermId
                                };
                                loadSimulating(loadparams);
                            }
                        }
                    }
                },
                style: {
                    width: '20%',
                    height: '100%',
                    'float': 'left'
                },
                bodyStyle: {
                    overflow: 'auto'
                },
                displayField: 'itemname',
                datas: treeList
            },
            {
                xtype: 'treepanel',
                columns: columns,
                store: store,
                toolbar: [
                    {
                        dock: 'top',
                        items: [
                            {
                                xtype: 'button',
                                label: '显示图表',
                                labelWidth: 50,
                                handler: function () {
                                    var items = panel.getItems();
                                    if (items[2].isShow()) {
                                        items[0].resize('20%', '100%');
                                        items[1].resize('80%', '100%');
                                        items[2].hide();
                                    } else {
                                        items[0].resize('20%', '60%');
                                        items[1].resize('80%', '60%');
                                        items[2].show();
                                    }
                                },
                                iconCls: 'icon-grow'
                            },
                            {
                                xtype: 'button',
                                label: '添加',
                                labelWidth: 50,
                                handler: function () {
                                    if (currentFactor == null) {
                                        alert('请选择期限');
                                        return;
                                    }
                                    form.show();

                                    var data = {
                                        rateFactorId: 100,
                                        curveId: currentFactor.icurveId,
                                        termId: currentFactor.basTermId
                                    };

                                    form.setModel(new Simulating(data));
                                },
                                iconCls: 'icon-plus'
                            }
                        ]
                    }
                ],
                title: {
                    text: '利率模拟'
                },
                style: {
                    width: '80%',
                    height: '100%',
                    'float': 'left'
                }
            },
            {
                xtype: 'chart',
                title: {
                    text: 'chart'
                },
                style: {
                    width: '100%',
                    'clear': 'left',
                    height: '40%',
                    display: 'none'
                }
            }
        ]
    });

    window["rateSimulating"] = panel;
}, 2000);
