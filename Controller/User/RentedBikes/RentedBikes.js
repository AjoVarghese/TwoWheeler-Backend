const vehicle = require("../../../Models/vehicleSchema");

const PENDING = "Pending"
const REJECTED = "Rejected"
const ACCEPTED = "Acccepted"

exports.rentedBikes = async (req, res) => {
  try {
    vehicle.find({ OwnerId: req.query.id })
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

exports.acceptedRequests = async (req, res) => {
  try {
    vehicle
      .find({ $and: [{ OwnerId: req.query.id }, { Status: ACCEPTED }] })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.status(200).json(data);
      });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

exports.rejectedRequests = async (req, res) => {
  try {
    vehicle
      .find({ $and: [{ OwnerId: req.query.id }, { Status: REJECTED}] })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.status(200).json(data);
      });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

exports.pendingRequests = async (req, res) => {
  try {
    vehicle
      .find({ $and: [{ OwnerId: req.query.id }, { Status: PENDING }] })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.status(200).json(data);
      });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
