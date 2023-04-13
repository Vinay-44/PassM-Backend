const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
	username: {
		type: String,
		min: [3, 'Username Length too short..']
	},
	email: {
		type: String,

	},
	password: {
		type: String
	},
	pin: {
		type: String
	},
	avatar: {
		type: String
	}
}, { timestamps: true })


module.exports = mongoose.model('users', userSchema);