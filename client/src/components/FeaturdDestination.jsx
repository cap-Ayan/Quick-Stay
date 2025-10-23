import React from 'react'

import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FeaturdDestination = () => {

    const {rooms,navigate}= useAppContext()
  return rooms.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
        <Title title='Featured Destinations' subTitle='Explore the best places to stay' align='center' font='font-bold'/>
        <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
            {rooms.slice(0,4).map((room,index)=><HotelCard room={room} index={index} key={room._id}/>)}
        </div>
        <button className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-all duration-500 cursor-pointer text-gray-900' onClick={()=>{navigate('/rooms');window.scrollTo(0,0)}}>View All Destination</button>
    </div>
  )
}

export default FeaturdDestination