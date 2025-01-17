import React, { useState } from "react";
import { Images } from "../../assets/assets";

const BrandsLogo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    Images.BLogo1,
    Images.BLogo2,
    Images.BLogo3,
    Images.BLogo4,
    Images.BLogo5,
    Images.BLogo6,
  ];

  const itemsPerPageDesktop = 6; 
  const itemsPerPageTablet = 3; 
  const itemsPerPageMobile = 2; 

  const getItemsPerPage = () => {
    if (window.innerWidth >= 1024) {
      return itemsPerPageDesktop; 
    } else if (window.innerWidth >= 768) {
      return itemsPerPageTablet; 
    } else {
      return itemsPerPageMobile; 
    }
  };

  const handleScroll = (direction) => {
    const totalItems = images.length;
    const itemsPerPage = getItemsPerPage();
    if (direction === "next") {
      setCurrentIndex((prevIndex) =>
        prevIndex + itemsPerPage >= totalItems
          ? prevIndex
          : prevIndex + itemsPerPage
      );
    } else if (direction === "prev") {
      setCurrentIndex((prevIndex) =>
        prevIndex - itemsPerPage < 0 ? 0 : prevIndex - itemsPerPage
      );
    }
  };

  const totalPages = Math.ceil(images.length / getItemsPerPage());

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < totalPages; i++) {
      dots.push(
        <span
          key={i}
          onClick={() => setCurrentIndex(i * getItemsPerPage())}
          className={`w-3 h-3 rounded-full mx-2 cursor-pointer ${currentIndex === i * getItemsPerPage() ? "bg-black" : "bg-gray-400"}`}
        ></span>
      );
    }
    return dots;
  };

  return (
    <div className="flex flex-col items-center mt-10 p-10">
      <div className="flex items-center gap-6 overflow-x-scroll snap-x snap-mandatory scrollbar-hide">
        {images.slice(currentIndex, currentIndex + getItemsPerPage()).map((image, index) => (
          <div key={index} className="border p-5">
            <img className="w-52" src={image} alt={`Brand Logo ${index + 1}`} />
          </div>
        ))}
      </div>
      
      {/* Scroll buttons */}
      <div className="mt-5 flex gap-4 lg:hidden">
        <button
          onClick={() => handleScroll("prev")}
          className="text-2xl font-bold text-gray-600 cursor-pointer disabled:opacity-50"
          disabled={currentIndex === 0}
        >
          {"<"}
        </button>
        <button
          onClick={() => handleScroll("next")}
          className="text-2xl font-bold text-gray-600 cursor-pointer disabled:opacity-50"
          disabled={currentIndex + getItemsPerPage() >= images.length}
        >
          {">"}
        </button>
      </div>

      {/* Dots for pagination */}
      <div className="mt-4">{renderDots()}</div>
    </div>
  );
};

export default BrandsLogo;
