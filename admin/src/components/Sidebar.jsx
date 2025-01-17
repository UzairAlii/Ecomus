import React from 'react';
import { NavLink } from 'react-router-dom';
import { Images } from '../assets/assets';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`lg:w-[25%] w-[70%] h-screen bg-[#efeff0] text-black p-2 md:p-7 fixed top-0 
      transition-transform duration-300 ${isSidebarOpen ? "translate-x-[0%]" : "-translate-x-full"} translate-x-[-100%] z-[10000]`}
    >
      <div className='mt-[30px]'>
        {/* Add Product */}
        <NavLink className={({ isActive }) =>
          `block rounded-md mb-2 w-full ${isActive ? "bg-gray-300 font-semibold" : "hover:bg-gray-200"}`
        } to={"/add"}>
          <div onClick={toggleSidebar} className='flex items-center gap-3 px-3 py-2 rounded-lg'>
            <img className='w-6' src={Images.addIcon} alt="" />
            <p className=''>Add product</p>
          </div>
        </NavLink>

        {/* Products */}
        <NavLink className={({ isActive }) =>
          `block rounded-md mb-2 w-full ${isActive ? "bg-gray-300 font-semibold" : "hover:bg-gray-200"}`
        } to={"/list"}>
          <div onClick={toggleSidebar}  className='flex items-center gap-3 px-3 py-2 rounded-lg'>
            <img className='w-8' src={Images.ParcelIcon} alt="" />
            <p className=''>Products</p>
          </div>
        </NavLink>

        {/* Orders */}
        <NavLink className={({ isActive }) =>
          `block rounded-md mb-2 w-full ${isActive ? "bg-gray-300 font-semibold" : "hover:bg-gray-200"}`
        } to={"/orders"}>
          <div  onClick={toggleSidebar} className='flex items-center gap-3 px-3 py-2 rounded-lg'>
            <img className='w-6' src={Images.orderIcon} alt="" />
            <p className=''>Orders</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
