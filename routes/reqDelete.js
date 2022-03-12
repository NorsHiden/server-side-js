const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

router.delete('/post/:id', async (req, res) => {
	const token = jwt.decode(req.header('auth-token'));
	const user = await User.findOne({_id: token._id});
	const post = await Post.findOne({_id: req.params.id});
	if (!post) return res.status(404).json({error: "post not found."});
	if (user.username != post.author) return res.status(404).json({error: "permission denied."});
	const deletedPost = await Post.deleteOne({_id: req.params.id});
	res.json(post);
});

module.exports = router;