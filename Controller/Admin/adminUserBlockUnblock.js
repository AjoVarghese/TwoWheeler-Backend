const userSchema = require('../../Models/userSchema')

exports.userBlockUnBlockPost = async(req,res) => {
    console.log("USR ID",req.query.id);
    try {
        userSchema.findOne({_id:req.query.id})
        .sort({ createdAt: -1 })
        .then((result)=>{
            userSchema.updateOne({_id:req.query.id},{$set:{Status:!result.Status}}).then((data)=>{
                userSchema.findOne({_id:req.query.id})
                .sort({ createdAt: -1 })
                .then((data)=>{
                    res.status(200).json(data)
                })
            })
            
        })
       
        
    } catch (error) {
        console.log("BLOCK UNBLOCK ERROR");
        res.status(400).json("SOME ERROR",error.message
        )
    }
}