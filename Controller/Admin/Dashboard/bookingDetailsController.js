const bookingSchema = require('../../../Models/bookingSchema')

exports.getPendingBookings = (req,res) => {
    try {
        bookingSchema.find({
            status : "Booked"
        }).count().then((data) => {
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).status("Pending booking error")
        
    }
}

exports.getCancelledBookings = (req,res) => {
    try {
        bookingSchema.find({
            status : "Cancelled"
        }).count().then((data) => {
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).json("Cancelled booking error")
        
    }
}

exports.getOnRideBookings = (req,res) => {
    try {
        bookingSchema.find({
            status : "onRide"
        }).count().then((data) => {
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).json("onRide booking error")
        
    }
}