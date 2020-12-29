module.exports = {
  bad_request: {
    status_error: 400,
    message: 'Bad request'
  },
  bad_request_with_message: (msg) => {
    return {
      status_error: 400,
      message: msg
    }
  },
  unauthorized: {
    status_error: 401,
    message: "Unauthorized"
  },
  forbidden: {
    status_code: 403,
    message: "Forbidden You don't have permission to access the specified resource",
  },
  not_found: {
    status_error: 404,
    message: 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.'
  }
}