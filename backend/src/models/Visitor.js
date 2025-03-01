const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Visitor', VisitorSchema);
