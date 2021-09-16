// /* include moduls */
// const AWS = require('aws-sdk')

// /* set up s3 config */
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ID,
//   secretAccessKey: process.env.AWS_KEY,
//   region: process.env.AWS_REGION
// });

const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

function ranNameFileUpload(file_name) {
  /* if use throw in child func it thorw to mom catch */
  if (!file_name.name) throw statusError.bad_request_with_message('file have no name image!')
  const split_name = file_name.name.split('.')
  const random_name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return `${random_name}.${split_name[split_name.length - 1]}`
}

module.exports.uploadFile = (files) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (Array.isArray(files) && files.length) {
        let img_arr = []
        for (let file of files) {
          const new_name = ranNameFileUpload(file)

          /* move file to public folder */
          await file.mv('public/' + new_name)
          img_arr.push({
            name: new_name,
            mimetype: file.mimetype
          })
        }
        resolve(img_arr)
      } else if (typeof files === 'object' && files !== null) {
        const new_name = ranNameFileUpload(files)

        /* move file to public folder */
        await files.mv('public/' + new_name)
        resolve({
          name: new_name,
          mimetype: files.mimetype
        })
      } else {
        reject({ status_error: 400, message: 'object is empty!' })
      }
    } catch (error) {
      reject({ status_error: 400, message: JSON.stringify(error.message) })
    }
  })
}

module.exports.uploadS3 = (files, bucket_name) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (Array.isArray(files) && files.length) {
        let img_arr = []
        for (let file of files) {
          const new_name = ranNameFileUpload(file)
          const params = {
            Bucket: bucket_name,
            Key: new_name,
            Body: file.data,
          }

          /* move file to s3 service */
          const uploaded = await s3.upload(params).promise()
          img_arr.push({ ...uploaded, mimetype: file.mimetype })
        }
        resolve(img_arr)
      } else if (typeof files === 'object' && files !== null) {
        const new_name = ranNameFileUpload(files)
        const params = {
          Bucket: bucket_name,
          Key: new_name,
          Body: files.data,
        }

        /* move file to s3 service */
        const uploaded = await s3.upload(params).promise()
        resolve({ ...uploaded, mimetype: files.mimetype })
      } else {
        reject({ status_error: 400, message: 'object is empty!' })
      }
    } catch (error) {
      reject({ status_error: 400, message: JSON.stringify(error.message) })
    }
  })
}