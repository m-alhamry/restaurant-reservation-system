const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    Reservation: {type: String, require: true},
    date: { type: String, require: true},
    time: { type: String, require: true},
    how_many: { type: String, require: true},
    client : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservs', required: true}],
},
    {timestamps: true}  
)

const Reservs = mongoose.model('Reservs', reservationSchema)
module.exports = Reservs

