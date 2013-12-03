var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String, unique: true },
    loginname: { type: String, unique: true },
    password: { type: String },
    name: { type: String},
    surname: { type: String}
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model("User");