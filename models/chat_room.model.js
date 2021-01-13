const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatRoomSchema = new Schema({
  name: {
    type: String
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      required: true
    }
  ],
  deleted_by: {
    type: Schema.Types.ObjectId
  }
}, {
  timestamps: { createdAt: 'timestamp.created_at', updatedAt: 'timestamp.updated_at' }
})

module.exports = mongoose.model('chat_room', chatRoomSchema)