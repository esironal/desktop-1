Design.define('Design.chart.Chart', {
	extend: 'Design.panel.Panel',
	alias: 'widget.chart',
	//type: 'line',
	initialize: function(cfg) {
		Design.chart.Chart.superclass.initialize.call(this,cfg);
	},
	setData: function(linemaps) {
		this.createLineChart(linemaps,this.bodyEl.id);
	},
	setLineChart: function(linemaps) {
		this.createLineChart(linemaps,this.bodyEl.id);
	},
	setPieChart: function(data, title) {
		this.createPieChart(data, title, this.bodyEl.id);
	},
	afterRender: function() {
		var that = this;
			if (that.type == 'pie') {
				that.createPieChart(that.data, "", that.bodyEl.id);
			}
			if (that.type == 'line') {
				that.createPieChart(that.data, "", that.bodyEl.id);
			}
		
	},
	createPieChart: function (data,title,render){
		new Highcharts.Chart({
			chart: {
				renderTo: render,
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false
			},
			title: {
				text: title
			},
			tooltip: {
				formatter: function() {
					return '<b>'+ this.point.name +':'+Highcharts.numberFormat(this.point.y, 0,',')+'</b>: '+ 
						'占比'+Highcharts.numberFormat(this.percentage, 0) +' %';
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						color: '#000000',
						connectorColor: '#000000',
						formatter: function() {
							return '<b>'+ this.point.name +'</b>: ';
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: 'Browser share',
				data: data
			}]
		});
	},
	
	createLineChart: function(data,render) {
		Highcharts.StockChart({
			chart: {
				renderTo: render
			},
			
			rangeSelector: {
				selected: 100,
				inputDateFormat:'%Y年%m月',
				buttonSpacing : 2,
				buttons: []
			},

			navigator:{
				xAxis: {
					tickPixelInterval: 200,
					labels: {
						formatter: function() {
							return Highcharts.dateFormat('%Y', this.value)
						}
					}
				}
			},
			scrollbar:{
					enabled:false
			},
			yAxis: {
				labels: {
					formatter: function() {
						//return (this.value > 0 ? '+' : '') + this.value + '%';
						return Highcharts.numberFormat(this.value, 0, ',')
					}
				},
				plotLines: [{
					value: 0,
					width: 2,
					color: 'silver'
				}]
			},
			xAxis: {
				labels: {
					formatter: function(a) {
						return Highcharts.dateFormat('%Y-%m', this.value)
					}
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: 'silver'
				}]
			},
			plotOptions: {
				series: {
							//compare: 'percent'
				}
			},
			
			title : {
				text : ' '
			},
			tooltip: {
				pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>',
				xDateFormat:'%Y年%m月' 
			},

			series : data
		});
	}
});