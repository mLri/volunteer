/* include models */
const JobType = require('../models/job_type.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports.listJobType = async (req, res) => {
  try {
    const { status } = req.query
    let query = {}

    if (status) query.status = status

    const list_job_type = await JobType.find(query).lean()

    res.json(list_job_type)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createJobType = async (req, res) => {
  try {
    const { name, status = true } = req.body

    const exist_type_name = await JobType.findOne({ name }, { _id: true }).lean()
    if (exist_type_name) throw statusError.bad_request_with_message(`type name ${name} is already exist!`)

    const create_job_type = await JobType.create({ name, status })

    res.json(create_job_type)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updateJobType = async (req, res) => {
  try {
    const _id = req.params.job_type_id

    let find_job_type = await JobType.findById(_id)
    if (!find_job_type) throw statusError.bad_request_with_message(`Not found job type by id ${_id}`)

    Object.assign(find_job_type, { ...req.body })
    const update_job_type = await find_job_type.save()

    res.json(update_job_type)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.deleteJobType = async (req, res) => {
  try {
    const _id = req.params.job_type_id

    let delete_job_type = await JobType.findOneAndDelete({ _id })
    if (!delete_job_type) throw statusError.bad_request_with_message(`Not found job_type_id by ${_id}`)

    res.json(delete_job_type)
  } catch (error) {
    handleError(error, res)
  }
}