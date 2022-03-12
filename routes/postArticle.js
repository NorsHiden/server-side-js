const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const { postSchema } = require('./validation');

router.post('/article', async (req, res) => {
	const token = jwt.decode(req.header('auth-token')); 
	const user = await User.findOne({_id: token._id});
	const validated = postSchema.validate({
		title: req.body.title,
		author: user.username,
		category: req.body.category,
		description: req.body.description,
	});
	if (validated.error) return res.status(400).json({error: validated.error});
	if ((await Post.findOne({title: req.body.title, author: user.username})))
		return res.status(400).json({error: 'Article already exists'});
	const newPost = new Post({
		title: req.body.title,
		author: user.username,
		category: req.body.category,
		description: req.body.description,
		updatedDate: Date.now
	});
	await newPost.save();
	res.json(newPost);
});

module.exports = router;