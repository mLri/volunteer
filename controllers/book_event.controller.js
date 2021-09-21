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
    let query = {}
    const { event_id } = req.query

    if (event_id) query.event_id = event_id

    const book_events = await BookEvent.find(query).lean()
    res.json(book_events)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createBookEvent = async (req, res) => {
  try {
    const { event_id, prefix, firstname, lastname, employee_id, institution, tel, date_time } = req.body

    const is_dup = await BookEvent.findOne({ event_id, employee_id, date_time: new Date(date_time) })
    if (is_dup) throw statusError.bad_request_with_message('duplicate data!')

    const { unit_per_day } = await Event.findOne({ _id: event_id }, { _id: 0, unit_per_day: 1 }).lean()
    const count_book_vaccine = await BookEvent.countDocuments({ event_id, employee_id, date_time: new Date(date_time) })
    if (count_book_vaccine >= unit_per_day) throw statusError.bad_request_with_message('can not bookking limit.')

    const create_data = {
      event_id,
      prefix,
      firstname,
      lastname,
      employee_id,
      institution,
      tel,
      date_time: new Date(date_time)
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