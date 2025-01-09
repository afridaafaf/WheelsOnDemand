const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  model: { type: String, required: true },
  licensePlate: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Available", "Reserved", "On Rent", "Under Maintenance"],
    default: "Available",
  },
  category: {
    type: String,
    enum: ["Economy", "Luxury", "SUV", "Van"],
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  features: [String],
  year: { type: Number, required: true },
  transmission: {
    type: String,
    enum: ["Automatic", "Manual"],
    required: true
  },
  fuelType: {
    type: String,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    required: true
  },
  seats: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Vehicle", vehicleSchema);