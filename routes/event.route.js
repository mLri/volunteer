const router = require('express').Router()

/* validation */
// const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
// const { userSchema } = require('../validation/schema/user.schema')

/* include controllers */
const event_controller = require('../controllers/event.controller')

router.get('/',
  event_controller.getListEvents)

router.post('/',
  // validateSchema(userSchema.signin),
  // validateSchemaType(userSchema.signin),
  // handleErrorValidate,
  event_controller.createEvent)

router.patch('/:event_id',
  event_controller.updateEvent)

router.delete('/:event_id',
  event_controller.deleteEvent)

router.get('/files/img/:event_id',
  event_controller.getFileImage)

module.exports = router