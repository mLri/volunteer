module.exports.jobSchema = {
  listJob: {
    'job_type': {
      in: ['query'],
      optional: true,
      isIn: {
        options: [['FULL_TIME', 'PART_TIME', 'CONTACT', 'INTERNSHIP', 'FREELANCE']],
        errorMessage: 'no enum [FULL_TIME, PART_TIME, CONTACT, INTERNSHIP, FREELANCE]'
      }
    },
    'job_level': {
      in: ['query'],
      optional: true,
      isIn: {
        options: [['ENTRY', 'MIDLE', 'SENIOR']],
        errorMessage: 'no enum [ENTRY, MIDLE, SENIOR]'
      }
    },
    'page': {
      in: ['query'],
      optional: true,
      matches: {
        options: /^[\d]+$/i,
        errorMessage: 'must be use only Number type!'
      }
    },
    'sorted_by': {
      in: ['query'],
      optional: true,
      isIn: {
        options: [['created_at', 'name']],
        errorMessage: 'no enum [created_at, name]'
      }
    },
    'sorted_order': {
      in: ['query'],
      optional: true,
      isIn: {
        options: [['asc', 'desc']],
        errorMessage: 'no enum [asc, desc]'
      }
    },
    'limit': {
      in: ['query'],
      optional: true,
      matches: {
        options: /^[\d]+$/i,
        errorMessage: 'must be use only Number type!'
      }
    }
  },
  getJob: {
    'job_id': {
      in: ['params'],
      exists: true,
      errorMessage: 'field job_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    }
  },
  createJob: {
    'name': {
      in: ['body'],
      exists: true,
      errorMessage: 'field name is required!',
      matches: {
        options: /^[\w\s\-\(\)\,\.]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'job_type_id': {
      in: ['body'],
      exists: true,
      errorMessage: 'field job_type_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    },
    'job_level_id': {
      in: ['body'],
      exists: true,
      errorMessage: 'field job_level_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    },
    'job_salary': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9A-Za-z\,\-]+$/i,
        errorMessage: 'must be use a-z, A-Z, 0-9'
      }
    },
    'job_addr': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[\w\s\(\)\,\-\.]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'job_detail': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[\w\s\(\)\,\-\.]+$/i,
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
  updateJob: {
    'job_id': {
      in: ['params'],
      exists: true,
      errorMessage: 'field job_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    },
    'name': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[\w\s]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'job_type_id': {
      in: ['body'],
      optional: true,
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    },
    'job_level_id': {
      in: ['body'],
      optional: true,
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    },
    'job_salary': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9A-Za-z\,\-]+$/i,
        errorMessage: 'must be use a-z, A-Z, 0-9'
      }
    },
    'job_addr': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[\w\s\(\)\,\-\.]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'job_detail': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[\w\s\(\)\,\-\.]+$/i,
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
  deleteJob: {
    'job_id': {
      in: ['params'],
      exists: true,
      errorMessage: 'field job_id is required!',
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    }
  }
}