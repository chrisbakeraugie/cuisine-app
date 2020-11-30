const router = require('express').Router()
const subscribersController = require('../controllers/subscribersController')

router.get('/subscribers', subscribersController.getAllSubscribers)
router.get('/subscribe', subscribersController.getSubscriptionPage)
router.post('/subscribe', subscribersController.saveSubscriber)

module.exports = router
