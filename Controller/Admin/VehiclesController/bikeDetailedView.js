const vehicle = require('../../../Models/vehicleSchema')

exports.bikeDetailsController = async(req,res) => {
    
  try {
      vehicle.findOne({_id : req.query.id}).then((data) => {
       
        res.status(200).json(data)
      })
  } catch (error) {
    console.log("Bike details error",error);
  }
}