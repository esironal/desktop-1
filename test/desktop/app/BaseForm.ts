declare var Design

interface IExample3 {
    xtype?: any;
    label?: any;
    labelWidth?: any;
    fieldDefaults?: any;
    fieldStyle?: any;
    name?: any;
    width?: any;
    allowBlank?: any;
    vtype?: any;
    children?: IExample3[];
}


Design.define('Design.app.BaseForm', {
    extend: "Design.form.Form",
	style:{
		width: 400,
		height: 580
	},
	title: {
		text: 'form'
	},
	bodyPadding: 30,
	fieldDefaults: {
		labelWidth: 50,
		style:{
			width: '100%'
		}
	},
	items: <IExample3[]>[{
		xtype:'textfield',
		id: 'name',
		label:'姓名',
		allowBlank: false,
		name:'name'
	},{
		xtype:'combobox',
		label:'性别',
		displayField: 'value',
		valueField: 'id',
		allowBlank: false,
		data: [{id: 1, value: '男'}, {id: 0, value: '女'}],
		name:'holdData'
	},{
		xtype:'datefield',
		id: 'date',
		label:'日期',
		allowBlank: false,
		name:'name'
	},{
		xtype:'fieldcontainer',
		style: {
            height:30
        },
		label:'电话',
		items:<IExample3[]>[
			{xtype:'displayfield',value:'(',fieldStyle:{'padding-right':'5px'}},
			{xtype:'textfield',labelWidth:0,fieldStyle:{width:'23px'}},
			{xtype:'displayfield',value:')',fieldStyle:{'padding-left':'5px','padding-right':'5px'}},
			{xtype:'textfield',labelWidth:0,fieldStyle:{width:'30px'}},
			{xtype:'displayfield',value:'-',fieldStyle:{'padding-left':'5px','padding-right':'5px'}},
			{xtype:'textfield',labelWidth:0,fieldStyle:{width:'30px'}
		}]
	},{
		xtype:'textareafield',
		label:'备注',
		name:'name'
	},{
		xtype:'fieldset',
		title:'选填内容',
		items:<IExample3[]>[{
			xtype:'fieldcontainer',
			label:'爱好',
			labelWidth: 50,
			fieldStyle:{
				width:'100%',
				height:26
			},
			items:[{
				xtype:'radio',
				name:'color',
				fieldStyle:{
					width:70
				},
				boxLabel:'编程'
			},{
				xtype:'radio',
				name:'color',
				fieldStyle:{
					width:70
				},
				boxLabel:'游戏'
			},{
				xtype:'radio',
				name:'color',
				fieldStyle:{
					width:70
				},
				boxLabel:'泡妞'
			},]
		},{
			xtype:'textfield',
			label:'姓名',
			labelWidth: 50,
			fieldStyle:{
				width:'185'
			}
		},{
			xtype:'fieldcontainer',
			label:'宠物',
			items:[{
				xtype:'checkbox',
				boxLabel:'dog'
			},{
				xtype:'checkbox',
				boxLabel:'cat'
			}]
		}]
	}],
	buttons: [{
		text: '确定',
		handler: function() {
			var name = Design.getCmp('name');
			alert(Design.encode(this.getValues()));
			//alert('ff');
		}
	}, {
		text: '取消',
		handler: function() {
			alert('cancel');
		}
	}]
});