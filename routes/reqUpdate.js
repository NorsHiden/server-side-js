const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const { userSchema, postSchema } = require('./validation');
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
	if (validated.error) return res.status(400).json({error: validated.error});
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

router.put('/post/:id', async (req, res) => {
	const token = jwt.decode(req.header('auth-token'));
	const user = await User.findOne({_id: token._id});
	const post = await Post.findOne({_id: req.params.id});
	if (!post) return res.status(404).json({error: "post not found."});
	if (user.username != post.author) return res.status(404).json({error: "permission denied."});
	const validated = postSchema.validate({
		title: req.body.title,
		author: user.username,
		category: req.body.category,
		description: req.body.description
	});
	if (validated.error) return res.status(400).json({error: validated.error});
	const updatedPost = await Post.findOneAndReplace({_id: req.params.id}, {
		title: req.body.title,
		author: user.username,
		category: req.body.category,
		description: req.body.description,
		updatedDate: Date.now
	});
	await updatedPost.save();
	res.json({
		title: req.body.title,
		author: user.username,
		category: req.body.category,
		description: req.body.description,
	});
});


module.exports = router;