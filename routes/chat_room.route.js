/* include modules */
const router = require('express').Router()

/* validation */
const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
const { chatRoomSchema } = require('../validation/schema/chat_room.schema')

/* include controllers */
const chat_room_controller = require('../controllers/chat_room.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.get('/',
  checkAuth,
  chat_room_controller.listChatRoom)

router.get('/:chat_room_id',
  checkAuth,
  chat_room_controller.getChatRoomById)

router.post('/',
  checkAuth,
  validateSchema(chatRoomSchema.createChatRoom),
  validateSchemaType(chatRoomSchema.createChatRoom),
  handleErrorValidate,
  chat_room_controller.createChatRoom)

module.exports = router