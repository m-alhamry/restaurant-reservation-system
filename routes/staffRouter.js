const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');
const reservationController = require('../controllers/reserveController');

// Time slots
router.get('/timeslots', timeSlotController.getAllTimeSlots);
router.get('/timeslots/new', timeSlotController.getNewTimeSlot);
router.post('/timeslots', timeSlotController.postNewTimeSlot);
router.get('/timeslots/:id/edit', timeSlotController.getEditTimeSlot);
router.put('/timeslots/:id', timeSlotController.putEditTimeSlot);
router.delete('/timeslots/:id', timeSlotController.deleteTimeSlot);

// Reservations
router.get('/reservations', reservationController.getAllReservations);
router.post('/reservations/:id/confirm', reservationController.postConfirmReservation);
router.post('/reservations/:id/cancel', reservationController.postCancelReservation);

module.exports = router;