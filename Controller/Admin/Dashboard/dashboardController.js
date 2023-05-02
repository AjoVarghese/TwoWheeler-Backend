const userSchema = require("../../../Models/userSchema");
const bikeSchema = require("../../../Models/vehicleSchema");
const bookingSchema = require("../../../Models/bookingSchema");

exports.getAllDetails = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBikes,
      totalRentRequests,
      totalBookings,
      totalPendingBookings,
      totalOnRide,
      totalCancelled,
      totalPendingRequests,
      totalRejectedRequests,
      totalAcceptedRequests,
    ] = await Promise.all([
      userSchema.countDocuments(),
      bikeSchema.countDocuments({ Status: "Acccepted" }),
      bikeSchema.countDocuments({ Status: "Pending" }),
      bookingSchema.countDocuments(),
      bookingSchema.countDocuments({ status: "Booked" }),
      bookingSchema.countDocuments({ status: "onRide" }),
      bookingSchema.countDocuments({ status: "Cancelled" }),
      bikeSchema.countDocuments({ Status: "Pending" }),
      bikeSchema.countDocuments({ Status: "Rejected" }),
      bikeSchema.countDocuments({ Status: "Acccepted" }),
    ]);

    const bookingTotalAmount = await bookingSchema.aggregate([
      {
        $match: { status: "Completed" },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const data = {
      totalUsers,
      totalBikes,
      totalRentRequests,
      totalBookings,
      totalPendingBookings,
      totalOnRide,
      totalCancelled,
      totalPendingRequests,
      totalRejectedRequests,
      totalAcceptedRequests,
      totalAmountCompletedBookings: bookingTotalAmount[0]?.totalAmount || 0,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json("Cancelled booking error")
    
  }
};
