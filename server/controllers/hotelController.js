import hotelModel from "../model/hotelModel.js";
import userModel from "../model/userModel.js";


const registerHotel = async (req,res)=>{
    try{
         const {name,address,city,contact} =req.body;
         const owner =req.user._id;
        const hotel = await hotelModel.findOne({owner})
        if(hotel){
            res.json({success:false,message:"Hotel already exists"})
        
        }
         await hotelModel.create({name,address,city,contact,owner})

         await userModel.findByIdAndUpdate(owner,{role:'owner'},{new:true})

         res.json({success:true,message:"Hotel registered"})

    }catch(error){

          res.json({success:false,message:error.message})
    }
}

export default registerHotel;

