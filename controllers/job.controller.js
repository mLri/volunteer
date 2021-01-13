/* include module */
const ObjectId = require('mongoose').Types.ObjectId

/* include models */
const Job = require('../models/job.model')
const JobType = require('../models/job_type.model')
const JobLevel = require('../models/job_level.model')

/* include helpers */
const { handleError } = require('../helpers/handle_error.helper')
const statusError = require('../helpers/status_error.helper')

module.exports.listJob = async (req, res) => {
  try {
    const {
      limit = 5,
      sorted_by = 'created_at',
      sorted_order = 'asc',
      page = 1,
      job_type,
      job_level
    } = req.query

    let query = {}

    if (job_type) {
      const find_job_type = await JobType.find({}, { _id: 1, slug: 1 })
      const job_type_arr = job_type.split(',')

      if (!query.$and) query.$and = []

      let query_job_type = []
      for (let job_type of job_type_arr) {
        const job_type_obj = find_job_type.find(val => val.slug === job_type)
        query_job_type.push({ job_type_id: job_type_obj._id })
      }
      query.$and.push({ $or: query_job_type })
    }

    if (job_level) {
      const find_job_level = await JobLevel.find({}, { _id: 1, slug: 1 })
      const job_level_arr = job_level.split(',')

      if (!query.$and) query.$and = []

      let query_job_level = []
      for (let job_level of job_level_arr) {
        const job_level_obj = find_job_level.find(val => val.slug === job_level)
        query_job_level.push({ job_level_id: job_level_obj._id })
      }
      query.$and.push({ $or: query_job_level })
    }

    /* calculate page */
    const skip_num = (page - 1) * limit
    const limit_num = parseInt(limit)

    /* manage sort */
    const order = sorted_order === 'asc' ? 1 : -1
    if (sorted_by === 'created_at') { sort = { 'timestamp.created_at': order } }
    if (sorted_by === 'name') { sort = { 'name': order } }

    const filter = [
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: "job_types",
          localField: 'job_type_id',
          foreignField: '_id',
          as: 'job_type'
        }
      },
      {
        $lookup: {
          from: "job_levels",
          localField: 'job_level_id',
          foreignField: '_id',
          as: 'job_level'
        }
      },
      {
        $sort: sort
      },
      {
        $project: {
          job_logo: { $arrayElemAt: ["$user.company.avatar", 0] },
          name: 1,
          job_type_name: { $arrayElemAt: ["$job_type.name", 0] },
          job_level_name: { $arrayElemAt: ["$job_level.name", 0] },
          company_name: { $arrayElemAt: ["$user.company.name", 0] },
          job_salary: 1,
          job_addr: 1
        }
      },
      {
        $skip: skip_num
      },
      {
        $limit: limit_num
      }

    ]

    const list_job = await Job.aggregate(filter)

    res.json(list_job)
  } catch (error) {
    console.log(error)
    handleError(error, res)
  }
}

module.exports.getJob = async (req, res) => {
  try {
    const { job_id } = req.params

    let query = { _id: ObjectId(job_id) }

    const filter = [
      {
        $match: query
      },
      {
        $lookup: {
          from: "users",
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: "job_types",
          localField: 'job_type_id',
          foreignField: '_id',
          as: 'job_type'
        }
      },
      {
        $lookup: {
          from: "job_levels",
          localField: 'job_level_id',
          foreignField: '_id',
          as: 'job_level'
        }
      },
      {
        $project: {
          name: 1,
          job_addr: 1,
          job_detail: 1,
          job_salary: 1,
          company_name: { $arrayElemAt: ["$user.company.name", 0] },
          company_logo: { $arrayElemAt: ["$user.company.avatar", 0] },
          job_type_name: { $arrayElemAt: ["$job_type.name", 0] },
          job_level_name: { $arrayElemAt: ["$job_level.name", 0] },
          contact: { $arrayElemAt: ["$user.company.contact", 0] }
        }
      }
    ]

    const job = await Job.aggregate(filter)

    res.json(job)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.createJob = async (req, res) => {
  try {
    const user_id = req.user.principal._id
    const { name, job_type_id, job_level_id, job_salary, job_addr, job_detail, status } = req.body

    let job_obj = {
      user_id,
      job_type_id,
      job_level_id,
      name,
      job_salary,
      job_addr,
      job_detail,
      status,
    }

    const create_job = await Job.create(job_obj)

    res.json(create_job)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.updateJob = async (req, res) => {
  try {
    const _id = req.params.job_id

    let find_job = await Job.findById(_id)
    if (!find_job) throw statusError.bad_request_with_message(`Not found job level by id ${_id}`)

    Object.assign(find_job, { ...req.body })
    const update_job = await find_job.save()

    res.json(update_job)
  } catch (error) {
    handleError(error, res)
  }
}

module.exports.deleteJob = async (req, res) => {
  try {
    const _id = req.params.job_id

    let delete_job = await Job.findOneAndDelete({ _id })
    if (!delete_job) throw statusError.bad_request_with_message(`Not found job_id by ${_id}`)

    res.json(delete_job)
  } catch (error) {
    handleError(error, res)
  }
}