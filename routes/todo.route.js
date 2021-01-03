/* include modules */
const router = require('express').Router()

/* validation */
const { validateSchema, validateSchemaType, handleErrorValidate } = require('../validation')
const { todoSchema } = require('../validation/schema/todo.schema')

/* include controllers */
const todo_controller = require('../controllers/todo.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.get('/',
  checkAuth,
  validateSchema(todoSchema.listTodo),
  validateSchemaType(todoSchema.listTodo),
  handleErrorValidate,
  todo_controller.listTodo)

router.post('/',
  checkAuth,
  validateSchema(todoSchema.createTodo),
  validateSchemaType(todoSchema.createTodo),
  handleErrorValidate,
  todo_controller.createTodo)

router.patch('/:todo_id',
  checkAuth,
  validateSchema(todoSchema.updateTodo),
  validateSchemaType(todoSchema.updateTodo),
  handleErrorValidate,
  todo_controller.updateTodo)

router.delete('/:todo_id',
  checkAuth,
  validateSchema(todoSchema.deleteTodo),
  validateSchemaType(todoSchema.deleteTodo),
  handleErrorValidate,
  todo_controller.deleteTodo)

module.exports = router