const sequelize = require('../database/connect');
const Sequelize = require('sequelize');

const Matchs = sequelize.define('matchs', {
	match_id: {
		type:Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	start_time: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	end_time: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	game_mode: {
		type: Sequelize.STRING,
		allowNull: false
	},
	map_name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Matchs;