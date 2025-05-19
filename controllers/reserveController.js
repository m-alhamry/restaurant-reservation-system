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

const getAllReserve = async (req, res) => {
  try {
    if (user.roll === 'customer') {
        const reserve = await Reserve.find({ customerId: userId })
        res.send(reserve)
    }

    else if (user.roll === 'staff') {
        const reserve = await await Reserve.find({})
        res.send(reserve)
    }

  } catch (error) {
    console.error('An error has occurred getting all reserve!', error.message)
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

const deleteReservationById = async (req, res) => {
  try {
    await Reservs.findByIdAndDelete(req.params.id)
    red.send(`The resevs with ID ${req.params.id} has been deleted successfully!`)
    }
   catch (error) {
    console.error('An error occured deleting a reservation', error.message)

  }
}

module.exports = {
    createReservation,
    getReservationById,
    deleteReservationById,
    getAllReserve
  }