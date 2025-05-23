const Reservation = require('../models/Reservation');
const TimeSlot = require('../models/TimeSlot');

const getAvailableTimeSlots = async () => {
    try {
        const availableTimeSlots = await TimeSlot.find().sort({ date: 1, time: 1 });
        return availableTimeSlots;
    } catch (err) {
        return null;
    }
}

// Customer Reservation methods
const createReservation = async (req, res) => {
    const timeSlotId = req.body.timeSlotId;
    const numberOfPeople = req.body.numberOfPeople;
    try {
        const timeSlot = await TimeSlot.findById(timeSlotId);
        if (!timeSlot) {
            return res.render('./reservations/new.ejs', { availableTimeSlots: await getAvailableTimeSlots(), error: 'Time slot not found!' });
        }
        const numPeople = parseInt(numberOfPeople);
        if (timeSlot.reserved + numPeople > timeSlot.capacity) {
            return res.render('./reservations/new.ejs', { availableTimeSlots: await getAvailableTimeSlots(), error: 'Not enough capacity available' });
        }
        const reservation = new Reservation({
            user: req.session.user.id,
            timeSlot: timeSlotId,
            numberOfPeople: numPeople,
            status: 'pending'
        });
        await reservation.save();
        timeSlot.reserved += numPeople;
        await timeSlot.save();
        res.redirect('./reservations');
    } catch (err) {
        res.render('./reservations/new.ejs', { availableTimeSlots: await getAvailableTimeSlots(), error: 'Unexpected error occured! please try again...' });
        console.error(err);
    }

}

const getNewReservation = async (req, res) => {
    try {
        res.render('./reservations/new.ejs', { availableTimeSlots: await getAvailableTimeSlots(), error: null });
    } catch (err) {
        res.redirect('/');
        console.error(err);
    }
};

const getCustomerReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.session.user.id })
            .populate('timeSlot')
            .sort({ 'timeSlot.date': 1, 'timeSlot.time': 1 });
        res.render('./reservations/all.ejs', { reservations, error: null });
    } catch (err) {
        res.redirect('/');
        console.error(err);
    }
}

const cancelReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, user: req.session.user.id })
            .populate('timeSlot');
        if (!reservation) {
            const reservations = await Reservation.find({ user: req.session.user.id })
                .populate('timeSlot')
                .sort({ 'timeSlot.date': 1, 'timeSlot.time': 1 });
            return res.render('./reservations/all.ejs', { reservations, error: 'Reservation to be cancelled not found!' });
        }
        reservation.status = 'cancelled';
        await reservation.save();
        reservation.timeSlot.reserved -= reservation.numberOfPeople;
        await reservation.timeSlot.save();
        res.redirect('/reservations');
    } catch (err) {
        res.redirect('/');
        console.error(err);
    }
}
// End Customer Reservation methods

// Staff Reservation methods
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user')
            .populate('timeSlot')
            .sort({ 'timeSlot.date': 1, 'timeSlot.time': 1 });
        res.render('staff/reservations/all', { reservations });
    } catch (err) {
        res.redirect('/');
        console.error(err);
    }
};

const postConfirmReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            console.error("Reservation not found!");
            return res.redirect('/staff/reservations');
        }
        reservation.status = 'confirmed';
        await reservation.save();
        res.redirect('/staff/reservations');
    } catch (err) {
        res.redirect('/staff/reservations');
        console.error(err);
    }
};

const postCancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('timeSlot');
        if (!reservation) {
            console.error('Reservation not found');
            return res.redirect('/staff/reservations');
        }
        reservation.status = 'cancelled';
        await reservation.save();
        reservation.timeSlot.reserved -= reservation.numberOfPeople;
        await reservation.timeSlot.save();
        res.redirect('/staff/reservations');
    } catch (err) {
        res.redirect('/staff/reservations');
        console.error(err);
    }
};
// End Staff Reservation methods

module.exports = {
    // for customer
    createReservation,
    getNewReservation,
    cancelReservationById,
    getCustomerReservations,

    // for staff
    getAllReservations,
    postConfirmReservation,
    postCancelReservation
}