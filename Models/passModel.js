const mongoose = require('mongoose');

const passModel = new mongoose.Schema({
	siteName: {
		type: String
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	userID: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
}, { timestamps: true })

module.exports = mongoose.model('passwords', passModel)