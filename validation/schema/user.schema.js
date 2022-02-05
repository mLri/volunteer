module.exports.userSchema = {
  signin: {
    'username': {
      in: ['body'],
      isString: {
        errorMessage: 'must be use String type or required!'
      },
    },
    'password': {
      in: ['body'],
      optional: false,
      isString: {
        errorMessage: 'must be use String type!'
      }
    }
  },
  signup: {
    'employee_id': {
      in: ['body'],
      isString: {
        errorMessage: 'must be use String type!'
      }
    },
    'prefix': {
      in: ['body'],
      isString: {
        errorMessage: 'must be use String type!'
      }
    },
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
    'institution': {
      in: ['body'],
      isString: {
        errorMessage: 'must be use String type!'
      }
    },
    'tel': {
      in: ['body'],
      isString: {
        errorMessage: 'must be use String type!'
      }
    },
    'username': {
      in: ['body'],
      exists: {
        errorMessage: 'Missing property'
      },
      isString: {
        errorMessage: 'must be use String type or required!'
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
    },
    'email': {
      in: ['body'],
      isEmail: {
        errorMessage: 'must be use email format'
      }
    },
    'role': {
      in: ['body'],
      optional: true,
      isIn: {
        options: [['admin', 'user']],
        errorMessage: 'no enum [admin, user]'
      }
    }
  },
  refresh_token: {
    'refresh_token': {
      in: ['body'],
      exists: {
        errorMessage: 'Missing property'
      },
      isString: {
        errorMessage: 'must be use String type!'
      }
    }
  }
}