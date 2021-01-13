module.exports.customerSchema = {
  updateCustomer: {
    'customer_id': {
      in: ['params'],
      isMongoId: {
        errorMessage: 'must be use MongoID type!'
      }
    },
    'first_name': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9A-Za-z ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'last_name': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9A-Za-z ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'file': {
      in: ['body'],
      optional: true, /* set optional true for use schema name 'file' when use func validateSchema */
      matches: {
        options: /^[0-9A-Za-z ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
  },
  updateCompany: {
    'customer_id': {
      in: ['params'],
      isMongoId: {
        errorMessage: 'must be use MongoID type!'
      }
    },
    'name': {
      in: ['body'],
      exists: true,
      errorMessage: 'Field name is required!',
      matches: {
        options: /^[0-9A-Za-z\' ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'slug': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9A-Za-z\- ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'file': {
      in: ['body'],
      optional: true, /* set optional true for use schema name 'file' when use func validateSchema */
      matches: {
        options: /^[0-9A-Za-z ]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'info': {
      in: ['body'],
      optional: true,
      matches: {
        options: /[\w\s]/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'addr': {
      in: ['body'],
      optional: true,
      matches: {
        options: /[\w\s\(\)\,\-\.]/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'tel': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[0-9\-]+$/i,
        errorMessage: 'must be use 0-9'
      }
    },
    'email': {
      in: ['body'],
      optional: true,
      isEmail: {
        errorMessage: 'must be use Email format or required!'
      }
    },
    'link': {
      in: ['body'],
      optional: true,
      matches: {
        options: /[\w\s\(\)\,\-\.\:\/]/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    }
  }
}