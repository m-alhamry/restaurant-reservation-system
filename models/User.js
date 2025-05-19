const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    role: { type: String, required: true },
    picture: { type: String },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref:'User'}],
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User