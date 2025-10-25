import transporter from "../config/nodeMailer.js";
import bookingModel from "../model/bookingsModel.js"
import hotelModel from "../model/hotelModel.js";
import roomModel from "../model/roomModel.js";
import stripe from "stripe"

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

        const mailOptions = {
           from: process.env.SENDER_EMAIL,
    to: req.user.email,
    subject: "Hotel Booking Confirmation",
   
    html: `<h2>Your booking details</h2>
    <p>Dear ${req.user.username},</p>
    <p>Thank You for booking , here are the details of your booking:</p>
    <ul>
        <li>Booking ID: ${booking._id}</li>
        <li>Hotel: ${roomData.hotel.name}</li>
        <li>Hotel Address: ${roomData.hotel.address}</li>
        <li>Check-in Date: ${checkInDate}</li>
        <li>Check-out Date: ${checkOutDate}</li>
        <li>Total Price:${process.env.CURRENCY} ${totalPrice}</li>
    </ul>
    <p>we look forward to seeing you soon.</p>
    


    `, // HTML body
        }

        await transporter.sendMail(mailOptions)

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
 

  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce((acc, booking)=>{
    return acc + booking.totalPrice;
  }, 0);

res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}});

  } catch (error) {
    res.json({success: false, message: error.message});
  }




   
} 

const stripePayment = async(req, res)=>{
  
  try {
     console.log("gh")
    const{bookingId}=req.body;
   
    const booking = await bookingModel.findById(bookingId);
    if(!booking){
      return res.json({success: false, message: "Booking not found"});
    }
    const roomData= await roomModel.findById(booking.room).populate('hotel');
    const totalPrice = booking.totalPrice;
    const{origin}=req.headers;

    if(!roomData){
      return res.json({success: false, message: "Room not found"});
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    
    const line_items = [
      {
        price_data:{
          currency:"usd",
          product_data:{
            name:roomData.hotel.name,
          },
          unit_amount:totalPrice*100,
        
        },
        quantity:1,
      

      }
      ]

      const session = await stripeInstance.checkout.sessions.create({

        mode:"payment",
        line_items,
        success_url:`${origin}/loader/my-bookings`,
        cancel_url:`${origin}/my-bookings`,
        metadata:{
          bookingId,
        }
      })
      res.json({success: true, url:session.url});
  } catch (error) {
    res.json({success: false, message: "Payment failed"});
  }
}

export  {checkAvailabilityApi, createBooking, getUserBookings, getHotelBookings,stripePayment};


