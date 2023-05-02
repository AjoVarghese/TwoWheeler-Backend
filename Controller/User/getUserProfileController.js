const userSchema = require('../../Models/userSchema')

exports.getUserProfile = (req,res) => {
    try {
        userSchema.findOne({_id : req.query.id}).then((data) => {
            res.status(200).json(data)
        })

        .catch((err) => {
            res.status(400).json("PROFILE ERROR",err)
        })
        
    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
}