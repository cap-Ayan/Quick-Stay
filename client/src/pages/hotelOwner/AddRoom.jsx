import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {

  const{axios,getToken} = useAppContext()
  

  const [images,setImages] = useState({
    1:null,
    2:null,
    3:null,
    4:null
  })

  const[inputs,setInputs] =useState({
    roomType: '',
    pricePerNight: 0,
    aminities: {
      'Free WiFi':false,
      'Free Breakfast':false,
      'Room Service':false,
      'Mountain View':false,

    }
  })
  const [loading,setLoading] = useState(true)

  const onSubmitHandler = async (e)=>{
    e.preventDefault();

    //check if all inputs are filled

    if(!inputs.roomType || !inputs.pricePerNight || !Object.values(inputs.aminities).includes(true)|| !Object.values(images).some(image=>image)){
         toast.error("please fill all the fields")
         return;
    }

    setLoading(true)

    try {
      const formData = new FormData();
      formData.append('roomType',inputs.roomType)
      formData.append('pricePerNight',inputs.pricePerNight)

      const ammenities = Object.keys(inputs.aminities).filter(amenity=>inputs.aminities[amenity])
      formData.append('amenities',JSON.stringify(ammenities))

      Object.keys(images).forEach((key)=>{
       images[key] &&formData.append(`images`,images[key])
      })

      const {data} = await axios.post('/api/rooms',formData,{
        headers:{
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if(data.success){
        toast.success(data.message)
        setImages({
    1:null,
    2:null,
    3:null,
    4:null
  })
        setInputs({
    roomType: '',
    pricePerNight: 0,
    aminities: {
      'Free WiFi':false,
      'Free Breakfast':false,
      'Room Service':false,
      'Mountain View':false,

    }
  })
        
      }
      else{
        toast.error(data.message)
       
      }

      
    } catch (error) {
      toast.error(error.message)
    }finally{
         setLoading(false)
    }


  }

  return (
    <form onSubmit={onSubmitHandler}>
      <Title align={'left'} title={'Add Room'} subTitle={'Fill in the details carefully and accurate room details to enhance the user booking experience'}/>

      <p className='text-gray-800 mt-10'>Images</p>

      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key)=>(
          <label htmlFor={`roomImage${key}`} key={key}>
            <img src={images[key] ? URL.createObjectURL(images[key]):assets.uploadArea} alt="upload image" className='max-h-13 cursor-pointer opacity-80' />
            <input type="file" name="" id={`roomImage${key}`} accept='image/*' hidden onChange={(e)=>{setImages({...images,[key]:e.target.files[0]})}} />
          </label>
        ))}
      </div>

      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
             <div className='flex-1 max-w-48'>
                     <p className='text-gray-800 mt-4'>Room Type</p>
                     <select value={inputs.roomType} className='border opacity-70 border-gary-300/60 mt-1 rounded p-2 w-full outline-none' onChange={(e)=>{setInputs({...inputs,roomType:e.target.value})}}>
                      <option >Select Room Type</option>
                      <option value="Single Bed">Single Bed</option>
                      <option value="Double Bed">Double Bed</option>
                      <option value="Luxury Room">Luxury Room</option>
                      <option value="Family Suite">Family Suite</option>
                     </select>
             </div>

             <div>
              <p className='mt-4 text-gray-800'>
                Price <span className='text-xs'>/night</span>
              </p>
              <input type="number" name="" id="" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24 outline-none' value={inputs.pricePerNight} onChange={ e=>setInputs({...inputs,pricePerNight:e.target.value})}/>
             </div>
      </div>

      <p className='text-gray-800 mt-4'>Amenities</p>

      <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
           {Object.keys(inputs.aminities).map((key,i)=>(
            <div key={i}>
              <input type="checkbox" name="" id={`amenities${i+1}`} checked={inputs.aminities[key]} onChange={e=>setInputs({...inputs,aminities:{...inputs.aminities, [key]:!inputs.aminities[key]}})} className='bg-transparent'/>
              <label htmlFor={`amenities${i+1}`}> {key}</label>
            </div>
           ))}
      </div>
      <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer' disabled={loading}>{loading ? 'Loading...':'Add Room'}</button>
    </form>
  )
}

export default AddRoom