var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppSchema = new Schema({
    name: { type: String },
    types: { type: Array }
});

mongoose.model('AppSchema', FileSchema);
module.exports = mongoose.model("AppSchema");