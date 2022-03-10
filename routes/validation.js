const Joi = require('joi');

const userSchema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().email().required(),
	passwd: Joi.string().min(4).required()
});

const postSchema = Joi.object({
	title: Joi.string().required(),
	author: Joi.string().required(),
	category: Joi.array().required(),
	description: Joi.string().required(),
});


module.exports = {userSchema, postSchema};