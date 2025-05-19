const User = require('../models/User.js')
const Reservs = require('../models/Reservation.js')


const createReservation = async (req, res) => {
    try {
        const user = await User.findById(req.body.client)
        const reserving = await Reservs.create(req.body)
        user.reservations.push(reserving._id)
        user.save()
        res.redirect(`/reservations/${reserving._id}`) 
    } catch (error) {
        console.error('An error occured creating a reservation!', error.message)
    }

}

const getReservationById = async (req, res) => {
    try {
        const reserving = await Reservs.findById(req.params.id)
        res.render('./reservations/show.ejs', { reserving })    
    } catch (error) {
        console.error('An error occured getting a reservation', error.message)
    }
}

module.exports = {
    createReservation,
    getReservationById
  }