const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { userSchema } = require('./validation');
const bcrypt = require('bcrypt');

const passwdUpdate = async (passwd, user) => {
	if (!passwd) return user.passwd;
	const salt = await bcrypt.genSalt(10);
	const newHashedPasswd = await bcrypt.hash(passwd, salt);
	return newHashedPasswd;
}

router.put('/user', async (req, res) => {
	const token = jwt.decode(req.header('auth-token'));
	const user = await User.findOne({_id: token._id});
	const validated = userSchema.validate({
		username: req.body.username || user.username,
		email: req.body.email || user.email,
		passwd: req.body.passwd || user.passwd
	});
	if (validated.error) return res.status(400).json(validated.error);
	const updatedUser = await User.findOneAndReplace({_id: token._id}, {
		username: req.body.username || user.username,
		email: req.body.email || user.email,
		passwd: await passwdUpdate(req.body.passwd, user)
	});
	await updatedUser.save();
	res.json({
		_id: user._id,
		username: req.body.username || user.username,
		email: req.body.email || user.email,
		createdDate: user.createdDate
	});
});


module.exports = router;