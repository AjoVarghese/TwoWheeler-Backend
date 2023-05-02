const vehicleSchema = require("../../../Models/vehicleSchema");
const rentRequetsScheme = require("../../../Models/rentRequests");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../../../Utils/Cloudinary");
const upload = require("../../../Utils/multer");

exports.addVehicle = async (req, res) => {
  try {
    const uploader = async (path) => await cloudinary.uploads(path, "Images");

    if (req.method === "POST") {
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }

      let Photo = [];

      for (let i = 0; i < urls.length; i++) {
        Photo.push(urls[i].url);
      }
      let details = {
        OwnerId: req.query.id,
        vehicleName: req.body.bikeName,
        vehicleModel: req.body.bikeModel,
        Brand: req.body.brand,
        Fuel: req.body.fuel,
        Location: req.body.location,
        EngineNo: req.body.engineNo,
        Color: req.body.color,
        Description: req.body.desc,
        Price: req.body.price,
        Assured: false,
        Status: "Pending",
        Photo,
      };

      vehicleSchema.create(details).then((data) => {
        res.status(200).json(data);
      });
    } else {
      // res.status(405).json({
      //   err: `${req.method} method not allowed`
      // })
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
