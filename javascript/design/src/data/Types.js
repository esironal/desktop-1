
		
	Design.define('Design.data.Types', {
		singleton: true,
		requires: ['Design.data.SortTypes']
	}, function() {
		var st = Design.data.SortTypes;

		Ext.apply(Design.data.Types, {
			stripRe: /[\$,%]/g,

			AUTO: {
				sortType: st.none,
				type: 'auto'
			},

			STRING: {
				convert: function(v) {
					var defaultValue = this.useNull ? null : '';
					return (v === undefined || v === null) ? defaultValue : String(v);
				},
				sortType: st.asUCString,
				type: 'string'
			},

			INT: {
				convert: function(v) {
					return v !== undefined && v !== null && v !== '' ?
						parseInt(String(v).replace(Design.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
				},
				sortType: st.none,
				type: 'int'
			},

			FLOAT: {
				convert: function(v) {
					return v !== undefined && v !== null && v !== '' ?
						parseFloat(String(v).replace(Design.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
				},
				sortType: st.none,
				type: 'float'
			},

			BOOL: {
				convert: function(v) {
					if (this.useNull && (v === undefined || v === null || v === '')) {
						return null;
					}
					return v === true || v === 'true' || v == 1;
				},
				sortType: st.none,
				type: 'bool'
			},

			DATE: {
				convert: function(v) {
					var df = this.dateFormat,
						parsed;

					if (!v) {
						return null;
					}
					if (Ext.isDate(v)) {
						return v;
					}
					if (df) {
						if (df == 'timestamp') {
							return new Date(v*1000);
						}
						if (df == 'time') {
							return new Date(parseInt(v, 10));
						}
						return Design.Date.parse(v, df);
					}

					parsed = Date.parse(v);
					return parsed ? new Date(parsed) : null;
				},
				sortType: st.asDate,
				type: 'date'
			}
		});

		Ext.apply(Design.data.Types, {
			BOOLEAN: this.BOOL,
			INTEGER: this.INT,
			NUMBER: this.FLOAT
		});
	});