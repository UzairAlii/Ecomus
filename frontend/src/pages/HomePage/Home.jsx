import React, { useState, useEffect } from 'react';
import "./HomePage.css"
import { Images } from '../../assets/assets'
import { NavLink } from 'react-router-dom';
import SlidingPara from './SlidingPara';
import Catogeries from './catogeries';
import BestSeller from "../BestSeller/Bestseller"
import ShopTheLook from './ShopTheLook';
import HappyClients from './HappyClients';
import BrandsLogo from './BrandsLogo';
import ShopGram from './ShopGram';
import LastSection from './LastSection';


const shopTheLookImages = [Images.shopthelookImg1, Images.shopthelookImg2];
const lastSectionData = [
  {
    image: Images.LastShipping,
    title: "Free Shipping",
    description: "You will love at great low prices",
  },
  {
    image: Images.LastPayment,
    title: "Flexible Payment",
    description: "Pay with Multiple Credit Cards",
  },
  {
    image: Images.LastReturn,
    title: "14 Day Returns",
    description: "Within 30 days for an exchange",
  },
  {
    image: Images.LastSupport,
    title: "Premium Support",
    description: "Outstanding premium support",
  },
];



const images = [
  {
    src: `${Images.landingImageOne}`,
    title: 'Discreet Style',
    description: "From Casual To Formal , We've Got You Covered",
    button: 'Shop Collection >',
  },
  {
    src: `${Images.landingImageTwo}`,
    title: 'Glamorous Glam',
    description: "From Casual To Formal , We've Got You Covered",
    button: 'Shop Collection >',
  },
  {
    src: `${Images.landingImageThree}`,
    title: 'Simple Style',
    description: "From Casual To Formal , We've Got You Covered",
    button: 'Shop Collection >',
  },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); 

    return () => clearInterval(interval); 
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
    <div className="slider-container">
      <div
        className="slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            className="slide"
            key={index}
            style={{ backgroundImage: `url(${image.src})` }}
          >
            <div className="content">
              <h1>{image.title}</h1>
              <p>{image.description}</p>
              <NavLink to={"/collection"}>
              <button>{image.button}</button>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <div
            key={index}
            className={`big-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          >
            <span className="small-dot"></span>
          </div>
        ))}
      </div>
          
    </div>




    <SlidingPara />
    <Catogeries />
    <BestSeller />
    <ShopTheLook shopTheLookImages={shopTheLookImages} />
    <HappyClients />
    <BrandsLogo />
    <ShopGram />
    <LastSection lastSectionData= {lastSectionData} />
    </>
  );
};

export default Home;
