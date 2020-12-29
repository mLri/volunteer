const router = require('express').Router()
const { check } = require('express-validator')

/* validation */
const { validateCustomer } = require('../validation/schema/customer.validate')
const { handleErrorValidate } = require('../validation')
const { validateInputFiles } = require('../validation/validateInputFiles')

/* include controllers */
const customer_controller = require('../controllers/customer.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.patch('/:customer_id',
  checkAuth,
  validateInputFiles({ type: ['image/jpeg'] }),
  validateCustomer.updateCustomer(),
  handleErrorValidate,
  customer_controller.updateCustomer)

module.exports = router