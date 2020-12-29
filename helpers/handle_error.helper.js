module.exports.handleError = (error, res) => {
  const status_code = (error.status_error) ? error.status_error : 500
  const data = (error.status_error) ? error : { status_error: 500, message: error.message }
  res.status(status_code).json(data)
}