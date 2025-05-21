const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sign-up', authController.registerUser)
router.post('/sign-in', authController.signInUser)
router.get('/sign-out', authController.signOutUser)
router.put('/update-password', authController.updatePassword)

router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs', { error: null })
})

router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs', { error: null })
})

router.get('/update-password', (req, res) => {
  res.render('./auth/update-password.ejs', { user: req.session.user, error: null } )
})

module.exports = router