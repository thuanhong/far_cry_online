const sequelize = require('../database/connect');
const Sequelize = require('sequelize');

const Player = sequelize.define('players', {
	player_id: {
		type:Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	player_name: {
		type:Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	emailVerified: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
});

module.exports = Player;
