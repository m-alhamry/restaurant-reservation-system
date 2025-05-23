const TimeSlot = require('../models/TimeSlot');
const Reservation = require('../models/Reservation');

const getAllTimeSlots = async (req, res) => {
    try {
        const timeSlots = await TimeSlot.find().sort({ date: 1, time: 1 });
        res.render('staff/timeSlots/all.ejs', { timeSlots: timeSlots });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

const getNewTimeSlot = (req, res) => {
    res.render('staff/timeSlots/new', { error: null });
};

const postNewTimeSlot = async (req, res) => {
    try {
        const timeSlot = new TimeSlot({
            date: new Date(req.body.date),
            time: req.body.time,
            capacity: parseInt(req.body.capacity),
            reserverd: 0
        });
        await timeSlot.save();
        res.redirect('/staff/timeSlots');
    } catch (err) {
        console.error(err);
        res.render('staff/timeSlots/new', { error: "Unexpected error occurs! Please try again..." });
    }
};

const deleteTimeSlot = async (req, res) => {
    try {
        await TimeSlot.findByIdAndDelete(req.params.id);
        await Reservation.deleteMany({ timeSlot: req.params.id });
        res.redirect('/staff/timeSlots');
    } catch (err) {
        console.error(err);
        res.render('staff/timeSlots/new', { error: "Unexpected error occurs! Please try again..." });
    }
};

module.exports = {
  getAllTimeSlots,
  getNewTimeSlot,
  postNewTimeSlot,
  deleteTimeSlot,
}