const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  Email: { type: String, required: true },
  Password: { type: String, required: true },
});

const model = mongoose.model("Admin", adminSchema);

module.exports = model;
