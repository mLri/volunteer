/* include modules */
const fs = require('fs')
const mongoose = require('mongoose')

/* include models */
const Event = require('../models/event.model')
const BookEvent = require('../models/book_event.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')
const { uploadFile } = require('../helpers/upload.helper')

function ranNameFileUpload(file_name) {
  /* if use throw in child func it thorw to mom catch */
  if (!file_name) throw statusError.bad_request_with_message('file have no name image!')
  const split_name = file_name.split('.')
  const random_name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return `${random_name}.${split_name[split_name.length - 1]}`
}

module.exports.getListEvents = async (req, res) => {
  try {
    let events
    let field_option = {}
    let query = {
      delete_status: false
    }
    const {
      limit = 10,
      sorted_by = 'created_at',
      sorted_order = 'asc',
      page = 1,
      total = false,
      fields,
      search = '',
      success_status = 'both'
    } = req.query

    /* calculate page */
    const skip_num = (page - 1) * limit
    const limit_num = parseInt(limit)

    /* manage sort */
    const order = sorted_order === 'asc' ? 1 : -1
    if (sorted_by === 'created_at') { sort = { 'timestamp.created_at': order } }
    // if (sorted_by === 'title') { sort = { 'title': order } }

    if (fields) {
      const field_arr = fields.split(',')
      for (let field of field_arr) {
        Object.assign(field_option, { [field]: 1 })
      }
    }

    if (total) {
      events = await Event.countDocuments(query, field_option)
    } else {
      if(search) query['name'] = { $regex: ".*" + search.trim() + ".*", $options: 'i' }
      if(success_status !== 'both') query['success_status'] = success_status
      events = await Event.find(query, field_option).sort(sort).limit(limit_num).skip(skip_num)
    }
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
            { date_time: { $lte: end_date } },
            { event_id: mongoose.Types.ObjectId(event_id) }
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
            if (find_book_date['amont'] < 0) find_book_date['amont'] = 0
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
    // let uploaded_img
    let create_event_obj = req.body
    if (typeof create_event_obj.calendars === 'string') create_event_obj.calendars = JSON.parse(create_event_obj.calendars)

    /* upload file */
    if (req.files) {
      create_event_obj.image = {
        name: ranNameFileUpload(req.files.image.name),
        mimetype: req.files.image.mimetype,
        file: req.files.image.data
      }
      //   uploaded_img = await uploadFile(req.files.image)
      //   create_event_obj.image = {
      //     name: uploaded_img.name,
      //     mimetype: uploaded_img.mimetype
      //   }
    }

    const create_event = await Event.create(create_event_obj)
    res.json(create_event)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updateEvent = async (req, res) => {
  try {
    // let uploaded_img
    let update_event
    let update_event_obj = req.body
    const _id = req.params.event_id

    const find_event = await Event.findOne({ _id })
    if (!find_event) throw statusError.bad_request_with_message(`not found event_id ${_id}`)

    /* upload file */
    if (req.files) {
      find_event.image = {
        name: ranNameFileUpload(req.files.image.name),
        mimetype: req.files.image.mimetype,
        file: req.files.image.data
      }
      /* delete old image */
      // if (find_event.image && find_event.image.name) fs.unlinkSync(`public/${find_event.image.name}`)

      // uploaded_img = await uploadFile(req.files.image)
      // find_event.image = {
      //   name: uploaded_img.name,
      //   mimetype: uploaded_img.mimetype
      // }
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

    let find_event = await Event.findOne({ _id: event_id })
    if (!find_event) throw statusError.bad_request_with_message(`not found event_id ${event_id}`)

    /* delete image */
    // if (find_event.image && find_event.image.name) fs.unlinkSync(`public/${find_event.image.name}`)

    find_event.delete_status = true
    await find_event.save()

    res.status(204).send()
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.getFileImage = async (req, res) => {
  try {
    const { img_name } = req.params
    const find_event = await Event.findOne({ 'image.name': img_name }, { image: 1 })


    res.contentType(find_event.image.mimetype)
    res.send(find_event.image.file)
  } catch (error) {
    handleError(error, res)
  }
}