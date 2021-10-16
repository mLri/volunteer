/* include modules */
const fs = require('fs')

/* include models */
const Event = require('../models/event.model')
const BookEvent = require('../models/book_event.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')
const { uploadFile } = require('../helpers/upload.helper')

module.exports.getListEvents = async (req, res) => {
  try {
    const { fields } = req.query
    let field_option = {}

    if (fields) {
      const field_arr = fields.split(',')
      for (let field of field_arr) {
        Object.assign(field_option, { [field]: 1 })
      }
    }

    const events = await Event.find({}, field_option).lean()
    res.json(events)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.getEvent = async (req, res) => {
  try {
    const { event_id } = req.params
    const event = await Event.findOne({ _id: event_id })

    const start_date = new Date(event.start_date)
    const end_date = new Date(event.end_date)

    const book_events = await BookEvent.aggregate([
      {
        $match: {
          $and: [
            { date_time: { $gte: start_date } },
            { date_time: { $lte: end_date } }
          ]
        }
      },
      {
        $group: {
          _id: '$date_time',
          count: { $sum: 1 }
        }
      }
    ])

    if (book_events.length) {
      for (let book_date of book_events) {

        for (let month of event.calendars) {
          let find_book_date = month.date_of_month.find(val => {
            return new Date(val.date).getTime() === new Date(book_date._id).getTime()
          })
          if (find_book_date) {
            find_book_date['amont'] = event.unit_per_day - book_date.count
          }
        }

      }
    }

    res.json(event)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createEvent = async (req, res) => {
  try {
    let uploaded_img
    let create_event_obj = req.body
    if (typeof create_event_obj.calendars === 'string') create_event_obj.calendars = JSON.parse(create_event_obj.calendars)

    /* upload file */
    if (req.files) {
      uploaded_img = await uploadFile(req.files.image)
      create_event_obj.image = {
        name: uploaded_img.name,
        mimetype: uploaded_img.mimetype
      }
    }

    const create_event = await Event.create(create_event_obj)
    res.json(create_event)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updateEvent = async (req, res) => {
  try {
    let uploaded_img, update_event
    let update_event_obj = req.body
    const _id = req.params.event_id

    const find_event = await Event.findOne({ _id })
    if (!find_event) throw statusError.bad_request_with_message(`not found event_id ${_id}`)

    /* upload file */
    if (req.files) {
      /* delete old image */
      if (find_event.image.name) fs.unlinkSync(`public/${find_event.image.name}`)

      uploaded_img = await uploadFile(req.files.image)
      find_event.image = {
        name: uploaded_img.name,
        mimetype: uploaded_img.mimetype
      }
    }

    update_event = find_event

    /* update event */
    if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
      if (typeof update_event_obj.calendars === 'string') update_event_obj.calendars = JSON.parse(update_event_obj.calendars)
      Object.assign(find_event, { ...update_event_obj })
      update_event = await find_event.save()
    }

    res.json(update_event)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.deleteEvent = async (req, res) => {
  try {
    const { event_id } = req.params

    const delete_event = await Event.findByIdAndDelete({ _id: event_id })
    if (!delete_event) throw statusError.bad_request_with_message(`not found event_id -> ${_id}`)

    res.status(204).send()
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.getFileImage = async (req, res) => {
  try {
    const { event_id } = req.params
    const find_event = await Event.findOne({ _id: event_id }, { image: 1 }).lean()

    if (!find_event.image) throw statusError.bad_request_with_message('have no image!')

    const data = fs.readFileSync(`public/${find_event.image.name}`)
    res.contentType(find_event.image.mimetype)
    res.send(data)
  } catch (error) {
    handleError(error, res)
  }
}