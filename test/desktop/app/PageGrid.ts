
declare var Design;

!function() {


    var myData = [
        { company: '3m Co', price: 71.72, change: 0.02, pctChange: 0.03, lastChange: '2012/12/21' },
        { company: 'Alcoa Inc', price: 29.01, change: 0.42, pctChange: 1.47, lastChange: '2012/12/21' },
        { company: 'Altria Group Inc', price: 83.81, change: 0.28, pctChange: 0.34, lastChange: '2012/12/21' },
        { company: 'American Express Company', price: 52.55, change: 0.01, pctChange: 0.02, lastChange: '2012/12/21' },
        { company: 'American International Group, Inc.', price: 64.13, change: 0.31, pctChange: 0.49, lastChange: '2012/12/21' },
        { company: 'AT&T Inc.', price: 31.61, change: -0.48, pctChange: -1.54, lastChange: '2012/12/21' },
        { company: 'Boeing Co.', price: 75.43, change: 0.53, pctChange: 0.71, lastChange: '2012/12/21' },
        { company: 'Caterpillar Inc.', price: 67.27, change: 0.92, pctChange: 1.39, lastChange: '2012/12/21' },
        { company: 'Citigroup, Inc.', price: 49.37, change: 0.02, pctChange: 0.04, lastChange: '2012/12/21' },
        { company: 'E.I. du Pont de Nemours and Company', price: 40.48, change: 0.51, pctChange: 1.28, lastChange: '2012/12/21' },
        { company: 'Exxon Mobil Corp', price: 68.1, change: -0.43, pctChange: -0.64, lastChange: '2012/12/21' },
        { company: 'General Electric Company', price: 34.14, change: -0.08, pctChange: -0.23, lastChange: '2012/12/21' },
        { company: 'General Motors Corporation', price: 30.27, change: 1.09, pctChange: 3.74, lastChange: '2012/12/21' },
        { company: 'Hewlett-Packard Co.', price: 36.53, change: -0.03, pctChange: -0.08, lastChange: '2012/12/21' },
        { company: 'Honeywell Intl Inc', price: 38.77, change: 0.05, pctChange: 0.13, lastChange: '2012/12/21' },
        { company: 'Intel Corporation', price: 19.88, change: 0.31, pctChange: 1.58, lastChange: '2012/12/21' },
        { company: 'International Business Machines', price: 81.41, change: 0.44, pctChange: 0.54, lastChange: '2012/12/21' },
        { company: 'Johnson & Johnson', price: 64.72, change: 0.06, pctChange: 0.09, lastChange: '2012/12/21' },
        { company: 'JP Morgan & Chase & Co', price: 45.73, change: 0.07, pctChange: 0.15, lastChange: '2012/12/21' },
        { company: 'McDonald\'s Corporation', price: 36.76, change: 0.86, pctChange: 2.40, lastChange: '2012/12/21' },
        { company: 'Merck & Co., Inc.', price: 40.96, change: 0.41, pctChange: 1.01, lastChange: '2012/12/21' },
        { company: 'Microsoft Corporation', price: 25.84, change: 0.14, pctChange: 0.54, lastChange: '2012/12/21' },
        { company: 'Pfizer Inc', price: 27.96, change: 0.4, pctChange: 1.45, lastChange: '2012/12/21' },
        { company: 'The Coca-Cola Company', price: 45.07, change: 0.26, pctChange: 0.58, lastChange: '2012/12/21' },
        { company: 'The Home Depot, Inc.', price: 34.64, change: 0.35, pctChange: 1.02, lastChange: '2012/12/21' },
        { company: 'The Procter & Gamble Company', price: 61.91, change: 0.01, pctChange: 0.02, lastChange: '2012/12/21' },
        { company: 'United Technologies Corporation', price: 63.26, change: 0.55, pctChange: 0.88, lastChange: '2012/12/21' },
        { company: 'Verizon Communications', price: 35.57, change: 0.39, pctChange: 1.11, lastChange: '2012/12/21' },
        { company: 'Wal-Mart Stores, Inc.', price: 45.45, change: 0.73, pctChange: 1.63, lastChange: '2012/12/21' }
    ];

    Design.define('GridModel', {
		extend: 'Design.data.Model',
		fields: [{
			name: 'company',
			type: 'string'
		},{
			name: 'price',
			type: 'string'
		},{
			name: 'change',
			type: 'string'
		},{
			name: 'pctChange',
			type: 'string'
		},{
			name: 'lastChange',
			type: 'string'
		},]
	});

    function change(m, val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    function pctChange(m, val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '%</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }

    function lastChange(m, val) {
        return Design.dateFormat(new Date(val), "yyyy年MM月dd日");
    }

    function price(m, val) {
        if (!val) {
            return val
        }
        return "$ " + val;
    }

    Design.define('GridModel', {
		extend: 'Design.data.Model',
        requires: ['Design.data.Store'],
		fields: [{
			name: 'company',
			type: 'string'
		},{
			name: 'price',
			type: 'string'
		},{
			name: 'change',
			type: 'string'
		},{
			name: 'pctChange',
			type: 'string'
		},{
			name: 'lastChange',
			type: 'string'
		},]
	});
		
		
		
    
    setTimeout(function () { 

	    var store = Design.create('Design.data.Store', {
		    model: 'GridModel',
		    data: myData,
		    pageSize: 10
	    });

        Design.define('Design.app.PageGrid', {
            extend: 'Design.grid.Panel',
            title: {
                text: 'grid'
            },
            bodyPadding: 0,
            columnHeight: 40,
            style: {
                height: 350,
                width: 735
            },
            columns: [
                { text: 'company', width: 200, dataIndex: 'company', locked: true },
                { text: 'price', width: 125, dataIndex: 'price', locked: true, renderer: price },
                { text: 'change', width: 125, dataIndex: 'change', locked: false, renderer: change },
                { text: 'pctChange', width: 125, dataIndex: 'pctChange', locked: false, renderer: pctChange },
                { text: 'lastChange', width: 135, dataIndex: 'lastChange', locked: false, renderer: lastChange }
            ],
            store:store,
			toolbar: [{
				dock: 'bottom',
				items: [{
					xtype: 'pagination',
					store: store,
					style: {
						float: 'right'
					}
				}]
			}]
        });
    },500)
} ();