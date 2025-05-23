const express = require('express')
const router = express.Router()
const auth = require('../middleware/checkUser');
const reserveController = require('../controllers/reserveController.js')

router.post('/', auth.isAuthenticated, auth.isCustomer, reserveController.createReservation)

router.get('/', auth.isAuthenticated, auth.isCustomer, reserveController.getCustomerReservations)

router.get('/new', auth.isAuthenticated, auth.isCustomer, reserveController.getNewReservation)

router.put('/:id', auth.isAuthenticated, auth.isCustomer, reserveController.cancelReservationById )

module.exports = router