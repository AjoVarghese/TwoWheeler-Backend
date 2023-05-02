const adminSchema = require('../../Models/adminSchema')
const bcrypt = require('bcrypt')
const generateToken = require('../../Utils/generateToken')


exports.adminLoginPost = async(req,res) => {
   
    try {
        let {Email,Password} = req.body
        let details = {Email,Password}
       
         adminSchema.findOne({Email : details.Email}).then((data) => {
            
            if(data){
              bcrypt.compare(details.Password,data.Password,(err,response) => {
                if(response){
                    
                    let result = {
                        Email : data.Email,
                        token : generateToken.generateToken(data._id)
                    }
                    res.status(200).json(result)
                } else {
                    
                    res.status(400).json("Incorrect Password")
                }
              })
            } else {
                
                res.status(400).json("Email doesn't exists")
            }
         })
        .catch((error) => {
            console.log("ADMIN LOGIN ERROR",error);
            res.status(400).json(error)
        })
    } catch (error) {
        
    }
}