const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController.js')

router.get('/profile', userController.getUserById)

module.exports = router