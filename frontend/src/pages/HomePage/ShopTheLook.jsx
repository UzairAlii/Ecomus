import React from 'react'
import { useState, useEffect, useRef } from 'react';
import "./HomePage.css"

const ShopTheLook = ({shopTheLookImages}) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const scrollPosition = scrollContainer.scrollLeft;
        const itemWidth = scrollContainer.offsetWidth;
        const index = Math.round(scrollPosition / itemWidth);
        setCurrentIndex(index);
      }
    };
  
    const handleDotClick = (index) => {
      setCurrentIndex(index);
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const itemWidth = scrollContainer.offsetWidth;
        scrollContainer.scrollTo({
          left: index * itemWidth,
          behavior: "smooth", 
        });
      }
    };
  
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
      }
    }, []);


  return (
    <div className='flex flex-col gap-5 mt-6 text-center relative'>
        <h1 className='text-[45px] font-normal'>Shop the look</h1>
        <p>Inspire and let yourself be inspired, from one unique fashion to another.</p>
        <div
          className="flex items-center mt-6 overflow-x-scroll snap-container"
          ref={scrollContainerRef}
        >
          {shopTheLookImages.map((image, index) => (
            <img
              key={index}
              id={`image-${index}`}
              className={`snap-item w-full md:w-1/2 ${
                index === currentIndex ? "active-image" : ""
              }`}
              src={image}
              alt={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="dots flex justify-center mt-4 md:hidden">
          {shopTheLookImages.map((_, index) => (
            <div
              key={index}
              className={`big-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            >
              <span className="small-dot"></span>
            </div>
          ))}
        </div>
    </div>
  )
}

export default ShopTheLook