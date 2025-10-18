import mongoose from "mongoose";

const{Schema,model}=mongoose;

const roomSchema=new Schema({

    hotel:{
        type:String,
        ref:"Hotel",
        required:true,
    },
    roomType:{
        type:String,
        required:true,
    },
    pricePerNight:{
        type:Number,
        required:true,
    },
    amenities:{
        type:Array,
        required:true
    },

    images:[
        {
            type:String,
        }
    ],
    isAvailable:{
        type:Boolean,
        default:true,
    },


},{timestamps:true})

const roomModel=model("Room",roomSchema)

export default roomModel;