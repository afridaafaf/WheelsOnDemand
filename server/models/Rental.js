const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Active", "Completed", "Cancelled"],
    default: "Active"
  },
  totalCost: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Rental", rentalSchema);