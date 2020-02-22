const jwt = require('jsonwebtoken')
let dotenv = require('dotenv')
dotenv.config()

module.exports = function(req, res, next) {
  const token = req.headers.authorization || req.headers['authorization']

  if (!token) {
    return res.status(401).send({
      message: 'No token present'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user._id = decoded._id
    next()
  } catch (error) {
    res.status(400).send({
      message: 'Invalid token'
    })
  }
}
