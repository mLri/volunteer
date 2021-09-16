const router = require('express').Router()

router.use('/auth', require('./auth.route'))
router.use('/events', require('./event.route'))

module.exports = router