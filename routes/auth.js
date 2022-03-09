const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const ExpiredToken = require('../models/ExpiredToken');
const validSchema = require('./validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
	const validated = validSchema.validate({
		username: req.body.username,
		email: req.body.email,
		passwd: req.body.passwd
	});
	if (validated.error) return res.status(400).json(validated.error);
	if (await User.findOne({username: req.body.username, email: req.body.email}))
		return res.status(400).json({error: "user already exists"});
	const salt = await bcrypt.genSalt(10);
	const HashedPasswd = await bcrypt.hash(req.body.passwd, salt);
	const newUser = User({
		username: req.body.username,
		email: req.body.email,
		passwd: HashedPasswd
	});
	try {
		await newUser.save();
		res.status(200).json({username: req.body.username, email: req.body.email});
	} catch(err){
		res.status(500).json(err);
	}
});

router.post('/login', async (req, res) => {
	const account = await User.findOne({
		username: req.body.username,
		 email: req.body.email
	});
	if (!account) return res.status(400).json({error:"invalid email or password."});
	if (!req.body.passwd) return res.status(400).json({error:"invalid email or password."});
	const validPasswd = await bcrypt.compare(req.body.passwd, account.passwd);
	if (!validPasswd) return res.status(400).json({error:"invalid email or password."});
	genToken = jwt.sign({_id:account._id}, process.env.JWT_TOKEN, {expiresIn: '30d'});
	res.header({"auth-token": genToken});
	account.auth_token = genToken;
	res.json({
		_id: account._id,
		username: account.username,
		email: account.email,
		auth_token: genToken,
		createdDate: account.createdDate});
});

router.post('/logout', async (req, res) => {
	const token = req.header("auth-token");
	if (!token) return res.status(400).json({error: 'user not logged in.'});
	let validToken = 0
	try{
		validToken = jwt.verify(token, process.env.JWT_TOKEN);
	} catch (err) {
		return res.status(400).json({error: err.message});
	}
	if (!validToken) return res.status(400).json({error: 'invalid token'});
	if (await ExpiredToken.findOne({token: validToken})) return res.status(400).json({error: 'token is already blacklisted'});
	const expiredToken = ExpiredToken({
		token: validToken
	});
	try {
		await expiredToken.save();
	}catch (err){
		return res.json(err);
	}
	res.json(expiredToken);
})

module.exports = router;