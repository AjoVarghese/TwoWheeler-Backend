const vehicle = require("../../../Models/vehicleSchema");

exports.singleViewController = (req, res) => {
  console.log("IDDD", req.query.id);
  try {
    vehicle.find({ _id: req.query.id }).then((data) => {
      res.status(200).json(data);
    });
  } catch (error) {
    console.log("Some errror", error);
    res.status(500).json("Internal Server Error");
  }
};
