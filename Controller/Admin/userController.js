const userSchema = require('../../Models/userSchema')

exports.getUserDetails = async(req,res) => {
   try {
    const itemsPerPage = 3
    const page = req.query.page || 1
    let pageCount
    let currentPage = parseInt(page)
     userSchema.find()
     .skip((itemsPerPage * page) - itemsPerPage)
     .limit(itemsPerPage)
     .then((data) => {
        userSchema.countDocuments()
        .then((count) => {
          pageCount = Math.ceil(count / itemsPerPage)
          const response = {
            data: data,
            pagination: {
              count: count,
              pageCount: pageCount,
              currentPage : currentPage
            }
          }
          res.status(200).json(response)
        })
     })
   } catch (error) {
    console.log('ERror in fetching users',error);
   }
}