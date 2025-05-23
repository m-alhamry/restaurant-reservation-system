const Reservation = require('../models/Reservation');
const TimeSlot = require('../models/TimeSlot');

// Customer Reservation methods
const createReservation = async (req, res) => {
    const { timeSlotId, numberOfPeople } = req.body
    try {
        const timeSlot = await TimeSlot.findById(timeSlotId);
        if (!timeSlot) {
            return res.render('/reservations/new', { error: 'Time slot not found' });
        }
        const numPeople = parseInt(numberOfPeople);
        if (timeSlot.reserved + numPeople > timeSlot.capacity) {
            return res.render('reservations/new', { error: 'Not enough capacity available' });
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
        res.redirect('/reservations');
    } catch (error) {
        res.render('/reservations/new', { error: `An error occured creating a reservation!: ${error.message}` });
        console.error('An error occured creating a reservation!', error.message)
    }

}

const getNewReservation = async (req, res) => {
    try {
        const availableTimeSlots = await TimeSlot.find().sort({ date: 1, time: 1 });
        res.render('reservations/new', { availableTimeSlots, error: null });
    } catch (error) {
        res.render('reservations/new', { error: error });
        console.error(err);
    }
};

const getCustomerReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.session.user.id })
            .populate('timeSlot')
            .sort({ 'timeSlot.date': 1, 'timeSlot.time': 1 });
        res.render('reservations/all', { reservations });
    } catch (error) {
        console.error('An error occured creating a reservation!', error.message);
    }
}

const cancelReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, user: req.session.user.id })
            .populate('timeSlot');
        if (!reservation) {
            return res.render(`./reservations/${req.params.id}`, { error: 'Reservation not found!' })
        }
        reservation.status = 'cancelled';
        await reservation.save();
        reservation.timeSlot.reserved -= reservation.numberOfPeople;
        await reservation.timeSlot.save();
        res.redirect('/reservations');
    } catch (error) {
        res.render(`./reservations/${req.params.id}`, { error: error })
        console.error(error);
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
        console.error(err);
        res.send('Server error');
    }
};

const postConfirmReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.send('Reservation not found');
        }
        reservation.status = 'confirmed';
        await reservation.save();
        res.redirect('/staff/reservations');
    } catch (err) {
        console.error(err);
        res.send('Server error');
    }
};

const postCancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('timeSlot');
        if (!reservation) {
            return res.send('Reservation not found');
        }
        reservation.status = 'cancelled';
        await reservation.save();
        reservation.timeSlot.reserved -= reservation.numberOfPeople;
        await reservation.timeSlot.save();
        res.redirect('/staff/reservations');
    } catch (err) {
        console.error(err);
        res.send('Server error');
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