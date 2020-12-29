const router = require('express').Router()

router.use('/auth', require('./auth.route'))
router.use('/customers', require('./customer.route'))
router.use('/todos', require('./todo.route'))

module.exports = router