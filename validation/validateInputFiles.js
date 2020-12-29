// const { validationResult } = require('express-validator')

const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

const DEFAULT_OPTIONS = {
  type: ['image/jpg', 'image/jpeg', 'video/mp4']
}

exports.validateInputFiles = (options) => {
  return async (req, res, next) => {
    try {
      if (options) DEFAULT_OPTIONS.type = options.type
      if (!req.files) return next() /* pass next if not send input file */

      const files = req.files.file

      if (Array.isArray(files) && files.length) { /* multiple object case */
        for (let file of files) {
          if (!DEFAULT_OPTIONS.type.includes(file.mimetype)) {
            handleError(statusError.bad_request_with_message(`not allow type ${file.mimetype}`), res)
            return
          }
        }
        next()
      } else if (typeof files === 'object' && files !== null) { /* single object case */
        if (!DEFAULT_OPTIONS.type.includes(files.mimetype)) {
          handleError(statusError.bad_request_with_message(`not allow type ${files.mimetype}`), res)
          return
        }
        next()
      } else {
        handleError(statusError.bad_request_with_message('object is empty!'), res)
        return
      }
    }
    catch (error) {
      handleError(error, res)
      return
    }
  }
}