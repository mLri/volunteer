/* include modules */
const router = require('express').Router()

/* validation */
const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
const { jobTypeSchema } = require('../validation/schema/job_type.schema')

/* include controllers */
const job_type_controller = require('../controllers/job_type.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.get('/',
  job_type_controller.listJobType)

router.post('/',
  checkAuth,
  validateSchema(jobTypeSchema.createJobType),
  validateSchemaType(jobTypeSchema.createJobType),
  handleErrorValidate,
  job_type_controller.createJobType)

router.patch('/:job_type_id',
  checkAuth,
  validateSchema(jobTypeSchema.updateJobType),
  validateSchemaType(jobTypeSchema.updateJobType),
  handleErrorValidate,
  job_type_controller.updateJobType)

router.delete('/:job_type_id',
  checkAuth,
  validateSchema(jobTypeSchema.deleteJobType),
  validateSchemaType(jobTypeSchema.deleteJobType),
  handleErrorValidate,
  job_type_controller.deleteJobType)

module.exports = router