const router = require('express').Router()
const { query, checkSchema, validationResult } = require('express-validator')


/* validation */
const { validateTodo } = require('../validation/schema/todo.validate')
const { handleErrorValidate } = require('../validation')

/* include controllers */
const todo_controller = require('../controllers/todo.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.get('/',
  checkAuth,
  validateTodo.listTodo(),
  handleErrorValidate,
  todo_controller.listTodo)

router.post('/',
  checkAuth,
  validateTodo.createTodo(),
  handleErrorValidate,
  todo_controller.createTodo)

module.exports = router