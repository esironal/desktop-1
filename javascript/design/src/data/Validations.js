	
	Design.define('Design.data.Validations', {
		singleton: true,
		presenceMsg: 'must be present',
		lengthMsg: 'is the wrong length',
		allowBlankMsg: '不允许为空',
		formatMsg: 'is the wrong format',
		inclusionMsg: 'is not included in the list of acceptable values',
		exclusionMsg: 'is not an acceptable value',
		emailMsg: '不是有效的电子邮件地址',
		emailRe: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		
		validate: function(config, value) {
			var isValid = true;
			if (!this.allowBlank(config, value)) {
				isValid = this.allowBlankMsg;
			}
			else if ((config.min || config.max) && !this.length(config, value)) {
				isValid = this.lengthMsg;
			}
			else if (config.matcher && !this.format(config, value)) {
				isValid = this.formatMsg;
				if (config.matcherMsg) {
					isValid = config.matcherMsg;
				}
			}
			return isValid;
		},
		presence: function(config, value) {
			if (value === undefined) {
				value = config;
			}
			
			//we need an additional check for zero here because zero is an acceptable form of present data
			return !!value || value === 0;
		},
		allowBlank: function(config, value) {
			if (config.allowBlank === false && (value === undefined || value === null ||value == '')) {
				return false;
			}
			return true;
		},
		length: function(config, value) {
			if (value === undefined || value === null) {
				return false;
			}
			
			var length = value.length,
				min    = config.min,
				max    = config.max;
			
			if ((min && length < min) || (max && length > max)) {
				return false;
			} else {
				return true;
			}
		},
		email: function(config, email) {
			return Design.data.validations.emailRe.test(email);
		},
		format: function(config, value) {
			return !!(config.matcher && config.matcher.test(value));
		},
		inclusion: function(config, value) {
			//return config.list && Ext.Array.indexOf(config.list,value) != -1;
		},
		exclusion: function(config, value) {
			//return config.list && Ext.Array.indexOf(config.list,value) == -1;
		}
	});