
TestCase("assertTest", {
	setUp: function () {
		
	},
	
	tearDown: function () {
		
	},
	
	"test assert": function () {
		assert("function 'assert' failures", "a" === "a");
	},
	
	"test assertTrue": function () {
		assertTrue("function 'assertTrue' failures", true);
	},
	
	"test assertFalse": function () {
		assertFalse("function 'assertFalse' failures", false);
	},
	
	"test assertEquals": function () {
		assertEquals("function 'assertEquals' failures", true, true);
	},
	
	"test assertNotEquals": function () {
		assertNotEquals("function 'assertNotEquals' failures", true, false);
	},
	
	"test assertNull": function () {
		assertNull("function 'assertNull' failures", null);
	},
	
	"test assertNotNull": function () {
		assertNotNull("function 'assertNotNull' failures", undefined);
	},
	
	"test assertUndefined": function () {
		assertUndefined("function 'assertUndefined' failures", undefined);
	},
	
	"test assertNotUndefined": function () {
		assertNotUndefined("function 'assertNotUndefined' failures", null);
	}

});
