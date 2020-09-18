const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Credentials = new Schema({
	appname: String,
	credentials: String
});

module.exports = mongoose.model('Credentials',Credentials);