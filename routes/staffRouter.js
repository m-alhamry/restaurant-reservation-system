const express = require('express');
const router = express.Router();
const auth = require('../middleware/checkUser');
const timeSlotController = require('../controllers/timeSlotController');
const reservationController = require('../controllers/reserveController');

// Time slots
router.get('/timeSlots', auth.isAuthenticated, auth.isStaff, timeSlotController.getAllTimeSlots);
router.get('/timeSlots/new', auth.isAuthenticated, auth.isStaff, timeSlotController.getNewTimeSlot);
router.post('/timeSlots', auth.isAuthenticated, auth.isStaff, timeSlotController.postNewTimeSlot);
router.delete('/timeSlots/:id', auth.isAuthenticated, auth.isStaff, timeSlotController.deleteTimeSlot);

// Reservations
router.get('/reservations', auth.isAuthenticated, auth.isStaff, reservationController.getAllReservations);
router.post('/reservations/:id/confirm', auth.isAuthenticated, auth.isStaff, reservationController.postConfirmReservation);
router.post('/reservations/:id/cancel', auth.isAuthenticated, auth.isStaff, reservationController.postCancelReservation);

module.exports = router;