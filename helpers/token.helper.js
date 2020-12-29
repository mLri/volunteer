const jwt = require('jsonwebtoken')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports.checkAuth = (req, res, next) => {
  try {

    const auth_token = req.headers['authorization']
    if (!auth_token) throw statusError.unauthorized

    const split_auth_token = auth_token.split(' ')
    const bearer = split_auth_token[0]
    const token = split_auth_token[1]

    if (!bearer || bearer !== 'Bearer') throw statusError.forbidden

    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    next()
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createAccessToken = (payload, scope = 'admin') => {
  return jwt.sign({ principal: { ...payload }, permissions: scope }, process.env.TOKEN_SECRET, { expiresIn: '30m' })
}

module.exports.createRefreshToken = (payload) => {
  return jwt.sign({ ...payload }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}