const express = require('express')
const router = express.Router()

const Reserv = require('../models/Reservation.js')
const reserveController = require('../controllers/reserveController.js')

router.post('/', reserveController.createReservation)

router.get('/', reserveController.getAllReserve)

router.get('/new', (req, res) => {
    res.render('./reservations/new.ejs')
  })


router.get('/:id', reserveController.getReservationById)

router.delete('/:id', reserveController.deleteReservationById )

module.exports = router