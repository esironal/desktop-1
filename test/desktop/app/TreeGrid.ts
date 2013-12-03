
declare var Design, myData;

!function() { 
    
	
	
	Design.define('Design.app.TreeGrid', {
        extend: 'Design.grid.Tree',
		title: {
			text: 'treeGrid'
		},
		bodyPadding: 0,
		columnHeight: 40,
		style: {
			height: 350,
			width: 600
		},
		columns: [
			{text: 'task', width: 200, dataIndex: 'task', locked: true, treeColumn: true}, 
			{text: 'duration', width: 125, dataIndex: 'duration'},
			{text: 'user', width: 125, dataIndex: 'user'}
		],
		data:myData
	});
		
} ();