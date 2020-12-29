const router = require('express').Router()

/* validation */
const { validateUser } = require('../validation/schema/user.validate')
const { handleErrorValidate } = require('../validation')

/* include controllers */
const user_controller = require('../controllers/auth.controller')

router.post('/signin',
  validateUser.signin(),
  handleErrorValidate,
  user_controller.signIn)

router.post('/signup',
  validateUser.signup(),
  handleErrorValidate,
  user_controller.signUp)

router.post('/refresh_token',
  validateUser.refresh_token(),
  handleErrorValidate,
  user_controller.refreshToken)

module.exports = router