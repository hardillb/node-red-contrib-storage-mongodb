const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Settings = new Schema({
	appname: String,
	settings: Schema.Types.Mixed
});

module.exports = mongoose.model('Settings',Settings);