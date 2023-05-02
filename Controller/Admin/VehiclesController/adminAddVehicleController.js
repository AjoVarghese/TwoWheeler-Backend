// const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cloudinary = require('../../../Utils/Cloudinary')
const upload = require('../../../Utils/multer')

const vehicleSchema = require('../../../Models/vehicleSchema')


// const storage = multer.diskStorage({
//   destination : path.join(__dirname , '../../../public/Images'),
//   filename : function (req , file , cb) {
//     cb(null , file.originalname)
//   }
// })


exports.addVehicle = async(req,res) => {
     
  try {
    const uploader = async (path) => await cloudinary.uploads(path, 'Images');

    if (req.method === 'POST') {
      const urls = []
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }
  
     
      
    //  let {BikeName,BikeModel,Brand,Fuel,EngineNo,Color,Description,Price} = req.body

    let Photo = [];

    for(let i = 0 ; i < urls.length; i++){
      Photo.push(urls[i].url)
    }
     let details = {
      // OwnerName : req.body.OwnerName,
      vehicleName : req.body.bikeName,
      vehicleModel : req.body.bikeModel,
      Brand : req.body.brand,
      Fuel : req.body.fuel,
      EngineNo : req.body.engineNo,
      Location : req.body.location,
      Color : req.body.color,
      Description : req.body.desc,
      Price : req.body.price,
      Assured : true,
      Status : "Acccepted",
      Photo,
     }

      vehicleSchema.create(details).then((data) => {
         
         res.status(200).json(data)
      } )
  
    } else {
      // res.status(405).json({
      //   err: `${req.method} method not allowed`
      // })
    }
  } catch (error) {
    // console.log("ERROR",error);
    // res.status(400).json("Error Occured",error)
  }
}