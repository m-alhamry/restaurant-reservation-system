const express = require('express');
const router = express.Router();
const User = require('../models/User');
const uploadImage = require('../middleware/uploadImage');
const auth = require('../middleware/checkUser');
const authController = require('../controllers/authController');

router.post('/sign-up', uploadImage.upload.single('picture'), authController.registerUser)
router.post('/sign-in', authController.signInUser)
router.get('/sign-out', authController.signOutUser)
router.put('/update-password', authController.updatePassword)

router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs', { error: null })
})

router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs', { error: null })
})

router.get('/update-password', auth.isAuthenticated, async (req, res) => {
  let user = null;
  if (req.session.user) {
    user = await User.findById(req.session.user.id);
  }
  res.render('./auth/update-password.ejs', { user: user, error: null })
})

module.exports = router