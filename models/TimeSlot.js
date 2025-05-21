const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        time: { type: String, required: true },
        capacity: { type: Number, required: true },
        reserved: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema)
module.exports = TimeSlot