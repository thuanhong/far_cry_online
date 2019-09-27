const sequelize = require('../database/connect');
const Sequelize = require('sequelize');

const Frags = sequelize.define('match_frags', {
	frag_id: {
		type:Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	match_id: {
		type:Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'matchs',
			key: 'match_id'
		},
	},
	frag_time: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	killer_name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	victim_name: {
		type: Sequelize.STRING,
		allowNull: true
	},
	weapon_code: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

module.exports = Frags;