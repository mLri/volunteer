const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
  chat_room_id: {
    type: Schema.Types.ObjectId
  },
  user_id: {
    type: Schema.Types.ObjectId
  },
  type: {
    type: String
  },
  chat: {
    message: { type: String },
    file_name: { type: String },
    data: { type: Buffer },
    url: { type: String },
    mimetype: { type: String }
  },
  readed_by: [
    {
      type: Schema.Types.ObjectId,
      default: []
    }
  ]
}, {
  timestamps: { createdAt: 'timestamp.created_at', updatedAt: 'timestamp.updated_at' }
})

module.exports = mongoose.model('chat', chatSchema)