import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Images } from '../../assets/assets.js'
import { NavLink } from 'react-router-dom'

const catogeries = () => {

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); 
  const [startX, setStartX] = useState(0); 
  const [isAtStart, setIsAtStart] = useState(true); 
  const [isAtEnd, setIsAtEnd] = useState(false); 
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollWidth, setMaxScrollWidth] = useState(0); 

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = 300 + 24; 
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
      setScrollPosition(scrollRef.current.scrollLeft - scrollAmount);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = 300 + 24; 
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setScrollPosition(scrollRef.current.scrollLeft + scrollAmount);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); 
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setIsAtStart(scrollLeft === 0); 
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };
  
  useEffect(() => {
    if (scrollRef.current) {
      const updateMaxScrollWidth = () => {
        setMaxScrollWidth(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
      };
      updateMaxScrollWidth();
      window.addEventListener('resize', updateMaxScrollWidth);
      return () => window.removeEventListener('resize', updateMaxScrollWidth);
    }
  }, []);

  const leftButtonStyle = scrollPosition <= 0 ? { opacity: 0.2, cursor: 'not-allowed' } : {};
  const rightButtonStyle = scrollPosition >= maxScrollWidth ? { opacity: 0.2, cursor: 'not-allowed' } : {};

  return (
    <div className='catogeries-container mt-10 h-[90vh] p-10'>


      <div className="catogeries-header flex gap-2 items-center">
        <div className="left-right-scroll flex items-center gap-2">
        <div onClick={handleScrollLeft} className='hover:bg-black hover:text-white hover:transition-all rounded-full h-[30px] w-[30px] border-[1px] border-black flex items-center justify-center' style={leftButtonStyle}>
          <FontAwesomeIcon className='text-[12px]' icon={faChevronLeft} />
        </div>

        <div onClick={handleScrollRight} className='hover:bg-black hover:text-white hover:transition-all rounded-full h-[30px] w-[30px] border-[1px] border-black flex items-center justify-center' style={rightButtonStyle}>
          <FontAwesomeIcon className='text-[12px]' icon={faChevronRight} />
        </div>
        </div>

        <h1 className='font-bold px-[20px] text-lg'>SHOP BY CATEGORIES</h1>
      </div>



      <div className="all-catogeries mt-10 flex">
        <div className="categories-items relative flex gap-[20px] w-[75%] overflow-x-scroll cursor-grab active:cursor-grabbing " ref={scrollRef} 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove} 
        onMouseUp={handleMouseUp} 
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd} >


          <NavLink to={"/NewArrival"}>
            <div className="Fashion-box categories-boxes h-[350px] w-[300px] rounded-md overflow-hidden relative">
              <img className='w-full h-full hover:scale-[1.1] transition-all' src={Images.fashionBoxImg} alt="" />
              <div className='fashionBox-div categories-boxes-div absolute bottom-8 left-5 bg-white py-[10px] px-[25px] rounded-md flex items-center gap-2 transition-all'>
                <p>New Arrival</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Accessories"}>
            <div className="Accessories-box categories-boxes h-[350px] w-[300px] rounded-md overflow-hidden relative">
              <img className='w-full h-full hover:scale-[1.1] transition-all' src={Images.SunglassesBoxImg} alt="" />
              <div className='AcessoriesBox-div categories-boxes-div absolute bottom-8 left-5 bg-white py-[10px] px-[25px] rounded-md flex items-center gap-2 transition-all'>
                <p>Accessories</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Handbag"}>
            <div className="handbag-box categories-boxes h-[350px] w-[300px] rounded-md overflow-hidden relative">
              <img className='w-full h-full hover:scale-[1.1] transition-all' src={Images.HandbagBoxImg} alt="" />
              <div className='handbag-div categories-boxes-div absolute bottom-8 left-5 bg-white py-[10px] px-[25px] rounded-md flex items-center gap-2 transition-all'>
                <p>Handbags</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Men"}>
            <div className="Men-box categories-boxes h-[350px] w-[300px] rounded-md overflow-hidden relative">
              <img className='w-full h-full hover:scale-[1.1] transition-all' src={Images.MenBoxImg} alt="" />
              <div className='Men-div categories-boxes-div absolute bottom-8 left-5 bg-white py-[10px] px-[25px] rounded-md flex items-center gap-2 transition-all'>
                <p>Men</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Women"}>
            <div className="Women-box categories-boxes h-[350px] w-[300px] rounded-md overflow-hidden relative">
              <img className='w-full h-full hover:scale-[1.1] transition-all' src={Images.WomenBoxImg} alt="" />
              <div className='women-div categories-boxes-div absolute bottom-8 left-5 bg-white py-[10px] px-[25px] rounded-md flex items-center gap-2 transition-all'>
                <p>Women</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Shoes"}>
            <div className="shoes-box categories-boxes h-[350px] w-[300px] rounded-md overflow-hidden relative">
              <img className='w-full h-full hover:scale-[1.1] transition-all' src={Images.ShoesBoxImg} alt="" />
              <div className='shoes-div categories-boxes-div absolute bottom-8 left-5 bg-white py-[10px] px-[25px] rounded-md flex items-center gap-2 transition-all'>
                <p>Shoes</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


        </div>



        <NavLink to={"/collection"}>
          <div className="discover-categories border-[1px] border-black h-[350px] w-[300px] rounded-lg mx-[24px] px-10 pt-36 flex flex-col gap-10">
            <h1 className='text-[30px] w-full'>Discover all new items</h1>

            <div className='discover-categories-div h-[50px] w-[50px] rounded-full border-[1px] border-black flex items-center justify-center'>
              <FontAwesomeIcon className='rotate-[-45deg]' icon={faArrowRight} />
            </div>
          </div>
        </NavLink>


      </div>
    </div>
  )
}

export default catogeries