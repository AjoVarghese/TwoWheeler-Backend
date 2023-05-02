const bookingSchema = require("../../../Models/bookingSchema");
const bikeSchema = require("../../../Models/vehicleSchema");
const walletSchema = require("../../../Models/walletSchema");
const couponSchema = require("../../../Models/couponSchema");
const userSchema = require("../../../Models/userSchema");
const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//global_Variables

const COMPLETED = "Completed"
const CANCELLED = "Cancelled"

exports.bikeBookingController = async (req, res) => {
  const {
    user,
    userName,
    bikeId,
    bikeDetails,
    totalHours,
    totalAmount,
    needHelmet,
    bookedTimeSlots,
    location,
    paymentType,
    couponCode,
  } = req.body.bookingData;
  let session;

  //chcking user status
  let userData = await userSchema.findOne({ _id: user });
  try {
    let startingTime = bookedTimeSlots.startDate;
    let endingTime = bookedTimeSlots.endDate;
    let status = true;

    let check = await bikeSchema.findOne({ _id: bikeId });
    let isBooked = await bookingSchema.findOne({ bikeId: bikeId });

    let currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");

    if (startingTime < currentTime) {
      res
        .status(400)
        .json("Selected Day or Date is less than current day or date");
    } else if (totalHours === 0) {
      res.status(400).json("Rent time should be min 1 hr");
    } else {
      for (let i = 0; i < check.BookedTimeSlots.length; i++) {
        if (startingTime > check.BookedTimeSlots[i].endDate) {
          status = true;
        } else if (
          startingTime &&
          startingTime <= check.BookedTimeSlots[i].endDate &&
          isBooked?.status !== COMPLETED &&
          isBooked?.status !== CANCELLED
        ) {
          status = false;
        }
      }

      //  date Status
      if (status === true) {
        if (paymentType === "Stripe") {
          session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: bikeDetails.vehicleName,
                    images: [bikeDetails.Photo[0]],
                    description: bikeDetails.description,
                    metadata: {
                      bike_id: bikeId,
                      totalHours: totalHours,
                      needHelmet: needHelmet,
                      location: location,
                      startDate: bookedTimeSlots.startDate,
                      endDate: bookedTimeSlots.endDate,
                    },
                  },
                  unit_amount: totalAmount * 100,
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `http://localhost:3000/booking-success?userId=${user}
                        &userName=${userName}&bikeId=${bikeId}&bikeName=${bikeDetails.vehicleName}
                        &bikeModel=${bikeDetails.vehicleModel}&image=${bikeDetails.Photo[0]}
                        &totalAmount=${totalAmount}&totalHours=${totalHours}
                        &startDate=${bookedTimeSlots.startDate}&endDate=${bookedTimeSlots.endDate}
                        &location=${location}&needHelmet=${needHelmet}
                        &paymentType=${paymentType}&couponCode=${couponCode}`,
            cancel_url: "http://localhost:3000/booking-cancelled",
          });

          res.status(200).json({
            url: session.url,
            bookingData: req.body,
            userData: userData,
          });
        } else {
          const booking = new bookingSchema({
            userId: user,
            bikeId: bikeId,
            totalAmount: totalAmount,
            totalHours: totalHours,
            needHelmet: needHelmet,
            bookedTimeSlots: bookedTimeSlots,
            location: location,
            status: "Booked",
            paymentType: paymentType,
            bookedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
            // stripeSessionId: session.id // store the session id for future reference
          });

          try {
            await booking.save();
            console.log("Booking saved successfully");

            // find the bike in the database and update its booking slot field
            const bike = await bikeSchema.findOneAndUpdate(
              { _id: bikeId },
              { $push: { BookedTimeSlots: bookedTimeSlots } },
              { new: true }
            );

            // if the bike does not have any booking slots, create a new array and add the booking slot
            if (!bike.BookedTimeSlots) {
              bike.BookedTimeSlots = [bookedTimeSlots];
              await bike.save();
            }

            //decrement Amount from wallet
            console.log("user", user);

            walletSchema.findOne({ userId: user }).then((data) => {});

            walletSchema
              .updateOne(
                {
                  userId: user,
                },
                {
                  // $set : {
                  $inc: {
                    walletAmount: -totalAmount,
                  },
                  $push: {
                    walletHistory: {
                      Type: "Bike rented",
                      amountDeducted: totalAmount,
                    },
                  },
                  // }
                }
              )
              .then(async (response) => {
                let bikeData = await bikeSchema.findOne({
                  $and: [
                    {
                      _id: bikeId,
                    },
                    {
                      OwnerId: { $exists: true },
                    },
                  ],
                });

                if (bikeData) {
                  let walletExists = await walletSchema.findOne({
                    userId: bikeData.OwnerId,
                  });
                  let withoutCouponAmount;
                  let bookingAmount;
                  let price;

                  //checking if coupon applied
                  if (couponCode !== null) {
                    couponSchema
                      .findOne({
                        couponCode: couponCode,
                      })
                      .then((couponData) => {
                        price = couponData?.couponPrice;
                        withoutCouponAmount =
                          parseInt(totalAmount) + parseInt(price);
                        bookingAmount = withoutCouponAmount * 0.25;

                        if (!walletExists) {
                          const newWallet = {
                            userId: bikeData.OwnerId,
                            walletAmount: withoutCouponAmount * 0.25,
                            walletHistory: [
                              {
                                Type: "Bike rent Share",
                                amountAdded: withoutCouponAmount * 0.25,
                              },
                            ],
                          };

                          walletSchema.create(newWallet);
                        } else {
                          console.log("exists");
                          walletSchema
                            .updateOne(
                              {
                                userId: walletExists.userId,
                              },
                              {
                                $inc: {
                                  walletAmount: withoutCouponAmount * 0.25,
                                },
                                $push: {
                                  walletHistory: {
                                    Type: "Bike Rent Share",
                                    amountAdded: withoutCouponAmount * 0.25,
                                  },
                                },
                              }
                            )
                            .then((response) => {});
                        }
                      });
                  } else if (couponCode === null) {
                    if (!walletExists) {
                      bookingAmount = totalAmount * 0.25;

                      const newWallet = {
                        userId: bikeData.OwnerId,
                        walletAmount: bookingAmount,
                        walletHistory: [
                          {
                            Type: "Bike rent Share",
                            amountAdded: bookingAmount,
                          },
                        ],
                      };

                      walletSchema.create(newWallet);
                    } else {
                      console.log("exists");
                      walletSchema
                        .updateOne(
                          {
                            userId: walletExists.userId,
                          },
                          {
                            $inc: {
                              walletAmount: totalAmount * 0.25,
                            },
                            $push: {
                              walletHistory: {
                                Type: "Bike Rent Share",
                                amountAdded: totalAmount * 0.25,
                              },
                            },
                          }
                        )
                        .then((response) => {});
                    }
                  }
                }

                res.status(200).json({ message: "Booking Successfull" });
              })
              .catch((err) => {});
            // res.status(200).status({message : "Booking Confirmed"})
          } catch (error) {}
        }
      } else {
        console.log("booking not allowed");
        res
          .status(400)
          .json(
            "Bike has been booked for the selected time..please change the time to book"
          );
      }
    }
  } catch (error) {
    console.log("Wallet error", error);
    res.status(400).json("Internal Server Error");
  }
};

//success-page
exports.createOrderController = async (req, res) => {
  try {
    const {
      userId,
      userName,
      bikeId,
      bikeName,
      bikeModel,
      image,
      totalAmount,
      totalHours,
      bookedTimeSlots,
      loc,
      needHelmet,
      paymentType,
      couponCode,
    } = req.body.bookingDetails;
    const booking = new bookingSchema({
      userId: userId,
      bikeId: bikeId,
      totalAmount: totalAmount,
      totalHours: totalHours,
      needHelmet: needHelmet,
      bookedTimeSlots: bookedTimeSlots,
      location: loc,
      status: "Booked",
      paymentType: paymentType,
      bookedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
      // stripeSessionId: session.id // store the session id for future reference
    });

    try {
      await booking.save();
      console.log("Booking saved successfully");

      // find the bike in the database and update its booking slot field
      const bike = await bikeSchema.findOneAndUpdate(
        { _id: bikeId },
        { $push: { BookedTimeSlots: bookedTimeSlots } },
        { new: true }
      );

      // if the bike does not have any booking slots, create a new array and add the booking slot
      if (!bike.BookedTimeSlots) {
        bike.BookedTimeSlots = [bookedTimeSlots];
        await bike.save();
      }
      //setting userId to coupon
      //checking coupon

      if (couponCode !== "null" && couponCode !== "") {
        // let findUser = couponSchema.findOne({users : userId})
        couponSchema
          .updateOne(
            { couponCode: couponCode },
            {
              $push: {
                users: {
                  userId: userId,
                },
              },
            }
          )
          .then((response) => {
            console.log(response);
          });
      }

      //wallet setting
      let bikeData = await bikeSchema.findOne({
        $and: [
          {
            _id: bikeId,
          },
          {
            OwnerId: { $exists: true },
          },
        ],
      });

      if (bikeData) {
        let walletExists = await walletSchema.findOne({
          userId: bikeData.OwnerId,
        });
        let withoutCouponAmount;
        let bookingAmount;
        let price;

        //checking if coupon applied

        if (couponCode !== "null") {
          couponSchema
            .findOne({
              couponCode: couponCode,
            })
            .then((couponData) => {
              price = couponData.couponPrice;

              withoutCouponAmount = parseInt(totalAmount) + parseInt(price);

              bookingAmount = withoutCouponAmount * 0.25;
              if (!walletExists) {
                const newWallet = {
                  userId: bikeData.OwnerId,
                  walletAmount: withoutCouponAmount * 0.25,
                  walletHistory: [
                    {
                      Type: "Bike rent Share",
                      amountAdded: withoutCouponAmount * 0.25,
                    },
                  ],
                };

                walletSchema.create(newWallet);
              } else {
                walletSchema
                  .updateOne(
                    {
                      userId: walletExists.userId,
                    },
                    {
                      $inc: {
                        walletAmount: withoutCouponAmount * 0.25,
                      },
                      $push: {
                        walletHistory: {
                          Type: "Bike Rent Share",
                          amountAdded: withoutCouponAmount * 0.25,
                        },
                      },
                    }
                  )
                  .then((response) => {});
              }
            });
        } else if (couponCode === "null") {
          if (!walletExists) {
            bookingAmount = totalAmount * 0.25;

            const newWallet = {
              userId: bikeData.OwnerId,
              walletAmount: bookingAmount,
              walletHistory: [
                {
                  Type: "Bike rent Share",
                  amountAdded: bookingAmount,
                },
              ],
            };

            walletSchema.create(newWallet);
          } else {
            console.log("exists");
            walletSchema
              .updateOne(
                {
                  userId: walletExists.userId,
                },
                {
                  $inc: {
                    walletAmount: totalAmount * 0.25,
                  },
                  $push: {
                    walletHistory: {
                      Type: "Bike Rent Share",
                      amountAdded: totalAmount * 0.25,
                    },
                  },
                }
              )
              .then((response) => {
                console.log("response", response);
              });
          }
        }
        //
      } else {
        console.log("NOTHING");
      }
    } catch (err) {
      console.log("fffffffff", err);
      res.status(500).send("Server error");
    }
  } catch (error) {
    res.status(400).json("Internal Server Error");
  }
};
