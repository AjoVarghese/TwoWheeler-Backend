const bikes = require("../../../Models/vehicleSchema");
const booking = require("../../../Models/bookingSchema");

exports.endRide = (req, res) => {
  let bikeId = req.query.bikeId.trim();
  let bookingId = req.query.bookingId;
  let startTime = req.query.startTime;
  let endTime = req.query.endTime;
  let userId = req.query.userId;

  try {
    bikes
      .updateOne(
        {
          _id: bikeId,
        },
        {
          $pull: {
            BookedTimeSlots: {
              startDate: startTime,
              endDate: endTime,
            },
          },
        }
      )
      .then((resp) => {
        booking
          .updateOne(
            {
              _id: bookingId,
            },
            {
              $set: {
                status: "Completed",
              },
            }
          )
          .then((result) => {
            booking
              .aggregate([
                {
                  $match: {
                    userId: userId,
                  },
                },
                {
                  $lookup: {
                    from: "vehicles",
                    localField: "bikeId",
                    foreignField: "_id",
                    as: "result",
                  },
                },
                {
                  $project: {
                    bikeData: {
                      $arrayElemAt: ["$result", 0],
                    },
                    totalHours: 1,
                    totalAmount: 1,
                    location: 1,
                    needHelmet: 1,
                    status: 1,
                    startingTime: "$bookedTimeSlots.startDate",
                    endingTime: "$bookedTimeSlots.endDate",
                  },
                },
                {
                  $project: {
                    bikeId: "$bikeData._id",
                    bikeName: "$bikeData.vehicleName",
                    bikeModel: "$bikeData.vehicleModel",
                    color: "$bikeData.Color",
                    totalHours: 1,
                    totalAmount: 1,
                    location: 1,
                    needHelmet: 1,
                    startingTime: 1,
                    endingTime: 1,
                    status: 1,
                    photo: "$bikeData.Photo",
                  },
                },
              ])
              .then((data) => {
                res.status(200).json(data);
              });
          });
      });
  } catch (error) {
    console.log("error in end ride", error);
    res.status(500).json("Internal Server Error");
  }
};
