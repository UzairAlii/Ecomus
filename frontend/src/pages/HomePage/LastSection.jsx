import React, { useState, useEffect, useRef } from 'react';

const LastSection = ({ lastSectionData }) => {
  const scrollContainerRef = useRef(null);
  const [screenSize, setScreenSize] = useState("desktop");

  const updateScreenSize = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setScreenSize("desktop");
    } else if (width >= 768) {
      setScreenSize("tablet");
    } else {
      setScreenSize("mobile");
    }
  };

  useEffect(() => {
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const scrollPosition = scrollContainer.scrollLeft;
      const itemWidth = scrollContainer.offsetWidth;
      const index = Math.round(scrollPosition / itemWidth);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () =>
        scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);


  return (
    <div className="flex flex-col items-center justify-center gap-3 px-10 w-full pb-10 pt-20">
      <div
        className={`md:flex-row flex items-center md:justify-between justify-center gap-4 flex-col w-full `}
        ref={scrollContainerRef}
      >
        {lastSectionData.map((item, index) => (
          <div
            key={index}
            className={`text-center flex flex-col items-center gap-5 justify-center border-2 p-5 md:w-1/4`}
          >
            <img
              src={item.image}
              className="w-[40px] h-[40px] object-contain mb-5"
            />
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastSection;

