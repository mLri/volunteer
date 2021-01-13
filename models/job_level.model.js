const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobLevelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: { createdAt: 'timestamp.created_at', updatedAt: 'timestamp.updated_at' }
})

module.exports = mongoose.model('job_level', JobLevelSchema)