	
	
	Design.define('Design.form.field.VTypes', (function(){
		// closure these in so they are only created once.
		var alpha = /^[a-zA-Z_]+$/,
			alphanum = /^[a-zA-Z0-9_]+$/,
			number = /^[0-9_]+$/,
            decimals = /^[0-9]+(\.[0-9]+)?$/,
			email = /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
			url = /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
		 
		return {
			singleton: true,
			alternateClassName: 'Design.form.VTypes',
			'email' : function(v){
				return email.test(v);
			},
			'emailText' : '不是有效的电子邮件地址, 格式为： "user@example.com"',
			'emailMask' : /[a-z0-9_\.\-@\+]/i,
			'url' : function(v){
				return url.test(v);
			},
			'urlText' : 'This field should be a URL in the format "http:/'+'/www.example.com"',
			'alpha' : function(v){
				return alpha.test(v);
			},
			'numberText' : '只允许输入数字',
			'number' : function(v){
				return number.test(v);
			},
            'decimalsText' : '',
            'decimals': function(v) {
                return decimals.test(v);
            },
			'alphaText' : '只允许输入字母和 _',
			'alphaMask' : /[a-z_]/i,
			'alphanum' : function(v){
				return alphanum.test(v);
			},
			'alphanumText' : '只允许输入字母和数字和 _',
			'alphanumMask' : /[a-z0-9_]/i
		};
	})());