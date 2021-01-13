/* include modules */
const router = require('express').Router()

/* validation */
const { validateSchema, validateSchemaType, validateInputFiles, handleErrorValidate } = require('../validation')
const { customerSchema } = require('../validation/schema/customer.schema')

/* include controllers */
const customer_controller = require('../controllers/customer.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.patch('/:customer_id',
  checkAuth,
  validateSchema(customerSchema.updateCustomer),
  validateSchemaType(customerSchema.updateCustomer),
  validateInputFiles({ type: 'image/jpeg' }),
  handleErrorValidate,
  customer_controller.updateCustomer)

router.patch('/:customer_id/company',
  checkAuth,
  validateSchema(customerSchema.updateCompany),
  validateSchemaType(customerSchema.updateCompany),
  validateInputFiles({ type: 'image/jpeg' }),
  handleErrorValidate,
  customer_controller.updateCompany)

module.exports = router