module.exports.jobLevelSchema = {
  createJobLevel: {
    'name': {
      in: ['body'],
      exists: true,
      errorMessage: 'field name is required!',
      matches: {
        options: /^[0-9A-Za-z ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'slug': {
      in: ['body'],
      exists: true,
      errorMessage: 'field slug is required!',
      matches: {
        options: /^[0-9A-Za-z\-\_ ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'status': {
      in: ['body'],
      optional: true,
      isBoolean: {
        errorMessage: 'must be use Boolean type!'
      }
    }
  },
  updateJobLevel: {
    'job_level_id': {
      in: ['params'],
      exists: true,
      errorMessage: 'field job_level_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    },
    'name': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9A-Za-z ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'slug': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9A-Za-z\-\_ ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'status': {
      in: ['body'],
      optional: true,
      isBoolean: {
        errorMessage: 'must be use Boolean type!'
      }
    }
  },
  deleteJobLevel: {
    'job_level_id': {
      in: ['params'],
      exists: true,
      errorMessage: 'field job_level_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    }
  }
}