const vehicleSchema = require('../../../Models/vehicleSchema')

exports.viewVehicles = async(req,res) => {

  const itemsPerPage = 3
  const page = req.query.page || 1
  let pageCount
  let currentPage = parseInt(page)
  try {
    vehicleSchema.find({
      
      $and: [
        { Status: 'Acccepted' },
        {
          $or: [
            { OwnerId: { $ne: req.query.id } },
            { OwnerId: { $exists: false } }
          ]
        }
      ]
    })
    .skip((itemsPerPage * page) - itemsPerPage)
    .limit(itemsPerPage)
    .then((data) => {
      
      vehicleSchema.countDocuments({
        $and: [
          { Status: 'Acccepted' },
          {
            $or: [
              { OwnerId: { $ne: req.query.id } },
              { OwnerId: { $exists: false } }
            ]
          }
        ]
      })
      .sort({ createdAt: -1 })
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
      .catch((error) => {
        console.log(error)
        res.status(400).json({ message: 'Error occurred while fetching the count' })
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ message: 'Error occurred while fetching the data' })
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ message: 'Error occurred while fetching the count' })
    })
  } catch (error) {
    console.log(error)
    res.status(400).json("Internal Server Error")
  }
}



