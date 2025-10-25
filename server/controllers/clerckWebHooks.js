import userModel from "../model/userModel.js";
import { Webhook } from "svix";


const webHook = async (req,res)=>{
    try{
        //create a svix instance with clerk webhook secret
          const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
         //getting headers 
          const headers = {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"],
          };

          await whook.verify(JSON.stringify(req.body),headers)

          //getting data from request body

          const {data,type}= req.body;

         

          //switch case for different events

          switch(type){
            case 'user.created':{
               const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name+ " " +data.last_name,
            image:data.image_url,

          }
              await userModel.create(userData)
              break;
        }
            case 'user.updated':{
               const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name+ " " +data.last_name,
            image:data.image_url,

          }
                await userModel.findByIdAndUpdate(data.id,userData,{new:true})
                break;
        }
            case 'user.deleted':{
            
                await userModel.findByIdAndDelete(data.id)
                break;
            }
            default:
                break;
       
          }

          res.json({success : true , message : "Webhook verified"})
    }catch(error){

        console.log(error.message)
        res.json({success : false , message : error.message})
    


    }
}

export default webHook;