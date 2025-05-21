const express = require('express');
const router = express.Router();
const auth = require('../middleware/checkUser');
const userController = require('../controllers/userController.js');

router.get('/profile', auth.isAuthenticated, userController.getUserById)

module.exports = router