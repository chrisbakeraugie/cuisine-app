const router = require('express').Router()
const homeController = require('../controllers/homeController')

router.get('/contact', homeController.showSignUp)
router.post('/contact', homeController.postedSignUpForm)
router.get('/chat', homeController.chat)

module.exports = router
