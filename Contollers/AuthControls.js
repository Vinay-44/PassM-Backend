const authModel = require('../Models/authModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
	try {
		const { username, email, password, pin, gender } = req.body;
		var avatar;

		if (!username || !email || !password || !pin || !gender) {
			return res.status(400).json({ status: false, msg: "Please Enter All Fields.." })
		}
		const checkExist = await authModel.find({ email }, { username })
		if (checkExist.length) {
			return res.status(400).json({ status: false, msg: "User already Exist with this Credentials" })
		}
		const hashPassword = await bcrypt.hash(password, 12)
		const hashPin = await bcrypt.hash(pin, 12)

		if (gender === "male") {
			avatar = "https://api.dicebear.com/5.x/micah/svg?seed=Bandit&radius=50&baseColor=77311d,ac6651,f9c9b6,transparent&hair=dougFunny,fonze,full,mrClean,mrT,pixie,turban&backgroundColor=b6e3f4"
		}
		else {
			avatar = "https://api.dicebear.com/5.x/micah/svg?seed=Salem&radius=50&eyebrows=up&hair=dougFunny,fonze,full,mrClean,mrT,pixie,turban&backgroundColor=b6e3f4"
		}
		await authModel.create({
			username,
			email,
			password: hashPassword,
			pin: hashPin,
			avatar
		})

		res.status(200).json({ status: true, msg: 'User Created Successfully!' })
	} catch (error) {
		res.status(400).json({ status: false, error })
	}
}

const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({ msg: false, msg: "Please Enter All Fields" })
		}

		const checkDoesntExist = await authModel.findOne({ username })
		if (!checkDoesntExist) {
			return res.status(400).json({ msg: false, msg: "User Doesn't Exist with this Credentials!" })
		}
		const checkPass = await bcrypt.compare(password, checkDoesntExist.password)
		if (!checkPass) {
			return res.status(400).json({ status: false, msg: 'Wrong Credentials!' })
		}
		const signJwt = jwt.sign({ userID: checkDoesntExist.id }, process.env.JWT_SECRET)
		res.cookie('token', signJwt, {
			httpOnly: true,
			sameSite: process.env.NODE_ENV == "Production" ? 'none' : 'lax',
			secure: process.env.NODE_ENV == "Production" ? 'true' : 'false'
		})
		res.status(200).json({
			status: true, msg: "Logged In..", jwt: signJwt, user: {
				username: checkDoesntExist.username,
				avatar: checkDoesntExist.avatar,
				userID: checkDoesntExist._id,
				email: checkDoesntExist.email
			}
		})
	} catch (error) {
		res.status(400).json({ status: "error", error })
	}
}

const deleteAccount = async (req, res) => {
	try {

		const { userid } = req.params;

		await authModel.findByIdAndDelete({ _id: userid })

		res.status(200).json({ status: true, msg: " Account Deleted!" })
	} catch (error) {
		res.status(400).json({ status: "error", error })
	}
}


const updateAccount = async (req, res) => {
	try {

		const { userid } = req.params;
		console.log(userid)
		let { email, username, pin, oldpin } = req.body;
		const getUser = await authModel.findById(userid);

		const compare = await bcrypt.compare(oldpin, getUser.pin)
		if (!compare) {
			return res.status(400).json({ msg: 'Wrong Old PIN.' })
		}
		if (oldpin === pin) {
			pin = getUser.pin
		}
		else {
			const hashedNewPin = await bcrypt.hash(pin, 12)
			pin = hashedNewPin
		}

		const s = await authModel.findByIdAndUpdate(userid, {
			$set: { email, username, pin }
		})
		console.log(s)
		res.status(200).json({ status: 202, msg: "Updated" })
	} catch (error) {
		res.status(400).json({ status: "error", error })
	}
}


const updatePassword = async (req, res) => {
	try {
		const { newPassword, oldPassword, confirmPassword } = req.body;
		const id = req.user
		if (!newPassword || !oldPassword || !confirmPassword) {
			return res.status(400).json({ status: false, msg: "Please Enter All Fields!" })
		}
		const checkPass = await authModel.findById(id)
		const compareOldPass = await bcrypt.compare(oldPassword, checkPass.password)
		if (!compareOldPass) {
			return res.status(401).json({ status: false, msg: "Wrong Current Password!" })
		}

		if (newPassword != confirmPassword) {
			return res.status(401).json({ status: false, msg: "New Passwords Doesn't Match!" })
		}

		const hashnewPass = await bcrypt.hash(newPassword, 12)

		await authModel.findByIdAndUpdate(id, { $set: { password: hashnewPass } })
		res.status(202).json({ status: true, msg: "Password Changed Successfully!" })
	} catch (error) {
		res.status(400).json({ status: "error", error })
	}
}


const logout = (req, res) => {
	res.clearCookie('token')
	res.status(200).json({ msg: "Logout Success!" })
}

const getMe = async (req, res) => {
	try {
		const userId = req.user;

		const getUser = await authModel.findById(userId);

		res.status(200).json({ getUser })
	} catch (error) {
		res.status(500).json({ msg: "Something Went Wrong Please Try Again Later!" })
	}

}
module.exports = {
	register,
	login,
	deleteAccount,
	updateAccount,
	updatePassword,
	logout,
	getMe
}