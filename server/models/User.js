const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Car Owner", "Renter"], required: true }, // Role field added
});

module.exports = mongoose.model("User", userSchema);


