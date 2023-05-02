const bookingSchema = require("../../../Models/bookingSchema");

exports.getSalesReport = (req, res) => {
  try {
    bookingSchema.find()
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).json(data);
    });
  } catch (error) {
    console.log("Error in getting sales report", error);
  }
};
