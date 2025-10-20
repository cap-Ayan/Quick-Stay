import mongoose from "mongoose";

const {Schema,model} = mongoose;

const hotelSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    
    },
    contact:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true,
        ref:'User'
    
    
    },
    city:{
        type:String,
        required:true
    },
    
},{timestamps:true})

const hotelModel = model('Hotel',hotelSchema)

export default hotelModel;