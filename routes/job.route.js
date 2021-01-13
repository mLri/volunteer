/* include modules */
const router = require('express').Router()

/* validation */
const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
const { jobSchema } = require('../validation/schema/job.schema')

/* include controllers */
const job_controller = require('../controllers/job.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.get('/',
  validateSchema(jobSchema.listJob),
  validateSchemaType(jobSchema.listJob),
  handleErrorValidate,
  job_controller.listJob)

router.get('/:job_id',
  validateSchema(jobSchema.getJob),
  validateSchemaType(jobSchema.getJob),
  handleErrorValidate,
  job_controller.getJob)

router.post('/',
  checkAuth,
  validateSchema(jobSchema.createJob),
  validateSchemaType(jobSchema.createJob),
  handleErrorValidate,
  job_controller.createJob)

router.patch('/:job_id',
  checkAuth,
  validateSchema(jobSchema.updateJob),
  validateSchemaType(jobSchema.updateJob),
  handleErrorValidate,
  job_controller.updateJob)

router.delete('/:job_id',
  checkAuth,
  validateSchema(jobSchema.deleteJob),
  validateSchemaType(jobSchema.deleteJob),
  handleErrorValidate,
  job_controller.deleteJob)

module.exports = router