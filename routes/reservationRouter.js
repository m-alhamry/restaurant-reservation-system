const express = require('express')
const router = express.Router()

const reserveController = require('../controllers/reserveController.js')

router.post('/', reserveController.createReservation)

router.get('/', reserveController.getCustomerReservations)

router.get('/new', reserveController.getNewReservation)

router.get('/new', reserveController.postNewReservation)

router.put('/:id', reserveController.cancelReservationById )

module.exports = router