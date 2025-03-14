// D:\VMS\backend\src\models\Checkout.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const checkoutSchema = new mongoose.Schema({
  checkoutId: {
    type: String,
    default: uuidv4, // Automatically generate a UUID if not provided
    unique: true, // Ensure uniqueness
  },
  visitorId: mongoose.Schema.Types.ObjectId,
  name: String,
  company: String,
  phone: String,
  checkInTime: Date,
  checkOutTime: Date,
  purpose: String,
  otp: String
}, { timestamps: true });

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;