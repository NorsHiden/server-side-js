const mongoose = require('mongoose');

const ExpiredTokenModel = new mongoose.Schema({
	token: {
		type: Object,
		required: true
	}
});

module.exports = mongoose.model('ExpiredToken', ExpiredTokenModel);