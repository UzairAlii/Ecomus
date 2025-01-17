import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, name, img = [], price, discounted_price, customClass, customClassTwo, customClassThree, color = [], sizes = [] }) => {
  const { currency } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(img[0]);

  const validColors = Array.isArray(color) ? color : [];

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div
        className='relative overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full md:w-[250px] lg:w-[280px] rounded-lg'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false); 
          setCurrentImage(img[0]); 
        }}
      >
        <img
          className={`absolute top-0 left-0 h-full w-full object-cover ${customClass} transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          src={currentImage}
          alt={name} 
        />

        {img[1] && (
          <img
            className={`absolute top-0 left-0 h-full w-full object-cover ${customClass}  duration-500 transform transition-transform ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}
            src={isHovered ? img[1] : currentImage}
            alt={name} 
          />
        )}

        <div className={`absolute bottom-0 left-0 w-full transition-transform duration-300 transform ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          {sizes && sizes.length > 0 && (  
            <div className="sizes-box p-2 rounded-t-lg shadow-lg">
              <p className="text-center text-white font-semibold text-xs md:text-sm">
                {sizes.join('  ')}
              </p>
            </div>
          )}
        </div>

      </div>

      <div>
        <p className={`pt-3 pb-1 text-[15px] sm:text-[15px] md:text-md lg:text-lg text-black w-full ${customClassThree}`}>{name}</p>
      </div>

      <div className='flex items-center gap-[5px]'>
        {price && discounted_price ? (
          <>
            <p className='strikethrough-text text-gray-500 text-sm md:text-md'>{currency}{price}</p>
            <p className='text-black flex items-center gap-[5px]'>From <span className={` text-sm md:text-md font-bold text-red-700 ${customClassTwo}`}>{currency}{discounted_price}</span></p>
          </>
        ) : discounted_price ? (
          <p className='text-black'><span className='text-black text-sm md:text-md font-bold '>{currency}{discounted_price}</span></p>
        ) : null}

      </div>

      <div className="color flex items-center pt-3 gap-[5px] ">
        {validColors.map((c, index) => ( 
          <div key={index} className='relative group'>
            <div
              className='color-circle-outer-div '
              onMouseEnter={() => {
                setCurrentImage(img[index]); 
              }}
            >
              <div
                className='color-circle-inner-div'
                style={{ backgroundColor: typeof c === 'string' ? c : '#000' }} 
              ></div>
            </div>
            <div className="absolute bottom-full mb-2 w-max bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {typeof c === 'string' ? c : 'Invalid Color'}
            </div>
          </div>
        ))}
      </div>
    </Link>
  );
}

export default ProductItem;