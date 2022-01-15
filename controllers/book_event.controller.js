/* include modules */
const fs = require('fs')

/* include models */
const BookEvent = require('../models/book_event.model')
const Event = require('../models/event.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports.getBookEventById = async (req, res) => {
  try {
    let book_events
    let query = {}
    let field_option = {}
    const {
      limit = 10,
      sorted_by = 'created_at',
      sorted_order = 'asc',
      page = 1,
      fields,
      event_id,
      total = false
    } = req.query

    /* calculate page */
    const skip_num = (page - 1) * limit
    const limit_num = parseInt(limit)

    /* manage sort */
    const order = sorted_order === 'asc' ? 1 : -1
    if (sorted_by === 'created_at') { sort = { 'timestamp.created_at': order } }
    // if (sorted_by === 'title') { sort = { 'title': order } }

    if (event_id) query.event_id = event_id

    if (fields) {
      const field_arr = fields.split(',')
      for (let field of field_arr) {
        Object.assign(field_option, { [field]: 1 })
      }
    }

    if (total) {
      book_events = await BookEvent.countDocuments(query, field_option)
    } else {
      // events = await Event.find(query, field_option).sort(sort).limit(limit_num).skip(skip_num)
      book_events = await BookEvent.find(query, field_option).sort(sort).limit(limit_num).skip(skip_num)
    }

    res.json(book_events)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.getBookEvent = async (req, res) => {
  try {
    const { book_event_id } = req.params

    const book_event = await BookEvent.findOne({ _id: book_event_id })
    res.json(book_event)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createBookEvent = async (req, res) => {
  try {
    const { event_id, prefix, firstname, lastname, employee_id, institution, tel, date_time } = req.body

    const d = new Date(date_time)
    const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const is_dup = await BookEvent.findOne({ event_id, employee_id, date_time: dt })
    if (is_dup) throw statusError.bad_request_with_message('duplicate data!')

    const { unit_per_day } = await Event.findOne({ _id: event_id }, { _id: 0, unit_per_day: 1 }).lean()
    const count_book_vaccine = await BookEvent.countDocuments({ event_id, date_time: dt })
    if (count_book_vaccine >= unit_per_day) throw statusError.bad_request_with_message('can not bookking limit.')

    const create_data = {
      event_id,
      prefix,
      firstname,
      lastname,
      employee_id,
      institution,
      tel,
      date_time: dt
    }

    const create_book_vaccine = await BookEvent.create(create_data)

    res.json(create_book_vaccine)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updateBookEvent = async (req, res) => {
  try {
    const { book_event_id } = req.params

    let book_event = await BookEvent.findOne({ _id: book_event_id })
    if (!book_event) throw statusError.bad_request_with_message(`not found book_event_id ${book_event_id}`)

    Object.assign(book_event, { ...req.body })

    const update_book_event = await book_event.save()

    res.json(update_book_event)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.deleteBookEvent = async (req, res) => {
  try {
    const { book_event_id } = req.params

    const delete_book_event = await BookEvent.findByIdAndDelete({ _id: book_event_id })
    if (!delete_book_event) throw statusError.bad_request_with_message(`not found book_event_id: ${book_event_id}`)

    res.status(204).send()
  } catch (error) {
    handleError(error, res)
  }
}