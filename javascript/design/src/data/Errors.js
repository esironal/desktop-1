

	Design.define('Design.data.Errors', {
		extend: 'Design.util.HashMap',
		
		isValid: function() {
			return this.length === 0;
		},
		getByField: function(fieldName) {
			var errors = [],
				error, field, i;

			for (i = 0; i < this.length; i++) {
				error = this.items[i];

				if (error.field == fieldName) {
					errors.push(error);
				}
			}

			return errors;
		}
	});