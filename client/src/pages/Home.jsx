import React from 'react'
import Hero from '../components/Hero'
import FeaturdDestination from '../components/FeaturdDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'

import Footer from '../components/Footer'
import RecomendedHotels from '../components/RecomendedHotels'

const Home = () => {
  
  return (
    <div className=''><Hero/>
    <RecomendedHotels/>
    <FeaturdDestination/>
    <ExclusiveOffers/>
    <Testimonial/>
    
    
    </div>
    
  )
}

export default Home