
TestCase("assertTest", {
	setUp: function () {
	},
	
	tearDown: function () {
		
	},
	
	"test encode JSON": function () {
		
		var json = {a: 1, b: 2};
		var jsonStr = Design.encode(json);
		assert("function 'assert' failures", jsonStr === '{"a": "1", "b": "2"}');
	},
	
	"test encode Array JSON": function () {
		
		var json = [{a: 1, b: 2},{a: 3, b: 5}];
		
		var jsonStr = Design.encode(json);
		//alert(jsonStr);
		assert("function 'assert' failures", jsonStr === '[{"a": "1", "b": "2"}, {"a": "3", "b": "5"}]');
	},
	
	"test namespace": function () {
		Design.namespace("Design.panel.Panel");
		Design.panel.Panel.name = "panel";
		assert("function 'assert' failures", Design.ns("Design.panel.Panel.name") === "panel");
	},
	
	"test getObject": function () {
		Design.namespace("Design.panel.Panel");
		Design.panel.Panel.name2 = "panel";
		assert("function 'assert' failures", Design.getObject("Design.panel.Panel.name2") === "panel");
	},
	
	"test getPaddingMap": function() {
		var paddings = Design.getPaddingMap(10);
		
		assert("1", paddings.left == 10);
		assert("2", paddings.right == 10);
		assert("3", paddings.top == 10);
		assert("4", paddings.bottom == 10);
		
		
		paddings = Design.getPaddingMap("10 20");
		
		assert("5", paddings.left == 20);
		assert("6", paddings.right == 20);
		assert("7", paddings.top == 10);
		assert("8", paddings.bottom == 10);
		
		paddings = Design.getPaddingMap("10 20 30");
		
		assert("9", paddings.left == 20);
		assert("10", paddings.right == 20);
		assert("11", paddings.top == 10);
		assert("12", paddings.bottom == 30);
		
		
		paddings = Design.getPaddingMap("10 20 30 40");

		assert("13", paddings.left === 40);
		assert("14", paddings.right === 20);
		assert("15", paddings.top === 10);
		assert("16", paddings.bottom === 30);
		
		paddings = Design.getPaddingMap("10");
		
		assert("17", paddings.left == 10);
		assert("18", paddings.right == 10);
		assert("19", paddings.top == 10);
		assert("20", paddings.bottom == 10);
	}

});
