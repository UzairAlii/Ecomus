import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useParams, NavLink } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { Images } from '../../assets/assets';
import CartViewer from '../../components/CartViewer';
import "./product.css";

const Product = () => {
  const { productId } = useParams();
  const { APIproducts, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [viewers, setViewers] = useState(getRandomNumber());
  const [slideDirection, setSlideDirection] = useState('');
  const [isCartViewerOpen, setIsCartViewerOpen] = useState(false);

  const toggleCartViewer = () => {
    setIsCartViewerOpen(!isCartViewerOpen);
  };

  useEffect(() => {
    const fetchProductData = () => {
      const foundProduct = APIproducts.find((item) => item._id === productId);

      if (foundProduct) {
        setProductData(foundProduct);
        setCurrentImageIndex(0);

        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
      }
    };

    fetchProductData();
  }, [productId, APIproducts]);

  const handleNextImage = () => {
    setSlideDirection('slide-left');
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productData.image.length);
  };

  const handlePreviousImage = () => {
    setSlideDirection('slide-right');
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + productData.img.length) % productData.img.length);
  };

  useEffect(() => {
    const resetSlideDirection = setTimeout(() => {
      setSlideDirection('');
    }, 500);

    return () => clearTimeout(resetSlideDirection);
  }, [currentImageIndex]);

  const handleColorClick = (color, index) => {
    setSelectedColor(color);
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + change;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    if (productData && productData.colors && Array.isArray(productData.colors) && productData.colors.length > 0) {
      setSelectedColor(productData.colors[0]);

      if (Array.isArray(productData.sizes) && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      } else {
        console.warn("No sizes available for the selected product.");
        setSelectedSize(null);
      }
    }
  }, [productData]);

  useEffect(() => {
    if (productData && productData.colors) {
      setSelectedColor(productData.colors[currentImageIndex]);
    }
  }, [currentImageIndex, productData]);

  function getRandomNumber() {
    return Math.floor(Math.random() * 8) + 8;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(getRandomNumber());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return productData ? (
    <div className='product-section h-fit w-full md:flex md:flex-col px-4 md:px-10 '>
      <div className="product-header my-10">
        <NavLink to={"/"}>
          <span className='text-sm text-black font-bold px-2 hover:text-red-600 transition-all'>Home</span>
        </NavLink>
        &gt;
        <span className='text-sm text-slate-600 font-normal px-2'>{productData.name}</span>
      </div>

      <div className='md:flex items-start gap-10'>
        <div className='flex flex-col-reverse images-section w-full md:flex md:flex-row md:w-1/2 gap-5'>
          <div className='thumbnails flex gap-4 md:gap-0 md:flex md:flex-col space-y-2'>
            {productData.image && productData.image.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product thumbnail ${index}`}
                className={`h-[100px] w-[100px] md:w-20 md:h-20 object-cover cursor-pointer rounded-lg ${index === currentImageIndex ? 'border-2 border-black' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>

          <div className='large-image w-full flex md:flex justify-center items-center relative'>
            <button
              onClick={handlePreviousImage}
              className='h-[50px] w-[50px] absolute left-0 p-2 hover:bg-gray-200 bg-white transition rounded-full ml-5 rotate-[-180deg] text-[20px] font-bold z-10'
            >
              &gt;
            </button>

            <div className={`image-container ${slideDirection}`}>
              {productData.image && (
                <img
                  src={productData.image[currentImageIndex]}
                  alt='Current product'
                  className='w-full object-cover rounded-md'
                />
              )}
            </div>

            <button
              onClick={handleNextImage}
              className='h-[50px] w-[50px] absolute right-0 p-2 hover:bg-gray-200 bg-white transition rounded-full mr-5 text-[20px] font-bold'
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className='product-info w-full md:w-1/2 md:flex md:flex-col gap-2'>
          <div className="product-name mt-10 md:0">
            <h1 className='text-2xl font-bold md:font-normal md:text-3xl'>{productData.name}</h1>
          </div>

          {/* Product Price Section */}
          <div className='flex items-center gap-3 prices text-2xl pt-5'>
            {productData.price ? (
              <>
                <p className='price text-gray-600'>{currency}{formatPrice(productData.price)}</p>
                <p>From</p>
                <p className='discounted_price text-black'>{currency}{formatPrice(productData.discounted_price)}</p>
              </>
            ) : (
              <p className='discounted_price text-black'>{currency}{formatPrice(productData.discounted_price)}</p>
            )}
          </div>

          {/* people viewing this right now */}
          <div className='flex items-center gap-2 my-4'>
            <span className='bg-black text-white rounded-lg h-[20px] w-[30px] flex items-center justify-center p-3 text-[15px]'>{viewers}</span>
            <p className=' text-gray-500 text-[13px] font-bold'> people are viewing this product right now</p>
          </div>

          {/* Product Colors Section */}
          {productData && productData.colors && Array.isArray(productData.colors) && productData.colors.length > 0 ? (
            <div className='product-colors md:flex md:flex-col items-start gap-3 mt-5'>
              <div className='md:flex items-center'>
                <span className='text-md font-bold'>Color: </span>
                <span className='text-md font-medium'>{selectedColor}</span>
              </div>
              <div className='flex gap-2 mt-5'>
                {productData.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color, border: selectedColor === color ? "2px solid black" : "" }}
                    onClick={() => handleColorClick(color, index)}
                  />
                ))}
              </div>
            </div>
          ) : ""}

          {/* Product sizes Section */}
          {productData && productData.sizes && productData.sizes.length > 0 && (
            <div className='sizes mt-2'>
              <h3 className='font-bold'>Size: {selectedSize}</h3>
              <div className='flex gap-2'>
                {productData.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`h-10 w-14 rounded-md border ${selectedSize === size ? 'border-black' : 'border-gray-300'}`}
                    onClick={() => handleSizeClick(size)}
                    style={{
                      border: selectedSize === size ? "2px solid black" : "",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Section */}
          <div className='flex flex-col gap-5 mt-10 h-fit w-full'>
            <div>
              <h1>Quantity</h1>
              <div className='flex items-center justify-between h-fit w-full md:w-fit md:h-fit gap-4 p-3 rounded-md bg-slate-100'>
                <FontAwesomeIcon
                  icon={faMinus}
                  onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
                  className='cursor-pointer'
                />
                <input
                  type='number'
                  value={quantity}
                  readOnly
                  className='w-12 text-center bg-transparent outline-none border-none'
                />
                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={() => setQuantity((prevQuantity) => Math.min(100, prevQuantity + 1))}
                  className='cursor-pointer'
                />
              </div>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className='flex items-center gap-4 mt-5'>
            <button
              onClick={() => {
                addToCart(productId, selectedColor, selectedSize, quantity, currentImageIndex);
                toggleCartViewer();
              }}
              className="bg-black text-white px-12 py-4 md:py-4 md:px-20 w-full md:w-fit font-semibold rounded-md"
            >
              Add to cart - {currency} {new Intl.NumberFormat().format(productData.discounted_price * quantity)}
            </button>

            {/* Cart Viewer */}
            <CartViewer isCartViewerOpen={isCartViewerOpen} toggleCartViewer={toggleCartViewer} />
          </div>

          {/* Shipping and Refund Section */}
          <div className="shipping-refund flex flex-col gap-5 xl:flex xl:flex-row mt-10 md:gap-3">
            <div className='sh-re-boxes flex flex-col h-fit w-fit px-5 py-[60px] rounded-3xl items-center justify-center text-center gap-4'>
              <img className='w-[35px]' src={Images.shipping} alt="" />
              <p className='text-sm'>Estimate delivery times: <span className='font-bold'>12-26 days</span> (International), <span className='font-bold'>3-6 days</span> (United States).</p>
            </div>
            <div className='sh-re-boxes flex flex-col h-fit w-fit px-5 py-[60px] rounded-3xl items-center justify-center text-center gap-4'>
              <img className='w-[35px]' src={Images.refund} alt="" />
              <p className='text-sm'>Return within <span className='font-bold'>30 days</span> of purchase. Duties & taxes are non-refundable.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : <div className='opacity-0'></div>;
};

export default Product;