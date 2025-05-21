const User = require('../models/User.js')

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.render('users/profile', { error: "User not found!" });
        }
        res.render('users/profile', { user });
    } catch (error) {
        res.render('users/profile', { error: error });
        console.error(error);
    }
};

module.exports = {
    getUserById
}