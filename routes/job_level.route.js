/* include modules */
const router = require('express').Router()

/* validation */
const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
const { jobLevelSchema } = require('../validation/schema/job_level.schema')

/* include controllers */
const job_level_controller = require('../controllers/job_level.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.get('/',
  job_level_controller.listJobLevel)

router.post('/',
  checkAuth,
  validateSchema(jobLevelSchema.createJobLevel),
  validateSchemaType(jobLevelSchema.createJobLevel),
  handleErrorValidate,
  job_level_controller.createJobLevel)

router.patch('/:job_level_id',
  checkAuth,
  validateSchema(jobLevelSchema.updateJobLevel),
  validateSchemaType(jobLevelSchema.updateJobLevel),
  handleErrorValidate,
  job_level_controller.updateJobLevel)

router.delete('/:job_level_id',
  checkAuth,
  validateSchema(jobLevelSchema.deleteJobLevel),
  validateSchemaType(jobLevelSchema.deleteJobLevel),
  handleErrorValidate,
  job_level_controller.deleteJobLevel)

module.exports = router