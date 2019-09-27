const sequelize = require('../database/connect');
const Sequelize = require('sequelize');

const Tokens = sequelize.define('tokens', {
	player_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'players',
			key: 'player_id'
		},
		unique: true,
	},
	token: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Tokens;