const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  job_type_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  job_level_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  job_logo: {
    name: String,
    data: Buffer,
    url: String,
    mimetype: String
  },
  job_salary: {
    type: String
  },
  job_addr: {
    type: String
  },
  job_detail: {
    type: String
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: { createdAt: 'timestamp.created_at', updatedAt: 'timestamp.updated_at' }
})

module.exports = mongoose.model('job', JobSchema)