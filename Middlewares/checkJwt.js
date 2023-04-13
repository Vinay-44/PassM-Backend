const jwt = require('jsonwebtoken');

const jwtCheck = async (req, res, next) => {
	try {
		const user = jwt.verify(req.cookies.token || req.body.jwt || req.headers.authorization, process.env.JWT_SECRET)
		req.user = user.userID
		next()

	} catch (error) {
		return res.status(400).json({ status: 'error', error: 'Session Expired Please Login Again!' })
	}
}

module.exports = { jwtCheck }