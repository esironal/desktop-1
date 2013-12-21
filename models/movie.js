
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    title: { type: String },
    original_title: { type: String },
    rating: { type: Number },
    hits: { type: Number },
    subtype: { type: Array },
    directors: { type: Array },
    casts: { type: Array },
    tags: { type: Array },
    pubdates: { type: Date },
    genres: { type: Array },
    countries: { type: Array },
    summary: { type: String },
    poster: { type: String },
    language: { type: String },
    data_create: { type: Date, default: Date.now },
    data_update: { type: Date },
    last_update: { type: Date },
    douban_id: { type: String },
    search_url: { type: String },
    online: { type: Object }
});

mongoose.model('Movie', MovieSchema);
module.exports = mongoose.model("Movie");
