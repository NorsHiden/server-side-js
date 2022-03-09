const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	passwd: {
		type: String,
		required: true
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', UserModel);