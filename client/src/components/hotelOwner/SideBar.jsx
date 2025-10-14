import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const SideBar = () => {

    const sidebarLinks=[
        {name:"Dashboard",path:"/owner",icon:assets.dashboardIcon},
        {name:"Add Room",path:"/owner/add-room",icon:assets.addIcon},
        {name:"List Room",path:"/owner/list-room",icon:assets.listIcon}
       
    ]
  return (
    <div className='md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300'>
          {sidebarLinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${isActive ? 'bg-gray-200 border-right-4 border-indigo-500' : ''}`
              }
            >
              <img src={link.icon} alt={link.name} className="min-w-6 min-h-6" />
              <span className="hidden md:inline text-center">{link.name}</span>
            </NavLink>
          ))}
    </div>
  )
}

export default SideBar