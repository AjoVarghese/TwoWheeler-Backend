const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Name : {type : String , required : true},
    LastName : {type : String},
    Email : {type : String , required : true},
    Mobile : {type : Number },
    Password : {type : String,required : false},
    Status : {type : Boolean,default : true,required : true},
    Verfied : {type : String,default : "Not Verified"},
    isGoogle : {type : Boolean , default : false},
    ReferalCode : {type : String},
    Role : {type : String},
    ProfileImage : {type : String ,
        default : "https://d36g7qg6pk2cm7.cloudfront.net/assets/profile-f17aa1dfbd0cb562142f1dcb10bb7ad33e1ac8417ad29a1cdab7dfbfbbfe2f15.png",
        required : true
    }
},{
    timestamps: true,
  }
)

const model = mongoose.model("User",userSchema)

module.exports = model