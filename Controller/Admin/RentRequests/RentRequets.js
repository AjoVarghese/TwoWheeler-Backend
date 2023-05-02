const vehicle = require('../../../Models/vehicleSchema')

exports.getRentRequests = async(req,res) => {
   
    try {
        vehicle.find({Status : 'Pending'})
        .sort({ createdAt: -1 })
        .then((data) => {
            
            res.status(200).json(data)
        })
    } catch (error) {
        console.log("Rent req error",error);
    }
}