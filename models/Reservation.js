const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
        numberOfPeople: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
    },
    { timestamps: true }
)

const Reservation = mongoose.model('Reservation', reservationSchema)
module.exports = Reservation
