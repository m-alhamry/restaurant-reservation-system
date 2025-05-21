const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ email: req.body.email })
    if (userInDatabase) {
      return res.render('auth/sign-up.ejs', { error: 'Email already in use' });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.render('auth/sign-up.ejs', { error: 'Password and Confirm Password must match' });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      picture: req.body.picture,
      role: req.body.role //"costumer", // Staff accounts created separately (e.g., by admin)
    })
    await user.save();
    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      role: user.role,
    }
    res.render('./auth/thanks.ejs', { user: user })
  } catch (err) {
    res.render('auth/sign-up.ejs', { error: `Registration failed: ${err}` });
    console.error('An error has occurred registering a user!', err.message)
  }
}

const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.render('auth/sign-in.ejs', { error: 'Invalid email' });
    }
    const validPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    )
    if (!validPassword) {
      return res.render('auth/sign-in.ejs', { error: 'Invalid password' });
    }
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      role: user.role,
    }
    res.render('./auth/thanks.ejs', { user })
  } catch (err) {
    res.render('auth/sign-in.ejs', { error: err });
    console.error('An error has occurred signing in a user!', err)
  }
}

const signOutUser = (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/auth/sign-in')
  } catch (err) {
    console.error('An error has occurred signing out a user!', err.message)
  }
}

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id)
    if (!user) {
      return res.render('auth/update-password', { error: 'No user with that ID exists!' });
    }
    const validPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.render('auth/update-password', { error: 'Incorrect old password! Please try again.' });
    }
    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.render('auth/update-password', { error: 'Password and Confirm Password must match' });
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
    user.password = hashedPassword
    await user.save()
    res.render('./auth/confirm.ejs', { user })
  } catch (error) {
    res.render('auth/update-password', { error: "An error has occurred updating a user's password!" });
    console.error(
      "An error has occurred updating a user's password!",
      error.message
    )
  }
}

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword
}