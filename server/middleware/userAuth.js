const User      = require('../models/user')

//*****************************************************************************
// express middleware for checking authentication
//*****************************************************************************
const middleware = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '')
		const decoded = await User.verifyAuthToken(token)
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

		 if (!user) {
			  throw new Error()
		 }

		 req.token = token
		 req.user = user
		 next()
	} catch (e) {
		 res.status(401).json({ error: 401, message:'Unauthorized.' })
	}
}
module.exports = middleware;