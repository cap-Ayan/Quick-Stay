import axios from "axios";
import { createContext , useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import {useUser,useAuth} from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export  const AppProvider = ({children})=>{

    const currency=import.meta.env.VITE_CURRENCY || "$";

    const navigate = useNavigate();

    const {user} =useUser()
    const {getToken} = useAuth();

  const [isOwner, setIsOwner] = useState(false)

  const [showHotelReg, setShowHotelReg] = useState(false)

  const [searchedCities, setSearchedCities] = useState([])

  const fetchUSer = async ()=>{
    try {
     const {data} = await axios.get('/api/user',{
            headers:{
                Authorization: `Bearer ${await getToken()}`
            }
        })

        if(data.success){
            setIsOwner(data.role === "owner")
            setSearchedCities(data.recentSearchedCities)
        }
        else{
            //retry fetch user details after 5 sec

            setTimeout(fetchUSer,5000)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }


  useEffect(()=>{
    if(user){
        fetchUSer()
    }
  },[user])





    const value ={
       currency,
       navigate,
       user,
       getToken,
       isOwner,
       setIsOwner,
       showHotelReg,
       setShowHotelReg,
       searchedCities,
       setSearchedCities,
       axios
    }
      
     return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
     )
}

//also we export the useContext from this file so we use the context in any file without using useContext every time it is optional

export const useAppContext = ()=>useContext(AppContext)