const { validationResult } = require('express-validator')

const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports = {
  handleErrorValidate: (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      handleError(statusError.bad_request_with_message(errors.array({ onlyFirstError: true })), res)
      return
    }
    next()
  },
}