/* include module */
const ObjectId = require('mongoose').Types.ObjectId

/* include models */
const ChatRoom = require('../models/chat_room.model')
const Chat = require('../models/chat.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports.createChatRoom = async (req, res) => {
  try {
    const { principal: { _id } } = req.user
    const { user_id, name } = req.body

    /* check room exists by users field */
    const old_chat_room = await ChatRoom.findOne({ $and: [{ users: _id }, { users: user_id }] })
    if (old_chat_room) throw statusError.bad_request_with_message('Chat room has already exists!')

    const createChatRoom = await ChatRoom.create({
      name,
      users: [_id, user_id]
    })

    res.json(createChatRoom)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.listChatRoom = async (req, res) => {
  try {
    const { principal: { _id } } = req.user

    let query = {
      'users': ObjectId(_id)
    }

    const list_chat_room = await ChatRoom.aggregate([
      {
        $match: query
      },
      {
        $lookup:
        {
          from: "chats",
          let: { "id": "$_id" }, // _id of ChatRoom model to id
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$chat_room_id", "$$id"] } // chat_room_id from Chat model
              }
            },
            {
              $sort: {
                'timestamp.created_at': -1.0
              }
            },
            {
              $limit: 1
            }
          ],
          as: "chat"
        }
      }
    ])

    res.json(list_chat_room)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.getChatRoomById = async (req, res) => {
  try {
    const { chat_room_id } = req.params

    let query = {
      chat_room_id: ObjectId(chat_room_id)
    }

    const chat = await Chat.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: "users",
          localField: 'readed_by',
          foreignField: '_id',
          as: 'readed_by'
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          chat: 1,
          chat_room_id: 1,
          timestamp: 1,
          'readed_by._id': 1,
          'readed_by.first_name': 1,
          'user._id': 1,
          'user.first_name': 1,
        }
      }
    ])

    res.json(chat)
  } catch (error) {
    handleError(error, res)
  }
}