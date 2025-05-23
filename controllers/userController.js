const User = require('../models/User.js')

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect('/auth/sign-in');
    }
    res.render('users/profile', { user, error: null });
  } catch (error) {
    res.render('users/profile', { error: error });
    console.error(error);
  }
};

const getUpdateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect('/auth/sign-in');
    }
    res.render('users/update-profile', { user, error: null });
  } catch (err) {
    console.error(err);
    res.redirect('/users/profile');
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect('/auth/sign-in');
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phoneNo = req.body.phoneNo;

    if (req.file) {
      user.picture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await user.save();
    res.redirect('/users/profile');
  } catch (err) {
    console.error(err);
    res.render('users/update-profile', { user, error: 'Failed to update profile' });
  }
};

module.exports = {
  getUserById,
  getUpdateProfile,
  updateProfile,
}