/* include models */
const User = require('../models/user.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')
const { uploadS3 } = require('../helpers/upload.helper')

function convertToSlug(Text) {
  return Text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

module.exports.getCustomer = async (req, res) => {
  try {
    const { search, fields } = req.query
    let query, options = {}

    if (search) {
      query = {
        $or: [
          { first_name: { $regex: ".*" + search + ".*", $options: 'i' } },
          { username: { $regex: ".*" + search + ".*", $options: 'i' } }
        ]
      }
    }

    if (fields) {
      const field_arr = fields.split(',')
      for (let field of field_arr) {
        Object.assign(options, { [field]: 1 })
      }
    }

    const find_user = await User.find(query, options)

    res.json(find_user)
  } catch (error) {
    handleError(error, res)
  }
}

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

module.exports.updateCompany = async (req, res) => {
  try {
    const { customer_id } = req.params
    const { name, slug, info, addr, tel, email, link } = req.body

    let find_customer = await User.findOne({ _id: customer_id })
    if (!find_customer) throw statusError.bad_request_with_message(`Not found user by customer_id ${customer_id}`)

    find_customer.company.slug = slug ? slug : convertToSlug(name)
    if (name) find_customer.company.name = name
    if (slug) find_customer.company.slug = slug
    if (info) find_customer.company.info = info
    if (addr) find_customer.company.contact.addr = addr
    if (tel) find_customer.company.contact.tel = tel
    if (email) find_customer.company.contact.email = email
    if (link) find_customer.company.contact.link = link

    if (req.files) {
      const upload_file = await uploadS3(req.files.file, process.env.AWS_BUCKET_NAME)
      find_customer.company.avatar = {
        name: upload_file.key,
        url: upload_file.Location,
        mimetype: upload_file.mimetype
      }
    }

    /* create or update company infomation */
    await find_customer.save()

    res.json(find_customer.company)
  } catch (error) {
    handleError(error, res)
  }
}