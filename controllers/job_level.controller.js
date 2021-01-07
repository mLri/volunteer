/* include models */
const JobLevel = require('../models/job_level.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports.listJobLevel = async (req, res) => {
  try {
    const { status } = req.query
    let query = {}

    if (status) query.status = status

    const list_job_level = await JobLevel.find(query).lean()

    res.json(list_job_level)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createJobLevel = async (req, res) => {
  try {
    const { name, status = true } = req.body

    const exist_level_name = await JobLevel.findOne({ name }, { _id: true }).lean()
    if (exist_level_name) throw statusError.bad_request_with_message(`level name ${name} is already exist!`)

    const create_job_Level = await JobLevel.create({ name, status })

    res.json(create_job_Level)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updateJobLevel = async (req, res) => {
  try {
    const _id = req.params.job_level_id

    let find_job_level = await JobLevel.findById(_id)
    if (!find_job_level) throw statusError.bad_request_with_message(`Not found job level by id ${_id}`)

    Object.assign(find_job_level, { ...req.body })
    const update_job_level = await find_job_level.save()

    res.json(update_job_level)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.deleteJobLevel = async (req, res) => {
  try {
    const _id = req.params.job_level_id

    let delete_job_level = await JobLevel.findOneAndDelete({ _id })
    if (!delete_job_level) throw statusError.bad_request_with_message(`Not found job_level_id by ${_id}`)

    res.json(delete_job_level)
  } catch (error) {
    handleError(error, res)
  }
}