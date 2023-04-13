const passModel = require('../Models/passModel')
const crypto = require('crypto-js');
const authModel = require('../Models/authModel')
const bcrypt = require('bcryptjs')
const addPassword = async (req, res) => {
	try {
		const { password, email, siteName } = req.body
		if (!password || !email || !siteName) {
			return res.status(400).json({ status: false, msg: "Please Fill All Fields!" })
		}
		const hashPassword = crypto.AES.encrypt(password, process.env.SECRET_KEY).toString()
		const save = await passModel.create({
			siteName,
			password: hashPassword,
			email,
			userID: req.user
		})
		res.status(201).json({ status: true, msg: "Password Saved!", password: save })

	} catch (error) {
		res.status(400).json({ status: 'error', error })
	}
}

const getPassword = async (req, res) => {
	try {
		const id = req.user
		const getPasswords = await passModel.find({ userID: id })

		res.status(200).json({ status: true, passwords: getPasswords })
	} catch (error) {
		res.status(400).json({ status: 'error', error })
	}
}

const deletePassword = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(id)

		await passModel.findByIdAndDelete({ _id: id })
		res.status(200).json({ status: true, msg: "Password Removed!" })
	} catch (error) {
		res.status(400).json({ status: 'error', error })
	}
}

const updatePasswordDetails = async (req, res) => {
	try {
		const { id } = req.params;
		await passModel.findByIdAndUpdate(id, { $set: req.body })

		res.status(200).json({ status: true, msg: "Password Details Updated!" })
	}
	catch (err) {
		res.status(400).json({ status: 'error', err })
	}
}
const updatePassword = async (req, res) => {
	try {
		const { id } = req.params;
		const { password } = req.body;

		const hashPassword = crypto.AES.encrypt(password, process.env.SECRET_KEY).toString()

		await passModel.findByIdAndUpdate(id, { $set: { password: hashPassword } })

		res.status(200).json({ status: true, msg: "Password Updated!" })
	}
	catch (err) {
		res.status(400).json({ status: 'error', err })
	}
}

const dcryptPassword = async (req, res) => {
	try {
		const userId = req.user
		const { pin } = req.body;
		const passwordID = req.params.id
		const findUser = await authModel.findById(userId)


		if (!pin) {
			return res.status(400).json({
				status: false,
				msg: "Please Provide PIN."
			})
		}

		const comparePin = await bcrypt.compare(pin, findUser.pin)
		if (!comparePin) {
			return res.status(400).json({
				status: false, msg: "Wrong PIN."
			})
		}

		const getPassword = await passModel.findById(passwordID)

		const dcryptPassword = crypto.AES.decrypt(getPassword.password, process.env.SECRET_KEY)
		const plainText = dcryptPassword.toString(crypto.enc.Utf8)

		res.status(200).json({ status: true, password: plainText })

	} catch (error) {
		res.status(400).json({ status: 'error', error })
	}
}

module.exports = { addPassword, getPassword, deletePassword, updatePasswordDetails, updatePassword, dcryptPassword }
