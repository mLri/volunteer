const router = require('express').Router()

router.use('/auth', require('./auth.route'))
router.use('/customers', require('./customer.route'))
router.use('/todos', require('./todo.route'))
router.use('/jobtype', require('./job_type.route'))
router.use('/joblevel', require('./job_level.route'))

module.exports = router