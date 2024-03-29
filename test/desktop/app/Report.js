﻿setTimeout(function () {
    var baseDate = new Date(), selectModels = [], monthList = [], editor, store, panel, chartType = 0;

    for (var i = 0; i < 60; i++) {
        monthList.push('b' + (i));
    }

    function parseReportNumber(number) {
        var value = parseFloat(number + "".replace(/,/g, ''));
        if (value < 0) {
            value = 0;
        }

        return value;
    }

    function setInfoGrid(models) {
        var cell = grid.targetCell, model = models[0], columns = [], datas = [];

        if (chartType == 2) {
            columns = [{ dataIndex: 'date', width: 150, text: '日期' }, { dataIndex: 'value', width: 150, text: '值', align: 'right' }];
            grid.columns.forEach(function (column) {
                var json = {};
                if (column.locked) {
                    //json.value = model.get(column.dataIndex)
                } else {
                    datas.push({ value: model.get(column.dataIndex), date: column.text });
                }
            });
        } else if (chartType == 1 && cell && Design.getCmp(cell.id)) {
            cell = Design.getCmp(cell.id);
            columns = [{ dataIndex: 'date', width: 150, text: '名称' }, { dataIndex: 'value', width: 150, text: '值', align: 'right' }];
            (cell.model.get('children') || []).forEach(function (item) {
                datas.push({ value: item.get(cell.column.dataIndex), date: item.get('itemname') });
            });
        }
        chartInfoGrid.bindStore(datas, columns);
    }

    function showPieChart(models, tid) {
        var cell = grid.targetCell, values = [], count = 0;

        if (!models.length)
            return;

        if (chartType == 2) {
            var name = "", values = [];
            grid.columns.forEach(function (column) {
                if (!column.locked) {
                    if (parseReportNumber(models[0].get(column.dataIndex)))
                        ;
                    values.push([column.text, parseReportNumber(models[0].get(column.dataIndex))]);
                } else {
                    name = models[0].get(column.dataIndex);
                }
            });

            pieChart.setPieChart(values, name);
        } else if (chartType == 1 && cell && Design.getCmp(cell.id)) {
            cell = Design.getCmp(cell.id);
            (cell.model.get('children') || []).forEach(function (model) {
                var value = parseInt(model.get(cell.column.dataIndex) || 0);
                values.push([model.get('name'), value]);
            });
            pieChart.setPieChart(values, cell.model.get('name'));
        }
    }

    function showLineChart(models) {
        var linemaps = [];
        models.forEach(function (model) {
            var values = [];
            var name = model.get('name');
            var beforeValue = 0;

            //beforeValue = parseInt(model.get('baseValue')|| 0)
            //values.push([baseDate.getTime(), beforeValue] );
            monthList.forEach(function (month, i) {
                if (model.get(month)) {
                    beforeValue = parseInt(model.get(month) || 0);
                }
                values.push([Design.addMonths(baseDate, i + 1).getTime(), beforeValue]);
            });

            linemaps.push({
                name: name,
                data: values,
                tooltip: {
                    yDecimals: 0
                }
            });
        });
        if (models.length)
            lineChart.setData(linemaps);
    }

    function getCollstByMonths(months, type) {
        var addMonth = 0;
        var manyColumns = [];
        for (var i = 0; i < months.length / 12 / type; i++) {
            var columns = [
                {
                    text: '名称',
                    width: 300,
                    locked: true,
                    treeColumn: true,
                    dataIndex: 'itemname'
                }
            ];

            for (var j = 0; j < 12; j++) {
                addMonth += type - 1;
                if (months[i * 12 + j + addMonth]) {
                    columns.push({
                        text: '第' + (i * 12 + j + 1 + addMonth) + '月',
                        width: 120,
                        align: 'right',
                        dataIndex: 'b' + (i * 12 + j + addMonth)
                    });
                }
            }
            manyColumns.push(columns);
        }
        return manyColumns;
    }

    var grid = Design.widget('treepanel', {
        xtype: 'treepanel',
        manyColumns: getCollstByMonths(monthList, 1),
        onItemSelect: function (models, event) {
            selectModels = models;
            if (lineChart.isShow()) {
                showLineChart(selectModels);
                setInfoGrid(selectModels);
            } else if (pieChart.isShow()) {
                showPieChart(selectModels, event);
                setInfoGrid(selectModels);
            }
        },
        data: jsonData,
        stripeRows: true,
        toolbar: [
            {
                dock: 'top',
                items: [
                    {
                        xtype: 'radiogroup',
                        events: {
                            'change input': 'change'
                        },
                        bodyStyle: {
                            width: '420'
                        },
                        change: function (e) {
                            var items = panel.getItems();

                            var value = $(e.target).val();
                            chartType = value;
                            if (value == 0) {
                                lineChart.hide();
                                piePanel.hide();
                                grid.resize('100%', '100%');
                                return;
                            } else if (value == 1) {
                                piePanel.show();
                                lineChart.hide();
                                grid.resize('70%', '100%');
                                showPieChart(selectModels);
                                setInfoGrid(selectModels);
                            } else if (value == 2) {
                                piePanel.show();
                                lineChart.hide();
                                grid.resize('70%', '100%');
                                showPieChart(selectModels);
                                setInfoGrid(selectModels);
                            } else if (value == 3) {
                                grid.resize('100%', '60%');
                                piePanel.hide();
                                lineChart.show();

                                //showChart(selectModels);
                                showLineChart(selectModels);
                            }
                        },
                        style: {
                            float: 'left'
                        },
                        items: [
                            { boxLabel: '隐藏图表', value: '0', name: 'showType', checked: true },
                            { boxLabel: '子级占比', name: 'showType', value: '1' },
                            { boxLabel: '横向占比', value: '2', name: 'showType' },
                            { boxLabel: '趋势图', value: '3', name: 'showType' }
                        ]
                    }
                ]
            },
            {
                dock: 'bottom',
                items: [
                    {
                        style: {
                            'float': 'right'
                        },
                        manyColumns: getCollstByMonths(monthList, 1),
                        store: store,
                        xtype: 'pagination'
                    }
                ]
            }
        ],
        style: {
            width: '100%',
            height: '100%',
            'float': 'left'
        }
    });

    var lineChart = Design.widget('chart', {
        xtype: 'chart',
        style: {
            width: '100%',
            'clear': 'left',
            height: '40%',
            display: 'none'
        }
    });
    var pieChart = Design.widget('chart', {
        html: 'pie',
        style: {
            width: '100%',
            'float': 'left',
            height: '50%'
        }
    });

    var chartInfoGrid = Design.widget('treepanel', {
        html: 'grid',
        columns: [],
        data: [],
        style: {
            width: '100%',
            'float': 'left',
            height: '50%'
        }
    });

    var piePanel = Design.widget('panel', {
        style: {
            width: '30%',
            'float': 'left',
            height: '100%',
            display: 'none'
        },
        items: [pieChart, chartInfoGrid]
    });

    panel = Design.widget('panel', {
        style: {
            width: 1200,
            height: 700
        },
        drag: true,
        title: {
            text: 'report'
        },
        items: [grid, piePanel, lineChart]
    });
    window["report"] = panel;
}, 2000);
