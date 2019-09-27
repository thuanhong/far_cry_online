const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connect = require('./database/connect');
const matchRoute = require('./route/match');
const playerRoute = require('./route/player');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend : true}));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use('/api/match', matchRoute);
app.use('/api/player', playerRoute);

connect.sync()
	.then(() => {
		app.listen(process.env.PORT || 8080, () => {
			console.log('Server running at localhost:8080');
		});
	})
	.catch(error => {
		console.log(error);
	});