const walletSchema = require("../../../Models/walletSchema");

exports.walletController = (req, res) => {
  try {
    walletSchema.findOne({ userId: req.query.id })
    .sort({ createdAt: -1 })
    .then((data) => {
      res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
