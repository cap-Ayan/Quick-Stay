import React from 'react'
import Nav from './components/Nav'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import Footer from './components/Footer';
import RoomDetails from './pages/RoomDetails';
import NotFound from './pages/NotFound';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import LayOut from './pages/hotelOwner/LayOut';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';
import Loader from './components/Loader';

  const App = () => {
   const isOwnerPath = window.location.pathname.includes('/owner');
   
  const {showHotelReg}= useAppContext()
  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <Nav />}
    { showHotelReg&&<HotelReg/>}
    
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/rooms' element={<AllRooms/>}/>
        <Route path='/rooms/:id' element={<RoomDetails/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
         <Route path='/loader/:nextUrl' element={<Loader/>}/>

        <Route path='/owner' element={<LayOut/>}>
        <Route index element={<Dashboard/>}/> 
        <Route path='add-room' element={<AddRoom/>}/>
        <Route path='list-room' element={<ListRoom/>}/>
        </Route>
        

        
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
      </div>
      </div>

  )
}

export default App
