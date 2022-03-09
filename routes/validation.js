const Joi = require ('joi');

const schema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().email().required(),
	passwd: Joi.string().required()
});

module.exports = schema;