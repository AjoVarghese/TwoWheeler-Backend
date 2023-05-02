const userSchema = require("../../Models/userSchema");
const wallet = require("../../Models/walletSchema");
const bcrypt = require("bcrypt");
const generateToken = require("../../Utils/generateToken");
const shortid = require("shortid");

exports.signUpPost = async (req, res) => {
  try {
    let email = await userSchema.findOne({ Email: req.body.Email });
    let mobile = await userSchema.findOne({ Mobile: req.body.Mobile });

    let { Name, Email, Mobile, Password } = req.body;

    let details = {
      Name,
      Email,
      Mobile,
      Password,
      ReferalCode: shortid.generate(),
    };

    if (email && mobile) {
      res.status(400).json("Email and Mobile No already exists");
    } else if (email && !mobile) {
      res.status(400).json("Email already exists");
    } else if (mobile && !email) {
      res.status(400).json("Mobile No already Exists");
    } else {
      details.Password = await bcrypt.hash(details.Password, 10);

      userSchema.create(details).then((result) => {
        console.log("RESULT", result);
        let data = {
          Name: result.Name,
          Email: result.Email,
          Mobile: result.Mobile,
          ProfileImage: result.ProfileImage,
          token: generateToken.generateToken(result._id),
          Status: result.Status,
        };
        if (req.body.Referral === "") {
        } else {
          userSchema
            .findOne({ ReferalCode: req.body.Referral })
            .then(async (user) => {
              let walletExists = await wallet.findOne({ userId: user._id });

              if (!walletExists) {
                const newWallet = {
                  userId: user._id,
                  walletAmount: 100,
                  walletHistory: [
                    {
                      Type: "Referral Bonus",
                      amountAdded: 100,
                    },
                  ],
                };

                wallet.create(newWallet).then((data) => {});
              } else {
                wallet
                  .updateOne(
                    { userId: walletExists.userId },
                    {
                      $inc: {
                        walletAmount: 100,
                      },
                      $push: {
                        walletHistory: {
                          Type: "Referral Bonus",
                          amountAdded: 100,
                        },
                      },
                    }
                  )
                  .then((res) => {});
              }
            })
            .catch((err) => {});
          const newUserWallet = {
            userId: result._id,
            walletAmount: 50,
            walletHistory: [
              {
                Type: "Refferal share",
                amountAdded: 50,
              },
            ],
          };
          wallet.create(newUserWallet).then((response) => {});
        }
        res.status(200).json(data);
      });
    }
  } catch (error) {
    console.log("Signup Error", error);
    res.status(500).json("Internal Server Error");
  }
};
