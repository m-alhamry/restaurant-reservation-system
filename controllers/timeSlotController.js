const TimeSlot = require('../models/TimeSlot');

const getAllTimeSlots = async (req, res) => {
    try {
        const timeSlots = await TimeSlot.find().sort({ date: 1, time: 1 });
        res.render('staff/timeslots/all', { timeSlots: timeSlots });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
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
        res.redirect('/staff/timeslots');
    } catch (err) {
        console.error(err);
        res.render('staff/timeSlots/new', { error: err });
    }
};

const getEditTimeSlot = async (req, res) => {
    try {
        const timeSlot = await TimeSlot.findById(req.params.id);
        if (!timeSlot) {
            return res.status(404).send('Time slot not found');
        }
        res.render('staff/timeSlots/edit', { timeSlot, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const putEditTimeSlot = async (req, res) => {
    try {
        const timeSlot = await TimeSlot.findById(req.params.id);
        if (!timeSlot) {
            return res.send('Time slot not found');
        }
        timeSlot.date = new Date(req.body.date);
        timeSlot.time = req.body.time;
        timeSlot.capacity = parseInt(req.body.capacity);
        await timeSlot.save();
        res.redirect('/staff/timeslots');
    } catch (err) {
        console.error(err);
        res.send(err);
    }
};

const deleteTimeSlot = async (req, res) => {
    try {
        await TimeSlot.findByIdAndDelete(req.params.id)
        res.redirect('/staff/timeslots');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = {
  getAllTimeSlots,
  getNewTimeSlot,
  postNewTimeSlot,
  getEditTimeSlot,
  putEditTimeSlot,
  deleteTimeSlot,
}