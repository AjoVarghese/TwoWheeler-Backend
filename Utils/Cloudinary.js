// require('dotenv').config()

// const cloudinary = require('cloudinary').v2
// console.log(process.env.CLOUD_NAME);
// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
// })

// exports.uploads = (file , folder) => {
//     return new Promise(resolve => {
//         cloudinary.uploader.upload(file,(result) => {
//             resolve({
//                 url : result.url,
//                 id : result.public_id
//             })
//         },{
//             resource_type : "auto",
//             folder : folder
//         })
//     })
// }


const cloudinary = require('cloudinary');
const dotenv=require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

exports.uploads = (file, folder) => {
    try {
        return new Promise(resolve => {
            cloudinary.uploader.upload(file, (result) => {
                 console.log("CLOUDINARY RESUKT",result);
                resolve({
                    url: result.url,
                    id: result.public_id
                })
            }, {
                resource_type: "auto",
                folder: folder
            })
        })
    } catch (error) {
        console.log("CLOUD ERROR",error);
    }
    
}