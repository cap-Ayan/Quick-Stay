import React, { useEffect } from 'react'
import { useState } from 'react'
import { roomsDummyData } from '../../assets/assets'
import Title from '../../components/Title'
import { useActionState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { useCallback } from 'react'



const ListRoom = () => {
  const [room, setRoom] = useState([])
  const{axios,getToken,user,currency} =useAppContext()

  //Fetch rooms of owner
 const fetchRooms = useCallback(async () => {
  try {
    const { data } = await axios.get('/api/rooms/owner', {
      headers: {
        Authorization: `Bearer ${await getToken()}`
      }
    });

    if (data.success) {
      setRoom(data.rooms);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}, [axios, getToken]);

  //Toggle availability of the room

 const toggleAvailability = useCallback(async (roomId) => {
  try {
    const { data } = await axios.post(`/api/rooms/toggle-availability`, { roomId }, {
      headers: {
        Authorization: `Bearer ${await getToken()}`
      }
    });

    if (data.success) {
      toast.success(data.message);
      fetchRooms(); // safe to call because fetchRooms is memoized
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}, [axios, getToken, fetchRooms]);

  useEffect(()=>{
    if(user){
      fetchRooms()
    }
  },[user])

  return (
    <div>
      <Title align={'left'} font={'outfit'} title={'Room Listing'} subTitle={'View, edit , or manage all losted rooms. keep the information up-to-date to provide the best experience for users'}/>
      <p className='text-gray-500 mt-8'></p>
       <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
                <tr>
                    <th className='py-3 px-4 text-gray-800 font-medium'> Name</th>
                    <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                    <th className='py-3 px-4 text-gray-800 font-medium '>Price / Night</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Action</th>
                </tr>

            </thead>

            <tbody className='text-sm'>
              {
                room.map((item, index) => (
                  <tr key={index}>
                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                      {item.roomType}
                    </td>
                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                       {item.amenities.join(',  ')}
                    </td>

                     <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                      {currency}{item.pricePerNight}
                    </td>
                    <td className='py-3 px-4 text-sm text-red-500 border-t border-gray-300 text-center'>
                     <label htmlFor="" className='relative inline-flex items-center cursor-pointer  text-gray-900 gap-3' onClick={() => toggleAvailability(item._id)}>
                      <input type="checkbox" className='sr-only peer' checked={item.isAvailable}  readOnly/>
                      <div className={`w-12 h-7 rounded-full ${item.isAvailable ?'bg-blue-600':'bg-gray-300'} transition-colors duration-200`}>

                      </div>

                      <span className='dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'></span>
                     </label>
                    </td>
                  </tr>
                ))

              }
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default ListRoom;