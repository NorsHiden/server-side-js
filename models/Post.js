const mongoose = require('mongoose');

const PostModel = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	category: {
		type: Array,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	updatedDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Post', PostModel);