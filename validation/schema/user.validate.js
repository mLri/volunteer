const { checkSchema } = require('express-validator')

module.exports = {
  validateUser: {
    signin: () => {
      return checkSchema({
        'username': {
          in: ['body'],
          isEmail: {
            errorMessage: 'must be use Email format or required!'
          },
        },
        'password': {
          in: ['body'],
          optional: false,
          isString: {
            errorMessage: 'must be use String type!'
          }
        }
      })
    },
    signup: () => {
      return checkSchema({
        'first_name': {
          in: ['body'],
          optional: true,
          isString: {
            errorMessage: 'must be use String type!'
          }
        },
        'last_name': {
          in: ['body'],
          optional: true,
          isString: {
            errorMessage: 'must be use String type!'
          }
        },
        'username': {
          in: ['body'],
          exists: {
            errorMessage: 'Missing property'
          },
          isEmail: {
            errorMessage: 'must be use Email format or required!'
          },
        },
        'password': {
          in: ['body'],
          exists: {
            errorMessage: 'Missing property'
          },
          isString: {
            errorMessage: 'must be use String type!'
          }
        }
      })
    },
    refresh_token: () => {
      return checkSchema({
        'refresh_token': {
          in: ['body'],
          exists: {
            errorMessage: 'Missing property'
          },
          isString: {
            errorMessage: 'must be use String type!'
          }
        }
      })
    }
  }
}