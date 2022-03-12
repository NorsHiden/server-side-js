const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/users', async (req, res) => {
	let usersArray = await User.find({});
	let users = [];
	for (i in usersArray){
		users.push({
			_id: usersArray[i]._id,
			username : usersArray[i].username,
			email: usersArray[i].email,
			createdDate: usersArray[i].createdDate
		})
	}
	res.json(users);
});

router.get('/user', async (req, res) => {
	if (!req.query.username) return res.json({error: "no username"});
	const user = await User.findOne({username: req.query.username});
	if (!user) return res.json({error: "no such user"});
	res.json({
		_id: user._id,
		username: user.username,
		email: user.email,
		createdDate: user.createdDate
	});
});

router.get('/:username/posts', async (req, res) => {
	let posts = await Post.find({author: req.params.username});
	res.json(posts);
});

module.exports = router;