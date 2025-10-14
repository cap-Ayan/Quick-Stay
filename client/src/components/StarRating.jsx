import React from 'react'
import { assets } from '../assets/assets'

const StarRating = ({rating=4}) => {
  return (
    <div className='flex items-center justify-center '>
    {Array(5).fill(0).map((_,index)=>(<img key={index} src={rating >index ? assets.starIconFilled:assets.starIconOutlined} alt="star-icon" className='w-4 h-4'/>) )}
    </div>
  )
}

export default StarRating