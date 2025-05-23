const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: String },
    role: { type: String, enum: ['customer', 'staff'], default: 'customer' },
    picture: {
      data: Buffer, // Store binary data
      contentType: String, // Store MIME type (e.g., 'image/jpeg')
    },
  },
  { timestamps: true }
);

// Virtual property to generate data URL for the image
userSchema.virtual('pictureUrl').get(function () {
  if (this.picture && this.picture.data) {
    return `data:${this.picture.contentType};base64,${this.picture.data.toString('base64')}`;
  }
  return null;
});

const User = mongoose.model('User', userSchema)
module.exports = User