const router = require('express').Router()

router.use('/auth', require('./auth.route'))
router.use('/events', require('./event.route'))
router.use('/book_events', require('./book_event.route'))

module.exports = router