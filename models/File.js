var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
    name: { type: String },
    parent_id: { type: String },
    filePath: { type: String },
    type: { type: String },
    user_id: { type: String }
});

mongoose.model('File', FileSchema);
module.exports = mongoose.model("File");
