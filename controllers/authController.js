const User = require('../models/User');
const bcrypt = require('bcrypt');

// RegEx patterns for validation
const nameRegex = /^[a-zA-Z\s-]{2,50}$/; // Allows letters (a-z, A-Z), spaces, and hyphens; min 2 max 50 characters
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Standard email formats (user@example.com).
const phoneRegex = /^\d{8}$/; // Matches exactly 8 digits, for Bahrain phone numbers
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // At least one letter, one number, and one special character; min 8 characters

const registerUser = async (req, res) => {
  try {
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const email = req.body.email.trim();
    const phoneNo = req.body.phoneNo.trim();
    const password = req.body.password.trim();
    const confirmPassword = req.body.confirmPassword.trim();

    // Validate user inputs
    if (!firstName || !nameRegex.test(firstName)) {
      return res.render('auth/sign-up.ejs', { error: 'First name must be 2–50 characters long, and contain only letters, spaces, or hyphens' });
    }
    if (!lastName || !nameRegex.test(lastName)) {
      return res.render('auth/sign-up.ejs', { error: 'Last name must be 2–50 characters long and contain only letters, spaces, or hyphens' });
    }
    if (!email || !emailRegex.test(email)) {
      return res.render('auth/sign-up.ejs', { error: 'Invalid email format' });
    }
    if (phoneNo && !phoneRegex.test(phoneNo)) { // Phone number is optional field
      return res.render('auth/sign-up.ejs', { error: 'Phone number must be 8 digits (Bahraini phone number)' });
    }
    if (!password || !passwordRegex.test(password)) {
      return res.render('auth/sign-up.ejs', { error: 'Password must be at least 8 characters long, with at least one letter, one number, and one special character' });
    }
    if (password !== confirmPassword) {
      return res.render('auth/sign-up.ejs', { error: 'Passwords do not match' });
    }

    const userInDatabase = await User.findOne({ email: email });
    if (userInDatabase) {
      return res.render('auth/sign-up.ejs', { error: 'Email already in use' });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const userData = {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNo: phoneNo,
      role: 'customer', // Staff accounts created separately (e.g., by admin)
    };

    // If a file is uploaded, add it to the user data
    if (req.file) {
      // allowed image type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      // Check if the mimetype is not an image type
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        console.error('Error: only image file allowed');
        return res.render('auth/sign-up.ejs', { error: 'Only image file allowed for profile user image' });
      }
      // Check if the file size is more than 1MB
      if (req.file.size > (1024*1024)) {
        console.error('Error: more than 1MB file uploaded!!');
        return res.render('auth/sign-up.ejs', { error: 'Your image file is too large!! Image file size allowed is 1MB maximum.' });
      }
      if(req.file.mimetype)
      userData.picture = {
        data: req.file.buffer, // Binary data from Multer
        contentType: req.file.mimetype, // MIME type (e.g., 'image/jpeg')
      };
    }

    const user = await User.create(userData);
    req.session.user = { id: user._id, role: user.role }; // Store only user ID and user role in session
    res.render('./auth/thanks.ejs', { user: user });
  } catch (err) {
    res.render('auth/sign-up.ejs', { error: 'Something went wrong! Please try again...' });
    console.error(err);
  }
}

const signInUser = async (req, res) => {
  try {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.render('auth/sign-in.ejs', { error: 'Invalid email' });
    }
    const validPassword = bcrypt.compareSync(
      password,
      user.password
    );
    if (!validPassword) {
      return res.render('auth/sign-in.ejs', { error: 'Invalid password' });
    }
    req.session.user = { id: user._id, role: user.role }; // Store only user ID and user role in session
    res.render('./auth/thanks.ejs', { user: user });
  } catch (err) {
    res.render('auth/sign-in.ejs', { error: "Something went wrong! Please try again..." });
    console.error(err);
  }
}

const signOutUser = (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/auth/sign-in');
  } catch (err) {
    res.redirect('/');
    console.error(err);
  }
}

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.render('auth/update-password.ejs', { error: 'No user with that ID exists!' });
    }
    const validPassword = bcrypt.compareSync(
      req.body.oldPassword.trim(),
      user.password
    );
    if (!validPassword) {
      return res.render('auth/update-password.ejs', { error: 'Incorrect old password! Please try again.' });
    }

    // Validate user inputs
    const newPassword = req.body.newPassword.trim();
    const confirmNewPassword = req.body.confirmNewPassword.trim();
    if (!newPassword || !passwordRegex.test(newPassword)) {
      return res.render('auth/update-password.ejs', { error: 'Password must be at least 8 characters long, with at least one letter, one number, and one special character' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.render('auth/update-password.ejs', { error: 'Password and Confirm Password must match' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    res.render('./auth/confirm.ejs', { user: user });
  } catch (err) {
    res.render('auth/update-password.ejs', { error: "An error has occurred updating a user's password! Please try again..." });
    console.error(err);
  }
}

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword
}