/* include module */
const bcrypt = require('bcrypt')
const { verify } = require('jsonwebtoken')

/* include models */
const User = require('../models/user.model')

/* include helpers */
const { createAccessToken, createRefreshToken } = require('../helpers/token.helper')
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')
const { upload } = require('../helpers/upload.helper')

module.exports.signUp = async (req, res) => {
  try {
    const { first_name, last_name, username, password } = req.body

    /* check exists user */
    const user = await User.findOne({ username }).lean()
    if (user) throw statusError.bad_request_with_message('user has already exists!')

    /* hash password */
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    /* create new user */
    const new_user = new User({
      first_name,
      last_name,
      username,
      password: hashPassword
    })

    const create_user = await new_user.save()

    res.json(create_user)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body

    /* check user */
    const user = await User.findOne({ username }).lean()
    if (!user) throw statusError.not_found

    /* check password */
    const compare_password = await bcrypt.compare(password, user.password)
    if (!compare_password) throw statusError.bad_request_with_message('username or password was wrong!')

    /* genarate access token */
    const access_token = createAccessToken({
      _id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    })

    /* genarate refresh token */
    const refresh_token = createRefreshToken({ _id: user._id })

    res.json({
      access_token,
      refresh_token,
      username: user.username
    })
  } catch (error) {
    console.log(error)
    handleError(error, res)
  }
}

module.exports.refreshToken = async (req, res) => {
  try {
    let refresh_token = req.body.refresh_token
    if (!refresh_token) throw statusError.bad_request

    const payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
    if (!payload) throw statusError.not_found

    /* token is valid, check user exist */
    const user = await User.findOne({ _id: payload._id }).lean()
    if (!user) throw statusError.not_found

    /* genarate access token */
    const access_token = createAccessToken({
      _id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    })

    /* genarate refresh token */
    refresh_token = createRefreshToken({ _id: user._id })

    res.json({ 
      access_token,
      refresh_token,
      username: user.username,
    })
  } catch (error) {
    handleError(error, res)
  }
}