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
    'file': {
      in: ['body'],
      optional: true, /* set optional true for use schema name 'file' when use func validateSchema */
      isString: {
        errorMessage: 'must be use String type!'
      }
    },
  }
}