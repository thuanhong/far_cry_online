const Match = require('../models/matchs');
const Frags = require('../models/match_frags');

exports.postMatch = (req, res) => {
	let st_time = req.body.start_time;
	let mode = req.body.game_mode;
	let map = req.body.map_name;
	Match.create({
		start_time: st_time,
		game_mode: mode,
		map_name: map
	}).then(result => {
		res.status(200).send({
			message: 'Successfully',
			statusCode: 200,
			record: result.dataValues
		})
	}).catch(error => {
		res.status(400).send({
			message:'Error',
			statusCode: 400,
			error_detail: error
		})
	});
};

exports.postFrags = (req, res) => {
	let id = req.body.match_id;
	let time = req.body.frag_time;
	let killer = req.body.killer_name;
	let victim = req.body.victim_name;
	let weapon = req.body.weapon_code;
	Frags.create({
		match_id: id,
		frag_time: time,
		killer_name: killer,
		victim_name: victim,
		weapon_code: weapon
	}).then(result => {
		res.status(200).send({
			message: 'Successfully',
			statusCode: 200,
			frags: result.dataValues
		})
	}).catch(error => {
		res.status(400).send({
			message:'Error',
			statusCode: 400,
			error_detail: error
		})
	});
};

exports.postEndTime = (req, res) => {
    let time = req.body.end_time;
    let matchID = req.params.matchID;
    Match.findByPk(matchID)
        .then(result => {
            result.end_time = time;
            result.save().then(() => {
                console.log("SUCCESSFULLY")
            });
            res.status(200).send({
                message: "Successfully",
                statusCode: 200,
            })
        })
        .catch(error => {
            console.error(error)
        });
};