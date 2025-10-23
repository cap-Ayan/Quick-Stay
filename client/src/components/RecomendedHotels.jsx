import React, { useEffect } from 'react'

import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useState } from 'react'

const RecomendedHotels = () => {

    const {rooms,searchedCities}= useAppContext()
    const [recomended, setRecomended] = useState([])
   const filterHotels = () => {
  if (!Array.isArray(searchedCities)) return; // prevent crash
  const filteredHotels = rooms.filter(room => 
    room?.hotels?.city && searchedCities.slice().includes(room.hotels.city)
  );
  setRecomended(filteredHotels);
};
    useEffect(() => {
        filterHotels();
    }, [searchedCities,rooms]);

  return recomended.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
        <Title title='Recommended Hotels' subTitle='Explore the best places to stay' align='center' font='font-bold'/>
        <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
            {recomended.slice(0,4).map((room,index)=><HotelCard room={room} index={index} key={room._id}/>)}
        </div>
       
    </div>
  )
}

export default RecomendedHotels