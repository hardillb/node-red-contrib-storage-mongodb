const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Library = new Schema({
	appname: String,
	type: String,
	name: String,
	meta: Schema.Types.Mixed,
	body: Schema.Types.Mixed
});

module.exports = mongoose.model('Library',Library);