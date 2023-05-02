const booking = require('../../../Models/bookingSchema')
const moment = require('moment')

exports.getBookedDetails = async(req,res) => {
    try {
       let data = await booking.aggregate(
            [
                {
                  '$lookup': {
                    'from': 'vehicles', 
                    'localField': 'bikeId', 
                    'foreignField': '_id', 
                    'as': 'result'
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'userId',
                    'foreignField': '_id', 
                    'as': 'res'
                  }
                }, {
                  '$project': {
                    'bikeData': {
                      '$arrayElemAt': [
                        '$result', 0
                      ]
                    }, 
                    'userData': {
                      '$arrayElemAt': [
                        '$res', 0
                      ]
                    }, 
                    'totalHours': 1, 
                    'totalAmount': 1, 
                    'status': 1, 
                    'needHelmet': 1, 
                    'startingTime': '$bookedTimeSlots.startDate', 
                    'endingTime': '$bookedTimeSlots.endDate'
                  }
                }, {
                  '$project': {
                    'userName': '$userData.Name', 
                    'bikeName': '$bikeData.vehicleName', 
                    'bikeModel': '$bikeData.vehicleModel', 
                    'location': '$bikeData.Location', 
                    'photo': '$bikeData.Photo', 
                    'startingTime': 1, 
                    'endingTime': 1, 
                    'totalHours': 1, 
                    'totalAmount': 1, 
                    'status': 1
                  }
                }
              ]
            )
            
            let currentTime = moment().format('X');

            for(let i = 0 ; i < data.length ; i++){
             
              let startTime = moment(data[i].startingTime, 'MMMM Do YYYY, h:mm:ss a').unix();
              let endTime = moment(data[i].endingTime, 'MMMM Do YYYY, h:mm:ss a').unix();
              
              if(currentTime > endTime && data[i].status !== 'Completed'){
                
                booking.findOneAndUpdate(
                  {
                    _id : data[i]._id
                  },
                  {
                    $set : {
                      status : "Time Exceeded"
                    }
                  }
                  ).then((res) => {
                   
                  })
              } else if(currentTime < startTime && data[i].status !== 'Cancelled') {
                
                booking.findOneAndUpdate(
                  {
                    _id : data[i]._id
                  },
                  {
                    $set : {
                      status : "Booked"
                    }
                  }
                  ).then((res) => {
                   
                  })
                
              } else if(currentTime >= startTime && currentTime <= endTime && data[i].status !== 'Completed') {
               
               booking.findOneAndUpdate(
                {
                  _id : data[i]._id
                },
                {
                  $set : {
                    status : "onRide"
                  }
                }
                ).then((res) => {
                 
                })
              }
            }  
            res.status(200).json(data)
    } catch (error) {
        
    }
}