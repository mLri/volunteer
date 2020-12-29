const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: { createdAt: 'timestamp.created_at', updatedAt: 'timestamp.updated_at' }
})

module.exports = mongoose.model('todo', todoSchema)