const router = require('express').Router()

/* validation */
// const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
// const { userSchema } = require('../validation/schema/user.schema')
const { checkAuth } = require('../helpers/token.helper')

/* include controllers */
const event_controller = require('../controllers/event.controller')

/* TODO:: 
    List api can select field
    API get event by id and can select field also
    Validate data
*/

router.get('/',
  event_controller.getListEvents)

router.get('/:event_id',
  event_controller.getEvent)

router.post('/',
  checkAuth,
  // validateSchema(userSchema.signin),
  // validateSchemaType(userSchema.signin),
  // handleErrorValidate,
  event_controller.createEvent)

router.patch('/:event_id',
  checkAuth,
  event_controller.updateEvent)

router.delete('/:event_id',
  checkAuth,
  event_controller.deleteEvent)

router.get('/files/img/:event_id',
  event_controller.getFileImage)

module.exports = router