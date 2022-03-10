const express = require('express');
const server = express();
const authRouter = require('./routes/auth');
const requestRouter = require('./routes/requests');
const userUpdateRouter = require('./routes/userUpdate');
const postRouter = require('./routes/postArticle');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ExpiredToken = require('./models/ExpiredToken');

dotenv.config();

mongoose.connect(process.env.MONGO_DB, () => {
	console.log('Connected to DB.');
});

const checkToken = async (req, res, next) => {
	let token = req.header("auth-token");
	if (!token) return res.status(400).json({error: "Invalid token."});
	try {
		token = jwt.verify(token, process.env.JWT_TOKEN);
	} catch (err){
		return res.json({error: "Invalid token."});
	}
	if (await ExpiredToken.findOne({token: token})) return res.status(400).json({error: 'token is expired'});
	next();
}

server.use(express.json());
server.use('/api/user', authRouter);
server.use('/api/get', checkToken, requestRouter);
server.use('/api/update', checkToken, userUpdateRouter);
server.use('/api/post', checkToken, postRouter);


server.listen(1337, () => {
	console.log('Server is running.')
});