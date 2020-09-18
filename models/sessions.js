const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Sessions = new Schema({
	appname: String,
	sessions: Schema.Types.Mixed
});

module.exports = mongoose.model('Sessions',Sessions);