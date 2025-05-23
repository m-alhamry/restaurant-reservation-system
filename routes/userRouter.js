const express = require('express');
const router = express.Router();
const uploadImage = require('../middleware/uploadImage');
const auth = require('../middleware/checkUser');
const userController = require('../controllers/userController.js');

router.get('/profile', auth.isAuthenticated, userController.getUserById);

router.get('/profile/update', auth.isAuthenticated, userController.getUpdateProfile);

router.post('/profile/update', auth.isAuthenticated, uploadImage.upload.single('picture'), userController.updateProfile);

module.exports = router