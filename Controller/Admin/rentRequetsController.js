const vehicleSchema = require('../../Models/vehicleSchema')
const requetsSchema = require('../../Models/rentRequests')
const userSchema = require('../../Models/userSchema')

exports.acceptRequetsController = async(req,res) => {
    
    vehicleSchema.updateOne({_id : req.query.id},
    {
        $set : {
            Status : "Acccepted"
        }
    }
    ).then(() => {
         
         userSchema.updateOne({
            _id : req.query.owner
         },
         {
            $set : {
                Role : "Bike Owner"
            } 
         }).then(() => {
          
         })
         vehicleSchema.find({Status : "Pending"}).then((data) => {
            
            res.status(200).json(data)
        })
    })
}

exports.rejectRequestsController = async(req,res) => {
    
    vehicleSchema.updateOne({_id : req.query.id},
    {
        $set : {
            Status : "Rejected"
        }
    }
    ).then(() => {
        vehicleSchema.find({Status : "Pending"}).then((data) => {
        
           res.status(200).json(data)
        })
    })
}