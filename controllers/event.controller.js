/* include modules */
const fs = require('fs')

/* include models */
const Event = require('../models/event.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')
const { uploadFile } = require('../helpers/upload.helper')

module.exports.getListEvents = async (req, res) => {
  try {
    const events = await Event.find().lean()
    res.json(events)
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