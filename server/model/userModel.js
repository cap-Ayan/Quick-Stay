import mongoose from "mongoose";

const{Schema,model}=mongoose;

const userSchema=new Schema({
    _id:{
        type:String,
        required:true
    },
   username:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   image:{
    type:String,
    required:true
   },
    role:{
        type:String,
        enum :['user','owner'],
        default:'user'
    
    
    },
    recentSearchCities:[{type:String,required:true}]

},{timestamps:true})//when a user created the time automatically get stored

const userModel =model('User',userSchema)

export default userModel;