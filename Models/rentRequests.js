const mongoose = require("mongoose");

const rentRequetsScheme = new mongoose.Schema(
  {
    OwnerName: { type: String },
    vehicleName: { type: String },
    vehicleModel: { type: String },
    Brand: { type: String },
    EngineNo: { type: String },
    Color: { type: String },
    Fuel: { type: String },
    Description: { type: String },
    Price: { type: Number },
    Photo: [],
    Assured: { type: Boolean, default: false },
    Status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("rentRequets", rentRequetsScheme);

module.exports = model;
