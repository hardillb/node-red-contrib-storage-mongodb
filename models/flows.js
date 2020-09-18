const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Flow = new Schema({
	appname: String,
	flow: Schema.Types.Mixed
});

module.exports = mongoose.model('Flow',Flow);