import React from 'react';
import { Images } from '../assets/assets';

const Navbar = ({ setToken, toggleSidebar }) => {
  return (
    <div className='flex w-full h-fit'>
      <div className="admin-nav flex items-center justify-between px-5 py-3 md:py-5 md:px-10 w-full z-40">
        <div className=''>
          {/* Bars Icon */}
          <img 
            src={Images.bars} 
            alt="Menu" 
            onClick={toggleSidebar} 
            className="cursor-pointer"
          />
        </div>
        <div className='logo'>
          <img className='w-[25vw] md:w-[8vw]' src={Images.logo} alt="" />
          <p className='text-[5vw] md:text-2xl font-semibold'>Admin Panel</p>
        </div>
        <div>
          <button 
            onClick={() => setToken('')} 
            className='px-5 py-2 bg-black rounded-lg text-white text-sm'>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
