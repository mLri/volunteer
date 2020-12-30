const router = require('express').Router()

/* validation */
const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
const { userSchema } = require('../validation/schema/user.schema')

/* include controllers */
const user_controller = require('../controllers/auth.controller')

router.post('/signin',
  validateSchema(userSchema.signin),
  validateSchemaType(userSchema.signin),
  handleErrorValidate,
  user_controller.signIn)

router.post('/signup',
  validateSchema(userSchema.signup),
  validateSchemaType(userSchema.signup),
  handleErrorValidate,
  user_controller.signUp)

router.post('/refresh_token',
  validateSchema(userSchema.refresh_token),
  validateSchemaType(userSchema.refresh_token),
  handleErrorValidate,
  user_controller.refreshToken)

module.exports = router