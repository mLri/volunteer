const { validationResult, checkSchema } = require('express-validator')

const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

const DEFAULT_OPTIONS = {
  type: ['image/jpg', 'image/jpeg', 'video/mp4']
}

module.exports.handleErrorValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    handleError(statusError.bad_request_with_message(errors.array({ onlyFirstError: true })), res)
    return
  }
  next()
}

module.exports.validateInputFiles = (options) => {
  return async (req, res, next) => {
    try {
      if (options) DEFAULT_OPTIONS.type = options.type
      if (!req.files) return next() /* pass next if not send input file */

      const files = req.files.file

      if (Array.isArray(files) && files.length) { /* multiple object case */
        for (let file of files) {
          if (!DEFAULT_OPTIONS.type.includes(file.mimetype)) throw statusError.bad_request_with_message(`not allow type ${file.mimetype}`)
        }
        next()
      } else if (typeof files === 'object' && files !== null) { /* single object case */
        if (!DEFAULT_OPTIONS.type.includes(files.mimetype)) throw statusError.bad_request_with_message(`not allow type ${files.mimetype}`)
        next()
      }
    }
    catch (error) {
      handleError(error, res)
    }
  }
}

module.exports.validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      const schema_arr = Object.keys(schema)
      const body_arr = Object.keys(req.body)
      const params_arr = Object.keys(req.params)
      const query_arr = Object.keys(req.query)
      const file_arr = req.files ? Object.keys(req.files) : []

      const concat_arr = body_arr.concat(params_arr ? params_arr : [], query_arr ? query_arr : [], file_arr ? file_arr : [])

      for (let key of concat_arr) {
        if (!schema_arr.includes(key)) throw statusError.bad_request_with_message(`not allow field -> ${key}`)
      }
      next()
    } catch (error) {
      handleError(error, res)
    }
  }
}

module.exports.validateSchemaType = (schemaType) => {
  return checkSchema(schemaType)
}