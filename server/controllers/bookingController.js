import bookingModel from "../model/bookingsModel.js"
import hotelModel from "../model/hotelModel.js";
import roomModel from "../model/roomModel.js";

const checkAvailability = async({checkInDate, checkOutDate, room})=>{


     try{

        //this will give is there any booked room where the checkin date is on or before desired checkout date and checkoutdate 
        //is on or after desired checkin date
        const bookings = await bookingModel.find({
             room,
             checkInDate:{$lte: checkOutDate},
             checkOutDate:{$gte: checkInDate}
     })

     const isAvailable = bookings.length ===0;
     return isAvailable;


    }catch(error){
      console.error(error.message);
    }
}

const  checkAvailabilityApi = async(req, res)=>{
    try {
        const {checkInDate, checkOutDate, room} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({success: true, isAvailable});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const createBooking = async(req, res)=>{
    try {
        const {checkInDate, checkOutDate, room, guests} = req.body;
        const user =req.user._id;

        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        if(!isAvailable){
            return res.json({success: false, message: "Room not available for the selected dates."})
        }

        const roomData = await roomModel.findById(room).populate('hotel');
        let totalPrice= roomData.pricePerNight;

        //calculate total price based on nights
        const checkInDateObj = new Date(checkInDate);
        const checkOutDateObj = new Date(checkOutDate);
        const timeDiff = checkOutDateObj.getTime() - checkInDateObj.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice *= nights;

        const booking = await bookingModel.create({
            checkInDate,
            checkOutDate,
            room,
            guests:+guests,
            user,
            totalPrice,
            hotel: roomData.hotel._id
        })

        res.json({success: true, message: "Booking created successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


const getUserBookings = async(req, res)=>{
    try {
        const user = req.user._id;
        const bookings = await bookingModel.find({user}).populate('room hotel').sort({createdAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

const getHotelBookings = async(req, res)=>{

  try {
    
    const hotel = await hotelModel.findOne({owner: req.auth().userId});

  if(!hotel){
    return res.json({success: false, message: "Hotel not found"});
  }

  const bookings = await bookingModel.find({hotel: hotel._id}).populate('user room hotel').sort({createdAt: -1});
  res.json({success: true, bookings});

  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce((acc, booking)=>{
    return acc + booking.totalPrice;
  }, 0);

res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}});

  } catch (error) {
    res.json({success: false, message: error.message});
  }




   
} 

export  {checkAvailabilityApi, createBooking, getUserBookings, getHotelBookings};


