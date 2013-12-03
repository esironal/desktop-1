
	function assert(msg, value) {
	
		if (!value) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertTrue(msg, value) {
		
		if (!(value === true)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertFalse(msg, value) {
		
		if (!(value === false)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertEquals(msg, expected, actual) {
		if (!(expected === actual)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertNotEquals(msg, expected, actual) {
		if (!(expected !== actual)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertSame(msg, expected, actual) {
		
	}
	
	function assertNotSame(msg, expected, actual) {
		
	}
	
	function assertNull(msg, value) {
		if (!(value === null)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertNotNull(msg, value) {
		if (!(value !== null)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertUndefined(msg, value) {
		if (!(value === undefined)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertNotUndefined(msg, value) {
		if (!(value !== undefined)) {
			throw new Error(msg);
		}
		
		assert.count++;
		
		return true;
	}
	
	function assertNaN(msg, number) {
		
	}
	
	function assertNotNaN(msg, number) {
		
	}
	
	function assertException(msg, callback, type) {
		
	}
	
	function assertNotException(msg, callback) {
		
	}
	
	function assertArray(msg, arrayLike) {
		
	}
	
	function assertTypeOf(msg, type, object) {
		
	}
	
	function assertBoolean(msg, value) {
		
	}
	
	function assertFunction(msg, value) {
		
	}
	
	function assertNumber(msg, value) {
		
	}
	
	function assertObject(msg, value) {
		
	}
	
	function assertString(msg, value) {
		
	}
	
	function assertMatch(msg, pattern, string) {
		
	}
	
	function assertNoMatch(msg, pattern, string) {
		
	}
	
	function assertTagName(msg, tagName, element) {
		
	}
	
	function assertClassName(msg, className, element) {
		
	}
	
	
	function assertassertElementId(msg, id, element) {
		
	}
	
	function assertInstanceOf(msg, constructor, object) {
		
	}
	
	function assertNotInstanceOf(msg, constructor, object) {
		
	}
	
	assert.count = 0;
	
	function output(text, color) {
		var p = document.createElement("p");
		p.innerHTML = text;
		p.style.color = color;
		document.body.appendChild(p);
	}