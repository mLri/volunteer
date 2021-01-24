/* include helper */
const { uploadS3 } = require('../helpers/upload.helper')

module.exports.setMessage = async (data) => {
  try {
    let message = {
      user_id: data.user_id,
      chat_room_id: data.room_id,
      type: data.type
    }
  
    if (data.type === 'message') {
      message.chat = {
        message: data.message
      }
    }
  
    if (data.type === 'file') {
      /* upload file to s3 server */
      const upload_file = await uploadS3(data.files, process.env.AWS_BUCKET_NAME)
      message.chat = {
        url: upload_file.Location,
        mimetype: data.files.type,
        file_name: data.files.name
      }
    }
  
    return message
  } catch(error) {
    console.log('error -> ', error)
  }
}