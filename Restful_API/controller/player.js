const Player = require('../models/players');
const Setting = require('../models/player_settings');
const Op = require('sequelize').Op;
const Tokens = require('../models/tokens');
const fetch = require('node-fetch');
require('dotenv').config();
var access_token = '';


function checkToken(emailTarget, player_id, token) {
	fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`, {
		method: 'get'
	})
		.then(result => {
			if (result.status !== 200) {
				fetch(`https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${process.env.REFRESH_TOKEN}`, {
					method: 'post'
				})
					.then(res => res.json())
					.then(json => {
						access_token = json.access_token
						sendVerifyMail(emailTarget, player_id, token)
					});
			} else {
				sendVerifyMail(emailTarget, player_id, token)
			}
		})
		.catch(error => {
			console.log(error)
		})
}


async function sendVerifyMail(emailTarget, player_id, token) {
	let messageParts = [
		'From: Far Cry Online <thuanhong357@gmail.com>',
		`To: Player <${emailTarget}>`,
		'Content-Type: text/html; charset=utf-8',
		'MIME-Version: 1.0',
		'Subject: Welcome to Far Cry',
		'',
		'Please click link below to activate your account',
		`Link : <a href="https://dry-eyrie-39715.herokuapp.com/api/player/verification/?playerID=${player_id}&token=${token}">Verification your account</a>`,
	];

	const body = { raw: require('js-base64').Base64.encodeURI(messageParts.join('\n')) };

	fetch(`https://www.googleapis.com/gmail/v1/users/${process.env.MAIL}/messages/send?key=${process.env.API_KEY}`, {
		method: 'post',
		body:    JSON.stringify(body),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access_token}`
		},
	})
		.then(res => res.json())
		.then(json => console.log(json));
}

exports.getPlayer = (req, res) => {
	let query = {where: req.query.name ? {player_name:req.query.name} : {email:req.query.email}};
	Player.findOne(query)
		.then(result => {
			if (!result) {
				res.status(200).send({
					message: "The username wasn't used"
				});
			} else {
				throw `${Object.values(query.where)} was be used`;
			}
		})
		.catch(error => {
			res.status(400).send({
				message: error
			})
		});
};


exports.createPlayer = (req, res) => {
	let name = req.body.username;
	let pass = req.body.password;
	let email = req.body.email;
	Player.create({
		player_name:name,
		password: pass,
		email: email
	}).then(result => {
		Tokens.create({
			player_id: result.dataValues.player_id,
			token: result.dataValues.password.slice(7, 47)
		});
		Setting.create({
			player_id: result.dataValues.player_id
		});
		checkToken(email, result.dataValues.player_id, result.dataValues.password.slice(7, 47));
		res.status(200).send({
			message: "Successfully",
			statusCode: 200,
			respond: result
		})
	}).catch(error => {
		res.status(400).send({
			message: 'Error',
			statusCode: 400,
			error_detail: error.errors
		})
	});
};


exports.getVerify = (req, res) => {
	let id = req.query.playerID;
	let token = req.query.token;
	Tokens.findOne({where: {player_id: id, token: token}})
		.then(result => {
			if (!result) {
				throw "Fail"
			} else {
				Player.findByPk(id)
					.then(player => {
						player.emailVerified = true;
						player.save().then(() => {
							console.log("SUCCESSFULLY")
						});
					})
					.catch(console.error);
				res.send("Successful, your account was be activated");
			}
		})
		.catch(error => {
			res.send(error);
		});
};


exports.checkLogIn = (req, res) => {
	let name = req.body.user;
	Player.findOne({where: {[Op.or]:[{player_name:name}, {email:name}]}})
		.then(result => {
			if (!result) {
				throw "Username or email not found"
			} else if (!result.emailVerified) {
				throw "Your account haven't been activated, please log in to your mail and activate it"
			}
			res.status(200).send({
				message: "Successfully",
				statusCode: 200,
				result: result
			})
		})
		.catch(error => {
			res.status(400).send({
				message: error,
				statusCode: 400,
			})
		});
};


exports.getSettingOfPlayer = (req, res) => {
	let player_id = req.params.playerID;
	Setting.findOne({where: {player_id:player_id}})
		.then(result => {
			res.status(200).send({
				message: "Successfully",
				statusCode: 200,
				result: result.dataValues,
			})
		})
		.catch(error => {
			res.status(400).send({
				message: "Bad request",
				statusCode: 400
			})
		});
};


exports.postSettingOfPlayer = (req, res, next) => {
	let player_id = req.params.playerID;
	let system = req.body.system;
	let game = req.body.game;
	Setting.findOne({where : {player_id:player_id}})
		.then(result => {
			result.system = system;
			result.game = game;
			result.save().then(() => {
				console.log("SUCCESSFULLY")
			});
			res.status(200).send({
				message: "Successfully",
				statusCode: 200,
			})
		}).catch(error => {
			res.status(400).send({
				message: "Error",
				statusCode: 400,
				error: error
			})
		});
};