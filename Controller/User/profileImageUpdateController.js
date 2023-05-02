const userSchema = require("../../Models/userSchema");
const { generateToken } = require("../../Utils/generateToken");

exports.profileImageUploadPost = async (req, res) => {
  let id = req.query.id;
  let photo = req.body.image;
  try {
    userSchema
      .updateOne(
        { _id: id },
        {
          $set: { ProfileImage: photo },
        }
      )
      .then((result) => {
        userSchema.findOne({ _id: id }).then((data) => {
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
    console.log("ERROR", error);
    res.status(500).json("Internal Server Error");
  }
};
