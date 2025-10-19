import userModel from "../model/userModel.js";

//middleware to check if the user is authenticated 

 const protect = async (req,res,next)=>{
     const {userId} = req.auth()

     if(!userId){
        res.json({success : false , message : "Unauthorized"})
        return
     }
     const user = await userModel.findById(userId)
     req.user = user
     next()


}

export default protect;