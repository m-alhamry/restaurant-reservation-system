const User = require('../models/User.js')

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

const data = {
    first: user.first,
    last: user.last,
    picture: user.picture
  }

res.render('./users/profile.ejs', { user })

    } catch (error) {
        console.error('An error has occurred finding a user!', error.message)
    }
  }

  module.exports = {
    getUserById
  }