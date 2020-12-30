/* include models */
const User = require('../models/user.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')
const { uploadS3 } = require('../helpers/upload.helper')

module.exports.updateCustomer = async (req, res) => {
  try {
    const _id = req.params.customer_id
    if (!_id) throw statusError.bad_request

    const { first_name, last_name } = req.body

    let find_customer = await User.findOne({ _id }, { role: 0, password: 0 })
    if (!find_customer) throw statusError.bad_request_with_message('not found user!')

    /* set field update */
    if (first_name) find_customer.first_name = first_name
    if (last_name) find_customer.last_name = last_name

    if (req.files) {
      const upload_file = await uploadS3(req.files.file, process.env.AWS_BUCKET_NAME)
      find_customer.avatar = {
        name: upload_file.key,
        url: upload_file.Location,
        mimetype: upload_file.mimetype
      }
    }

    /* update customer */
    const update_customer = await find_customer.save()

    res.json(update_customer)
  } catch (error) {
    handleError(error, res)
  }
}