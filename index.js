const express = require('express');
const server = express();
const authRouter = require('./routes/auth');
const requestRouter = require('./routes/requests');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.MONGO_DB, () => {
	console.log("Connected to DB.");
});

server.use(express.json());
server.use('/api/user', authRouter);
server.use('/api/req', (req, res, next) => {
	let token = req.header("auth-token");
	if (!token) return res.status(400).json({error: "Invalid token."});
	try{
		token = jwt.verify(token, process.env.JWT_TOKEN);
		req.auth_id = token;
	}catch (err){
		return res.json({error: "Invalid token."});
	}
	next();
}, requestRouter);

server.listen(1337);