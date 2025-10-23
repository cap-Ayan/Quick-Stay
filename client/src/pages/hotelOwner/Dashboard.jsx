import React from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useEffect } from 'react'



const Dashboard = () => {
   const{currency, user, getToken , axios} = useAppContext()
    const [dashBoardData,setDashBoardData] = useState({
        bookings:[],
        totalBookings:0,
        totalRevenue:0
    })

    const  fetchDashboardData = async () => {
        try {
            const {data} = await axios.get('api/bookings/hotel',{
                headers:{
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            if(data.success){
                setDashBoardData(data.dashboardData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(user){
            fetchDashboardData()
        }
    },[user])

  return (
    <div>
        <Title align={"left"} font={'outfit'} title={'Dashboard'} subTitle={'Monitor your room listnings, tack bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations'}/>
        <div className='flex gap-4 my-8'>
            <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
               <img src={assets.totalBookingIcon} alt="totalbooking icon" className='max-sm:hidden h-10' />
               <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-blue-500 text-lg'>Total Bookings</p>
                <p className='text-neutral-400 text-base'>{dashBoardData.totalBookings}</p>
               </div>
            </div>

             <div>
                 <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
               <img src={assets.totalRevenueIcon} alt="totalbooking icon" className='max-sm:hidden h-10' />
               <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-blue-500 text-lg'>Total Revenue</p>
                <p className='text-neutral-400 text-base'>{currency} {dashBoardData.totalRevenue}</p>
               </div>
            </div>
           </div>
           

      </div>

      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        <table className='w-full'>
            <thead className='bg-gray-50'>
                <tr>
                    <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                    <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
                </tr>

            </thead>
            <tbody className='text-sm'>
                 {dashBoardData.bookings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              dashBoardData.bookings.map((booking, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {booking.user?.username || 'N/A'}
                  </td>
                  <td className="max-sm:hidden py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    {booking.room?.roomType || 'N/A'}
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700 border-t border-gray-300">
                    {currency}
                    {booking.totalPrice}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300">
                    <button
                      className={`py-1 px-3 text-xs rounded-full mx-auto block ${
                        booking.isPaid ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'
                      }`}
                    >
                      {booking.isPaid ? 'Paid' : 'Unpaid'}
                    </button>
                  </td>
                </tr>
              ))
            )}


            </tbody>

        </table>

      </div>

  </div>
)
}

export default Dashboard;