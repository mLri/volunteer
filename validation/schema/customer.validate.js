const { checkSchema } = require('express-validator')

module.exports = {
  validateCustomer: {
    updateCustomer: () => {
      return checkSchema({
        'customer_id': {
          in: ['params'],
          isMongoId: {
            errorMessage: 'must be use MongoID type!'
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
        }
      })
    }
  }
}