const User = require('../models/User.js')

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('reservations')

const data = {
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNo: user.phoneNo,
    role: user.role,
    picture: user.picture,
    reservations: user.reservations
  }

res.render('./reservations/all.ejs', { user })

    } catch (error) {
        console.error('An error has occurred finding a user!', error.message)
    }
  }

  module.exports = {
    getUserById
  }