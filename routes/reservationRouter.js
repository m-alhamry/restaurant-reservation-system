const express = require('express')
const router = express.Router()

const Reserv = require('../models/Reservation.js')
const reserveController = require('../controllers/reserveController.js')

router.post('/', reserveController.createReservation)

router.get('/new', (req, res) => {
    res.render('./reservations/new.ejs')
  })


router.get('/:id', reserveController.getReservationById)

module.exports = router