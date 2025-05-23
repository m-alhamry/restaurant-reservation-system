const User = require('../models/User.js')

// RegEx patterns for validation
const nameRegex = /^[a-zA-Z\s-]{2,50}$/; // Allows letters (a-z, A-Z), spaces, and hyphens; min 2 max 50 characters
const phoneRegex = /^\d{8}$/; // Matches exactly 8 digits, for Bahrain phone numbers

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect('/auth/sign-in');
    }
    res.render('users/profile', { user, error: null });
  } catch (err) {
    res.render('users/profile', { user: res.locals.user, error: "Something went wrong!! Please try again..." });
    console.error(err);
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

    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const phoneNo = req.body.phoneNo.trim();

    // Validate user inputs
    if (!firstName || !nameRegex.test(firstName)) {
      return res.render('users/update-profile.ejs', { user, error: 'First name must be 2–50 characters long, and contain only letters, spaces, or hyphens' });
    }
    if (!lastName || !nameRegex.test(lastName)) {
      return res.render('users/update-profile.ejs', { user, error: 'Last name must be 2–50 characters long and contain only letters, spaces, or hyphens' });
    }
    if (phoneNo && !phoneRegex.test(phoneNo)) { // Phone number is optional field
      return res.render('users/update-profile.ejs', { user, error: 'Phone number must be 8 digits (Bahraini phone number)' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNo = phoneNo;

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
    res.render('users/update-profile', { user: res.locals.user, error: 'Failed to update profile' });
  }
};

module.exports = {
  getUserById,
  getUpdateProfile,
  updateProfile,
}