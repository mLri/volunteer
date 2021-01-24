module.exports.chatRoomSchema = {
  createChatRoom: {
    'name': {
      in: ['body'],
      exists: true,
      errorMessage: 'field name is required!',
      matches: {
        options: /^[\w\s\d\@\.\-\_]+$/i,
        errorMessage: 'must be use format'
      }
    },
    'user_id': {
      in: ['body'],
      exists: true,
      errorMessage: 'field user_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    }
  }
}