const vehicle = require('../../../Models/vehicleSchema')

exports.deleteBike = async(req,res) => {
   
    try {
        vehicle.deleteOne({_id : req.query.id}).then(() => {
            vehicle.find({Status : "Acccepted"}).then((data) => {
                
                res.status(200).json(data)
            })
        })
    } catch (error) {
        
    }
}