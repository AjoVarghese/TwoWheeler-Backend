var express = require('express');
var router = express.Router();
const upload = require('../../Utils/multer')

const signupController = require('../../Controller/User/userRegisterController')
const loginController = require('../../Controller/User/userLoginController')
const profilerImageUpdateController = require('../../Controller/User/profileImageUpdateController')
const updateProfileController = require('../../Controller/User/updateProfileController')
const userHomeController = require('../../Controller/User/getUserHomeController')
const viewVehiclesController = require('../../Controller/User/Vehicles/VehicleStoreController')
const searchVehiclesController = require('../../Controller/User/Vehicles/searchVehicle')
const singleViewController = require('../../Controller/User/Vehicles/singleViewController')
const userProfileController = require('../../Controller/User/getUserProfileController')
const addVehicleController = require('../../Controller/User/Vehicles/addVehicle')
const getRentedBikesController = require('../../Controller/User/RentedBikes/RentedBikes')
const locationController = require('../../Controller/User/Location/locationController')

const filterbikeController = require('../../Controller/User/Vehicles/filterSortController')
const bookingController = require('../../Controller/User/Booking/BookingController')
const rentedRidesController = require('../../Controller/User/RentedRides/rentedRidesController')
const endRideController = require('../../Controller/User/RentedRides/endRideController')
const payFineController = require('../../Controller/User/RentedRides/payFineController')

const walletController = require('../../Controller/User/Wallet/walletController')
const chatController = require('../../Controller/User/Chat/chatController')
const messageController = require('../../Controller/User/Chat/messageController')
const {protect} = require('../../middleware/jwtAuth');


/* GET home page. */
router.post('/signup',signupController.signUpPost)

router.route('/login').post(loginController.LoginPost)

router.route('/otp-login').post(loginController.otpLoginPost)

router.route('/google-signup').post(loginController.googleSignup)

// router.get('/')
router.route('/home-bikes').get(userHomeController.getUserHome)

router.route('/profile').get(protect,userProfileController.getUserProfile)

router.route('/profileImageUpdate').post(protect,profilerImageUpdateController.profileImageUploadPost)

router.route('/edit-profile').post(protect,updateProfileController.updateProfile)

router.route('/bikes').get(viewVehiclesController.viewVehicles)


router.route('/search-bikes').post(searchVehiclesController.searchBikes)

router.route('/filter-bikes').post(filterbikeController.filterBikes)

router.route('/get-location').get(locationController.getLocations)

router.route('/rent-bikes').post(protect,upload.array('images'),addVehicleController.addVehicle)

router.route('/rented-bikes').get(getRentedBikesController.rentedBikes)

router.route('/accepted-requests').get(getRentedBikesController.acceptedRequests)

router.route('/rejected-requests').get(getRentedBikesController.rejectedRequests)

router.route('/pending-requests').get(getRentedBikesController.pendingRequests)

router.route('/bike-booking').post(bookingController.bikeBookingController)

router.route('/booking-success').post(bookingController.createOrderController)

router.route('/my-rents').get(protect,rentedRidesController.rentedRides)

router.route('/cancel-ride').get(protect,rentedRidesController.cancelRide)

router.route('/end-ride').get(protect,endRideController.endRide)

router.route('/pay-fine').post(protect,payFineController.payFine)

router.route('/payment-success').post(payFineController.paymentSuccess)

router.route('/get-wallet').get(protect,walletController.walletController)


//chat
router.route('/contacts').get(chatController.getAllOwners)

router.route('/add-message').post(chatController.addMessageController)

router.route('/get-all-messages').post(chatController.getAllMessages)

router.route('/send-image').post(chatController.sendImages)



module.exports = router;
