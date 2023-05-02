const userSchema = require("../../Models/userSchema");
const bikeSchema = require("../../Models/vehicleSchema");

exports.getUserHome = (req, res) => {
  try {
    bikeSchema
      .find({
        Status: "Acccepted",
      })
      .limit(3)
      .then((data) => {
        res.status(200).json(data);
      });
  } catch (error) {
    console.log("Error i fetching home bikes", error);
    res.status(500).json("Internal Server Error");
  }
};
