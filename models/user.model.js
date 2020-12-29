const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        name: String,
        data: Buffer,
        url: String,
        mimetype: String
    },
    role: {
        type: String,
        required: true,
        default: 'admin'
    }
}, {
    timestamps: { createdAt: 'timestamp.created_at', updatedAt: 'timestamp.updated_at' }
})

module.exports = mongoose.model('user', userSchema)