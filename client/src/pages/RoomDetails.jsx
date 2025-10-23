import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {assets, facilityIcons, roomCommonData, roomsDummyData} from '../assets/assets'
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';




const RoomDetails = () => {
    const {id} = useParams();
    const [room, setroom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [guests, setGuests] = useState(null)
    const[isAvailable, setIsAvailable] = useState(false)

    const {axios,getToken,navigate} = useAppContext()

   
    const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      
      if (data.success) {
         data.rooms.map((room)=>{
          if(room._id == id){
            setroom(room)
            setMainImage(room.images[0])
          }
         })
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

   const checkAvailability = async () => {
           try {
              if(!checkInDate || !checkOutDate || !guests){
                toast.error('Please fill all the fields')
                return;
              
              }else{
                if(checkInDate>checkOutDate){
                  toast.error('Check-out date cannot be before check-in date')
                  return;
                
                }
                const {data} = await axios.post('/api/bookings/check-availability',{
                  room:id,
                  checkInDate,
                  checkOutDate,
                  
                },{
                  headers:{
                    Authorization: `Bearer ${await getToken()}`
                  }
                })
                if(data.success){
                  setIsAvailable(data.isAvailable)
                  data.isAvailable ? toast.success('Room is available') : toast.error('Room is not available')
                }else{
                  
                  toast.error(data.message)
                }
              }
           } catch (error) {
             toast.error(error.message)
           }
    }

    const onSubmitHandler = async (e) => {
     
      try {
        e.preventDefault();
        if(!isAvailable){
          return checkAvailability();
        }
        else{
          const {data} = await axios.post('/api/bookings/book',{
          room:id,
          checkInDate,
          checkOutDate,
          guests,
          paymentMethod:"Pay At Hotel"
         },{
          headers:{
            Authorization: `Bearer ${await getToken()}`
          }
        })
        if(data.success){
          toast.success(data.message)
          setIsAvailable(false)
          setCheckInDate(null)
          setCheckOutDate(null)
          setGuests(null)
          navigate('/my-bookings')
          scrollTo(0,0)
        }else{
          toast.error(data.message)
        }

        }
      } catch (error) {
         toast.error(error.message)
      }
    }


    useEffect(()=>{
     fetchRooms()

    },[id])
   
  return room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 bg-slate-50 text-gray-800'>
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-2xl md:text-4xl '>{room.hotel.name} <span className='font-light text-sm'>{room.roomType}</span></h1>
        <p className='text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
      </div>

      <div className='flex items-center gap-1 mt-2'>
        <StarRating rating={room.rating}/>
        <p className='ml-2'>200+ Reviews</p>
      </div>

      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.hotel.address}</span>
      </div>

      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img src={mainImage} alt="Room Image" className='w-full rounded-xl shadow-lg object-cover'/>
        </div>
        <div className=' grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {room?.images.length>1 && room.images.map((image,index)=>(<img onClick={()=>{setMainImage(image)}} key={index} src={image} alt="Room Image"
          className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage ==image &&'outline-2 outline-orange-500'}`}/>))}
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:justify-between mt-10'>

        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl'>Experience Luxury Like Never Before </h1>

          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {room.amenities.map((amenity, index) => ( <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
              <img src={facilityIcons[amenity]} alt={amenity} className='w-5 h-5'/>
              <p className='text-xs text-gray-800/90'>{amenity}</p>
            </div>))}
          </div>
        </div>

        <p className='text-xl font-medium'>${room.pricePerNight}/Night</p>

      </div>
      <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px__rgba(0,0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
           <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
            <div className='flex flex-col'>
              <label htmlFor="checkInDate" className='font-medium'>Check In</label>
              <input type="date" placeholder='Check-In' id="checkInDate" onChange={(e)=>setCheckInDate(e.target.value)} value={checkInDate} min={new Date().toISOString().split('T')[0]} className='w-full rounded border-gray-300 px-3 py-2 mt-1.5 outline-none border' required/>
            </div>
             <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
             <div className='flex flex-col'>
              <label htmlFor="checkOutDate" className='font-medium'>Check Out</label>
              <input type="date" onChange={(e)=>setCheckOutDate(e.target.value)} value={checkOutDate } min={checkInDate} disabled={!checkInDate} placeholder='Check-Out' id="checkOutDate" className='w-full rounded border-gray-300 px-3 py-2 mt-1.5 outline-none border '  required/>
            </div>
            <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
             <div className='flex flex-col'>
              <label htmlFor="guests" className='font-medium'>Guests</label>
              <input onChange={(e)=>setGuests(e.target.value)} type="number" value={guests} placeholder='1' id="guests" className='max-w-20 rounded-border border-gray-300 px-3 py-2 mt-1.5 outline-none border' required/>
            </div>
           </div>
           <button type='submit' className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-24 py-3 md:py-4 text-base cursor-pointer'>{isAvailable ? 'Book Now' : 'Check Availability'}</button>
      </form>

      <div className='mt-25 space-y-4'>
        {roomCommonData.map((spec,index)=>(<div className='flex items-start gap-2' key={index}>
          <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5'/>
          <div>
            <p className='text-base'>{spec.title}</p>
            <p className='text-gray-500'>{spec.description}</p>
          </div>
        </div>))}
      </div>

      <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p>Guests will be alocated on the ground floor according to availability, You get a comfortable Two bedrrom apartment has a 
          true city feeling. The price quoted is for two guest ,at the guest slot please mark the number of guests to get the exact price for groups
        </p>
      </div>

      <div className='flex flex-col items-start gap-4'>
        <div className='flex gap-4'>
          <img src={room.hotel.owner.image} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
          <div>
            <p className='text-lg md:text-xl'>Hosted by {room.hotel.owner.username}</p>
            <div className='flex items-center mt-1'>
              <StarRating rating={room.hotel.rating}/>
              <p className='ml-2'>200+ Reviews</p>
            </div>
          </div>
        </div>
        <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>

      </div>

    </div>
  )
}

export default RoomDetails