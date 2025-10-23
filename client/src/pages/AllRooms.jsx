import React from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StarRating from '../components/StarRating';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useMemo } from 'react';

const CheckBox=({label,selected=false, onChange = ()=>{}})=>{
    return(
        <label htmlFor='' className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type="checkbox" name="" id="" checked={selected} onChange={(e)=>onChange(e.target.checked,label)}/>
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton=({label,selected=false, onChange = ()=>{}})=>{
    return(
        <label htmlFor='' className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type="radio" name="sortOption" id="" checked={selected} onChange={()=>onChange(label)}/>
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const AllRooms = () => {
    const [searchParams,setSearchParams] = useSearchParams()
    const {rooms,navigate,currency}=useAppContext()
    
    const [openFilter,setOpenFilter] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        roomType:[],
        priceRange:[]
    })
    const [selectedSort, setSelectedSort] = useState('')

    const roomTypes =[
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite"
    ];

    const priceRange = [
        
        "100 - 200",
        "200 - 300",
        "300 - 500"
    ];

    const sortOptions = [
        "Price: Low to High",
        "Price: High to Low",
        "Rating: High to Low",
        "Rating: Low to High",
        "Newest First"
    ];

    const handleFilterChange = (checked, value,type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[type].push(value);
            }else{
                updatedFilters[type] = updatedFilters[type].filter((filter) => filter !== value);
            }
            return updatedFilters;
            

        })

    }

    const handleSortChange = (value) => {
        setSelectedSort(value)
    }

   //function to check if a room matches the selected filters
   const matchesRoomType= (room)=>{
        return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType)

   }

   const matchesPriceRange = (room)=>{
    return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some((range)=>{
        const[min, max]=range.split(' - ').map(Number)
        return room.pricePerNight >= min && room.pricePerNight <= max ;
    
   })

   }

   const sortRooms = (a,b) =>{
    if(selectedSort === 'Price: Low to High'){
        return a.pricePerNight - b.pricePerNight
    }else if(selectedSort === 'Price: High to Low'){
        return b.pricePerNight - a.pricePerNight
    }else if(selectedSort === 'Rating: High to Low'){
        return b.rating - a.rating
    }else if(selectedSort === 'Rating: Low to High'){
        return a.rating - b.rating
    }else if(selectedSort === 'Newest First'){
        return new Date(b.createdAt) - new Date(a.createdAt)
    }else{
        return 0
    }

   }

   const filterDestination = (room)=>{
    const destination = searchParams.get('destination');
    if(!destination){
        return true;
        
    }
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase())

   }

   const filteredRooms = useMemo(()=>{return rooms.filter(filterDestination).filter(matchesRoomType).filter(matchesPriceRange).sort(sortRooms)
},[rooms,selectedFilters,selectedSort,searchParams])


const clearFilters =()=>{
    selectedFilters({
        roomType:[],
        priceRange:[]
    })
    selectedSort('')
    setSearchParams({})
}

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-12 lg:px-20 xl:px-26 min-h-screen bg-slate-50'>
        <div>
       <div className='flex flex-col items-start text-left'>
        <h1 className='text-4xl md:text-[40px] text-gray-900'>Hotel Rooms</h1>
        <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174 '>Take advamtages of our limited time offers and special packages to enhance tour stay and create unforgottable memories.</p>
       </div>

       {filteredRooms.map((room,index)=>(
        <div key={room._id} className="relative flex flex-col md:flex-row items-start gap-6 bg-white rounded-xs  py-10 border-b border-gray-300 last:pb-30 last:border-0 px-6 md:px-10 mt-6">
            <img src={room.images[0]} alt="hotel-img" className="rounded-t-xl max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer" title='View Room Details' onClick={()=>{navigate(`/rooms/${room._id}`);window.scrollTo(0,0)}}/>
              {index%2===0&& <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>}
              <div className='md:w-1/2 flex flex-col gap-2'>
                <p className='text-gray-500'>{room.hotel.city}</p>
                <p className='text-gray-800 text-3xl cursor-pointer' onClick={()=>{navigate(`/rooms/${room._id}`);window.scrollTo(0,0)}}>{room.hotel.name}</p>
                <div className='flex items-center'>
                    <StarRating />
                    <p className='ml-2'>200+ Reviews</p>

                </div>
                <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                    <img src={assets.locationIcon} alt="location-icon"  />
                    <span>{room.hotel.address}</span>
                </div>
                <div className='flex flex-wrap gap-4 items-center mt-3 mb-6'>
                    {room.amenities.map((amenity,i)=>(
                        <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70' key={i}>
                            <img src={facilityIcons[amenity]} alt={amenity} className='w-5 h-5'/>
                            <span key={i} className='text-xs text-gray-500 inline-block'>{amenity}</span>
                        </div>
                    ))}
                </div>
                <p className='text-xl font-medium text-gray-700'>{currency}{room.pricePerNight} /night</p>
              </div>
        </div>))}
        </div>
        {/* filters */}
        <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
            <div className={`flex items-center justify-between px-6 py-3 border-b border-gray-300 cursor-pointer ${openFilter ? 'border-b': ''}`} onClick={() => setOpenFilter(!openFilter)}>
                <p className='text-base font-medium text-gray-800'>Filters</p>
                <div className='text-xs cursor-pointer text-gray-700'>
                    <span className='lg:hidden cursor-pointer' onClick={() => setOpenFilter(!openFilter)}>{openFilter ? 'Hide' : 'Show'} </span>
                    <span className='cursor-pointer hidden lg:block' onClick={()=>clearFilters()}>CLEAR</span>
                </div>
            </div>

            <div className={`flex flex-col  ${openFilter ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700 ease-in-out`}>
                <div className='px-5 pt-5'>
                    <p className='font-medium text-gray-800 pb-2'>Popular filters</p>

                    {roomTypes.map((type,i)=>(
                        <CheckBox key={i} label={type} selected={selectedFilters.roomType.includes(type)} onChange={(checked)=>{handleFilterChange(checked,type,'roomType')}}/>
                    ))}

                </div>
                <div className='px-5 pt-5'>
                    <p className='font-medium text-gray-800 pb-2'>Price range</p>

                    {priceRange.map((range,i)=>(
                        <CheckBox key={i} label={`${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onChange={(checked)=>{handleFilterChange(checked,range,'priceRange')}} />
                    ))}

                </div>
                <div className='px-5 pt-5 pb-5'>
                    <p className='font-medium text-gray-800 pb-2'>Short By</p>

                    {sortOptions.map((option,i)=>(
                        <RadioButton key={i} label={option} selected={selectedSort === option} onChange={(value)=>{handleSortChange(option)}}/>
                    ))}

                </div>
                </div>
          
        </div>
    </div>
  )
}

export default AllRooms