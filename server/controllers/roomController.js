import hotelModel from "../model/hotelModel.js";

import {v2 as cloudinary} from "cloudinary"
import roomModel from "../model/roomModel.js";


const createRoom = async (req,res)=>{
  try {
    const {roomType,pricePerNight,amenities} =req.body;
    const hotel = await hotelModel.findOne({owner:req.auth().userId})
    if(!hotel){
       return res.json({success:false,message:"Hotel not found"})
    }

    //upload images to cloudnary

    const uploadImages = req.files.map(async (file)=>{
      const response =   await cloudinary.uploader.upload(file.path)

      return response.secure_url;
    
    })

   const images = await Promise.all(uploadImages)

   await roomModel.create({hotel:hotel._id,roomType,pricePerNight: +pricePerNight,amenities:JSON.parse(amenities),images})

   res.json({success:true,message:"Room created"})






  } catch (error) {
    res.json({success:false,message:error.message})
  }
}



//api to get all rooms
const getRooms = async (req,res)=>{

    try{
      const rooms =  await roomModel.find({isAvailable:true}).populate({
        path: 'hotel',
        populate: {
            path: 'owner' ,
            select: 'image'
        }
      }).sort({createdAt: -1})

      res.json({success:true, rooms})
    }catch(error){
      res.json({success:false,message:error.message})
    }

}

//Api to get room for a specific hotel
const getOwnerRooms = async (req,res)=>{
    try{
        const hotelData = await hotelModel.findOne({owner: req.auth().userId})
        const rooms = await roomModel.find({hotel:hotelData._id.toString()}).populate('hotel')

        res.json({success:true, rooms})
    }catch(error){
      res.json({success:false,message:error.message})
    }
}

//Api to toggle availability of a room

const toggleAvailability = async (req,res)=>{
    try {
       const {roomId} = req.body;
       
       const roomData = await roomModel.findById(roomId);

       roomData.isAvailable = !roomData.isAvailable;
       await roomData.save();
       res.json({success:true,message:"Availability toggled"})

       
    } catch (error) {
        res.json({success:false,message:error.message})

    }

}

export {createRoom,getRooms,getOwnerRooms,toggleAvailability}