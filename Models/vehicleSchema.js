const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  OwnerId: { type: String },
  vehicleName: { type: String },
  vehicleModel: { type: String },
  Brand: { type: String },
  EngineNo: { type: String },
  Location: { type: String },
  Color: { type: String },
  Fuel: { type: String },
  Description: { type: String },
  Price: { type: Number },
  Photo: [],
  BookedTimeSlots: [
    {
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
    },
  ],
  Assured: { type: Boolean, default: true },
  Status: { type: String },
},{
    timestamps: true,
  }
);

const model = mongoose.model("Vehicles", vehicleSchema);

module.exports = model;
