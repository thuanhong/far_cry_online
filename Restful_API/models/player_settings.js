const sequelize = require('../database/connect');
const Sequelize = require('sequelize');

const Settings = sequelize.define('player_setting', {
	player_id: {
		type:Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'players',
			key: 'player_id'
		},
		unique: true
	},
	system: {
		type: Sequelize.TEXT('long'),
		allowNull: true,
	},
	game: {
		type: Sequelize.TEXT('long'),
		allowNull: true,
	},
});

module.exports = Settings;