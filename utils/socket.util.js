/* include module */
const ObjectId = require('mongoose').Types.ObjectId

/* include model */
const Chat = require('../models/chat.model')

/* include helper */
const { setMessage } = require('../helpers/socket.helper')
module.exports.init = (http) => {

  const io = require('socket.io')(http, {
    cors: {
      origin: "*"
    }
  })

  io.on('connection', (socket) => {

    let user = {}

    socket.on('join_room', async room_id => {
      console.log('join room -> ', room_id)
      if (!user.room_id) {
        console.log('add room to user : ' + room_id)
        user.room_id = room_id
      } else {
        console.log('leave room : ' + room_id)
        socket.leave(user.room_id)
      }
      socket.join(room_id)
    })

    socket.on('send_message', async (data) => {

      /* limit file size */
      if (data.type == 'file' && data.files.size > 100000) {
        socket.emit('socket_error', { status: false, message: 'File limit error!' })
        return
      }

      const message = await setMessage(data)

      if (message) {
        /* create chat */
        await Chat.create(message)

        io.to(`${data.room_id}`).emit('send_message', message)
      }
    })

    socket.on('read_message', async (data) => {
      let last_chat = await Chat.findOne({ chat_room_id: data.room_id }).sort({ 'timestamp.created_at': -1 })

      if (last_chat) {
        const find_me = last_chat.readed_by.find(id => id == data.user_id)
        if (!find_me && last_chat.user_id != data.user_id) {
          /* update readed_by */
          last_chat.readed_by.push(data.user_id)
          await last_chat.save()

          let readed_by_arr = await Chat.aggregate([
            {
              $match: {
                _id: ObjectId(last_chat._id)
              }
            },
            {
              $lookup: {
                from: "users",
                localField: 'readed_by',
                foreignField: '_id',
                as: 'user'
              }
            },
            {
              $project: {
                'user._id': 1,
                'user.first_name': 1
              }
            }
          ])

          io.to(`${data.room_id}`).emit('read_message', readed_by_arr[0])
        }
      }
    })

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('error', (err) => {
      console.log('Websocket error!: ' + err);
    });
  });
}
