 const getUserData = async (req,res)=>{
    try{
        const role =req.user.role;
        const recentSearchCities =req.user.recentSearchCities;
        res.json({success : true , role , recentSearchCities})
    }
    catch(error){
        res.json({success : false , message : error.message})
    
    }

}

const storeRecentSearch = async (req,res)=>{
    try{
         const {recentSearchCity} =req.body;
         console.log(recentSearchCity)
         const user =req.user;
         if(!user.recentSearchCities.includes(recentSearchCity)&& user.recentSearchCities.length<3){
            user.recentSearchCities.push(recentSearchCity)
           
         }else{
            user.recentSearchCities.shift()
             user.recentSearchCities.push(recentSearchCity)
           
         }
          await user.save()
          res.json({success:true,message:"City added"})
 
         
    }
    catch(error){
        res.json({success : false , message : error.message})
    
    }
}

export  {getUserData,storeRecentSearch}

