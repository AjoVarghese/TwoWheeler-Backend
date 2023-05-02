const adminSchema = require('../../Models/adminSchema')
const bcrypt = require('bcrypt')
const generateToken = require('../../Utils/generateToken')


exports.adminSignupPost = async(req,res) => {
   console.log("ADMIn SGNUP",req.body);
   try {
     let {Email,Password} = req.body
     let details = {Email,Password}
    
     details.Password = await bcrypt.hash(details.Password,10)
     adminSchema.create(details).then((data) => {
        
        let result = {
            Email : data.Email,
            Password : data.Password,
            token : generateToken.generateToken(data._id)
        }
      
        res.status(200).json(result)
     })
   } catch (error) {
     res.status(400).json(error)
   }
}