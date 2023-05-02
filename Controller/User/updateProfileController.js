const User = require("../../Models/userSchema");
const { generateToken } = require("../../Utils/generateToken");
exports.updateProfile = async (req, res) => {
  try {
    User.updateMany(
      { _id: req.query.id },
      {
        $set: {
          Name: req.body.name,
          Email: req.body.email,
          Mobile: req.body.mobile,
        },
      }
    ).then(() => {
      User.findOne({ _id: req.query.id }).then((data) => {
        let { id, Name, Email, Mobile, Status, ProfileImage } = data;
        let result = {
          id,
          Name,
          Email,
          Mobile,
          Status,
          ProfileImage,
          token: generateToken(id),
        };
        res.status(200).json(result);
      });
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
