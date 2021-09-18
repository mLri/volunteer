const router = require('express').Router()

/* validation */
// const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
// const { userSchema } = require('../validation/schema/user.schema')

/* include controllers */
const book_event_controller = require('../controllers/book_event.controller')

/* TODO::
    API getBookEventById can select field
    Validate data
*/

router.get('/',
  book_event_controller.getBookEventById)

router.post('/',
  // validateSchema(userSchema.signin),
  // validateSchemaType(userSchema.signin),
  // handleErrorValidate,
  book_event_controller.createBookEvent)

router.patch('/:book_event_id',
  book_event_controller.updateBookEvent)

router.delete('/:book_event_id',
  book_event_controller.deleteBookEvent)

module.exports = router