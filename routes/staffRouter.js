const express = require('express');
const router = express.Router();
const auth = require('../middleware/checkUser');
const timeSlotController = require('../controllers/timeSlotController');
const reservationController = require('../controllers/reserveController');

// Time slots
router.get('/timeslots', auth.isAuthenticated, auth.isStaff, timeSlotController.getAllTimeSlots);
router.get('/timeslots/new', auth.isAuthenticated, auth.isStaff, timeSlotController.getNewTimeSlot);
router.post('/timeslots', auth.isAuthenticated, auth.isStaff, timeSlotController.postNewTimeSlot);
router.get('/timeslots/:id/edit', auth.isAuthenticated, auth.isStaff, timeSlotController.getEditTimeSlot);
router.put('/timeslots/:id', auth.isAuthenticated, auth.isStaff, timeSlotController.putEditTimeSlot);
router.delete('/timeslots/:id', auth.isAuthenticated, auth.isStaff, timeSlotController.deleteTimeSlot);

// Reservations
router.get('/reservations', auth.isAuthenticated, auth.isStaff, reservationController.getAllReservations);
router.post('/reservations/:id/confirm', auth.isAuthenticated, auth.isStaff, reservationController.postConfirmReservation);
router.post('/reservations/:id/cancel', auth.isAuthenticated, auth.isStaff, reservationController.postCancelReservation);

module.exports = router;