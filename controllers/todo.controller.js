/* include models */
const Todo = require('../models/todo.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports.listTodo = async (req, res) => {
  try {
    const {
      complete = false,
      limit = 5,
      sorted_by = 'created_at',
      sorted_order = 'asc',
      page = 1
    } = req.query

    let query = { completed: complete }

    /* calculate page */
    const skip_num = (page - 1) * limit
    const limit_num = parseInt(limit)

    /* manage sort */
    const order = sorted_order === 'asc' ? 1 : -1
    if (sorted_by === 'created_at') { sort = { 'timestamp.created_at': order } }
    if (sorted_by === 'title') { sort = { 'title': order } }

    const todo_list = await Todo.find(query).sort(sort).limit(limit_num).skip(skip_num)

    res.json(todo_list)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createTodo = async (req, res) => {
  try {
    const { user_id, title } = req.body

    const create_todo = await Todo.create({
      user_id,
      title
    })

    res.json(create_todo)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updateTodo = async (req, res) => {
  try {
    const _id = req.params.todo_id

    const find_todo = await Todo.findOne({ _id })
    if (!find_todo) throw statusError.bad_request_with_message(`not found todo_id ${_id}`)

    /* update todo */
    Object.assign(find_todo, { ...req.body })
    const update_todo = await find_todo.save()

    res.status(200).json(update_todo)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.deleteTodo = async (req, res) => {
  try {
    const _id = req.params.todo_id

    const delete_todo = await Todo.findByIdAndDelete(_id)
    if (!delete_todo) throw statusError.bad_request_with_message(`not found todo_id -> ${_id}`)

    res.json(delete_todo)
  } catch (error) {
    handleError(error, res)
  }
}