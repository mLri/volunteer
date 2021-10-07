const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  detail: {
    type: String
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  unit_per_day: {
    type: Number,
    required: true,
    default: 5
  },
  image: {
    mimetype: String,
    name: String,
    file: Buffer,
    img_url: String
  },
  calendars: [
    {
      _id: false,
      date: {
        type: Date,
        required: true
      },
      date_of_month: [
        {
          _id: false,
          date: {
            type: Date,
            required: true
          },
          dayoff_status: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ],
  delete_status: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'timestamp.created_at', updatedAt: 'timestamp.updated_at' }
})

module.exports = mongoose.model('event', eventSchema)