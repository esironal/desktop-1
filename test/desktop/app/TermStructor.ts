declare var Design, Simulating, addMonths2, getMonthDays, treeList, jsonData, termList, $;
interface IExample7 {
    xtype?: any;
    label?: any;
    labelWidth?: any;
    fieldDefaults?: any;
    fieldStyle?: any;
    name?: any;
    width?: any;
    allowBlank?: any;
    vtype?: any;
    children?: IExample7[];
}



setTimeout(function () {
    var baseDate = new Date(), selectModels = [], monthList = [], editor, store, panel;

    for (var i = 0; i < 60; i++) {
        monthList.push('month' + (i + 1));
    }

    function getChildren(items) {
        items.forEach(function (item) {
            if (item.isTerm) {

            }
            if (item.children) {
                getChildren(item.children);
            }
        });
    }


    getChildren(termList);

    function updateDataRender(v) {
        return '<span style = "color: #3366CC">' + v + '</span>';
    }

    function setNextValue(cell, model, dataIndex) {
        var row = cell.parent;
        var isStart = false;
        if (!row) {
            return
        };
        row.forEach(function (cel) {
            if (cel == cell) {
                isStart = true;
            }
            if (isStart) {
                if (!cel.model.get(cel.column.dataIndex)) {
                    
                    $(cel.content).html("<span style='color:#ccc'> " + model.get(dataIndex) + " % </span>");
                }
            }
        });
    }

    editor = {
        afterBlur: function (cell, value) {

            var rows = cell.getParent('tr').parentRow || {}, count = 0;
            rows = rows.childRows || [];
            if (rows.length) {
                for (var i = 0, len = rows.length - 1; i < len; i++) {
                    var val = rows[i].model.get(cell.column.dataIndex);
                    if (val) {
                        count += parseFloat(val);
                    }
                }
                if (count > 100) {
                    cell.model.set(cell.column.dataIndex, value - (count - 100));
                    count = 100;
                }
                rows[rows.length - 1].model.set(cell.column.dataIndex, 100 - count);
            }

        },
        beforeRender: function (cell) {
            var rows = cell.getParent('tr').parentRow || {}, isLast = false;
            rows = rows.childRows || [];

            if (rows.length) {
                if (rows[rows.length - 1].model.get('modelId') == cell.model.get('modelId')) {
                    return false;
                }
            }
            return (cell.model.get('isTerm') && !isLast);
        },
        beforeOver: function (cell) {
            var rows = cell.getParent('tr').parentRow || {}, isLast = false;
            rows = rows.childRows || {};

            if (rows.length) {
                if (rows[rows.length - 1].model.get('modelId') == cell.model.get('modelId')) {
                    return false;
                }
            }
            return (cell.model.get('isTerm') && !isLast);
        },
        xtype: 'textfield'
    }

    function findPrevValue(model, dataIndex) {

        var index = parseInt(dataIndex.replace('month', ''));
        for (var i = index - 1; i > 0; i--) {
            var value = model.get('month' + i);
            if (value) {
                return value;
            }
        }
        return ""
    }

    function renderer(model, value, cell) {
        if (value === undefined || value === null || value === '') {
            if (model.get('isTerm')) {
                var value = findPrevValue(model, cell.column.dataIndex);
                if (value) {
                    return "<span style='color:#ccc'> " + value + " % </span>";
                }
                return value;
            }
        }
        if (value !== undefined && value !== null) {

            setNextValue(cell, model, cell.column.dataIndex);
            return value + " %";
        }
    }
    function getCollstByMonths(months, type) {

        var addMonth = 0
        var manyColumns = [];
        for (var i = 0; i < months.length / 12 / type; i++) {
            var columns = <IExample7[]>[{
                text: '名称',
                width: 300,
                locked: true,
                treeColumn: true,
                dataIndex: 'name'
            }, {
                text: '基期',
                align: 'right',
                width: 100,
                renderer: renderer,
                dataIndex: 'basePercent',
                align: 'right'
            }];

            for (var j = 0; j < 12; j++) {
                addMonth += type - 1;
                if (months[i * 12 + j + addMonth]) {
                    columns.push({
                        text: '第' + (i * 12 + j + 1 + addMonth) + '月',
                        width: 120,
                        align: 'right',
                        renderer: renderer,
                        dataIndex: months[i * 12 + j + addMonth],
                        editor: editor
                    });
                }
            }
            manyColumns.push(columns);
        }

        return manyColumns;

    }



    function showChart(models) {


        showLineChart(models);

    }

    function showLineChart(models) {

        var linemaps = [];
        models.forEach(function (model) {
            var values = []
            var name = model.get('name');
            var beforeValue = parseInt(model.get('baseValue') || 0)
            values.push([baseDate.getTime(), beforeValue]);
            monthList.forEach(function (month, i) {
                if (model.get(month)) {
                    beforeValue = parseInt(model.get(month) || 0);
                }
                values.push([Design.addMonths(baseDate, i + 1).getTime(), beforeValue])
            });
            linemaps.push({
                name: name,
                data: values,
                tooltip: {
                    yDecimals: 0
                }
            });
        });
        panel.getItems()[1].setData(linemaps);
    }

    Design.define('Structure', {
        extend: 'Design.data.Model',
        url: './TermStructure',
        fields: (function () {
            var fields = <IExample7[]>[
                { name: 'id', type: 'int' },
                { name: 'name', type: 'string' },
                { name: 'basePercent', type: 'string' },
                { name: 'accitemId', type: 'string' },
                { name: 'parentId', type: 'string' },
                { name: 'termId', type: 'string' },
                { name: 'isTerm', type: 'string' },
                { name: 'value', type: 'string' },
                { name: 'isTermItem', type: 'string' }
            ], i = 0, len = 60;

            for (; i < len; i++) {
                fields.push({ name: 'month' + (i + 1) });
            }

            return fields;
        })()
    });

    store = Design.create('Design.data.Store', {
        model: 'Structure',
        type: 'tree',
        data: termList,
        id: 'col2'
    });


    panel = Design.widget('panel', {
        drag: true,
        style: {
            width: 1200,
            height: 700
        },
        title: {
            text: 'Structure'
        },
        items: <IExample7[]>[{
            xtype: 'treepanel',
            manyColumns: getCollstByMonths(monthList, 1),
            onItemSelect: function (models, event) {
                var chart = panel.findItem('chart');
                selectModels = models;
                if (chart.isShow()) {
                    showChart(selectModels);
                }
            },
            store: store,
            stripeRows: true,
            toolbar: [{
                dock: 'top',
                items: <IExample7[]>[{
                    xtype: 'radiogroup',
                    events: {
                        'change input': 'change'
                    },
                    bodyStyle: {
                        width: '420'
                    },
                    change: function (e) {
                        var val = $(e.target).val();
                        var grid = panel.findItem('treepanel');
                        var pagination = panel.findItem('pagination');
                        var columns = getCollstByMonths(monthList, val);
                        grid.bindManyColumns(columns);
                        pagination.bindManyColumns(columns);

                    },
                    style: {
                        float: 'left'
                    },
                    items: [
                        { boxLabel: '按月查看', value: '1', name: 'showType', checked: true },
                        { boxLabel: '按季查看', name: 'showType', value: '3' },
                        { boxLabel: '按半年查看', value: '6', name: 'showType' },
                        { boxLabel: '按年查看', value: '12', name: 'showType' }
                    ]
                }, {
                    xtype: 'button',
                    iconCls: 'icon-grow',
                    style: {
                        'float': 'right'
                    },
                    label: '显示图表',
                    handler: function () {
                        var items = panel.getItems();
                        if (items[1].isShow()) {
                            items[0].resize('100%', '100%');
                            items[1].hide();
                        }
                        else {
                            items[1].show();
                            items[0].resize('100%', '60%');
                            showChart(selectModels);
                        }
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon-import',
                    style: {
                        'float': 'left'
                    },
                    label: '导出',
                    handler: function () {
                        alert('没有连接后台')
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon-import',
                    style: {
                        'float': 'left'
                    },
                    label: '导入',
                    handler: function () {

                        var importFile = Design.widget('form', {
                            title: {
                                text: '导入'
                            },
                            url: 'structure/upload',
                            drag: true,
                            style: {
                                width: 350,
                                height: 150
                            },
                            bodyPadding: 20,
                            items: [{
                                xtype: 'filefield',
                                label: '选择文件',
                                name: 'files',
                                id: 'files',
                                allowBlank: false,
                                labelWidth: 80
                            }],
                            buttons: [{
                                text: '导入文件',
                                handler: function () {
                                    alert('没有连接后台')
                                }
                            }, {
                                text: '取消',
                                handler: function () {
                                    importFile.destroy();
                                }
                            }]
                        });

                        importFile.show();
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon-import',
                    style: {
                        'float': 'left'
                    },
                    label: '导入基期值',
                    handler: function () {
                        alert('没有连接后台')
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon-save',
                    style: {
                        'float': 'left'
                    },
                    label: '保存',
                    handler: function () {
                        alert("需要保存的数据：" + Design.encode(panel.store.getDirtyData()));
                    }
                }]
            }, {
                dock: 'bottom',
                items: [{
                    style: {
                        'float': 'right'
                    },
                    manyColumns: getCollstByMonths(monthList, 1),
                    store: store,
                    xtype: 'pagination'
                }]
            }],
            style: {
                width: '100%',
                height: '100%',
                'float': 'left'
            }
        }, {
            xtype: 'chart',
            id: 'chart',
            title: {
                text: 'chart'
            },
            style: {
                width: '100%',
                'clear': 'left',
                height: '40%',
                display: 'none'
            }
        }]
    });

    window["termStructor"] = panel;
},2000);