import React, { useEffect } from 'react'
import NavBar from '../../components/hotelOwner/NavBar'
import SideBar from '../../components/hotelOwner/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const LayOut = () => {
  const {isOwner,navigate}=useAppContext()

  useEffect(()=>{
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])
  return (
    <div className='flex flex-col h-screen bg-white text-gray-800'>
           <NavBar/>
           <div className='flex h-full'>
            <SideBar/>
            <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
                <Outlet/>
            </div>
           </div>
    </div>
  )
}

export default LayOut