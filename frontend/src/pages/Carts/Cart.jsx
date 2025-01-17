import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../../context/ShopContext';
import './cart.css';
import axios from 'axios';
import { toast } from 'react-toastify';




const Cart = () => {
  const { APIproducts, currency, cartItems, setCartItems, navigate, token, backendUrl } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const calculateSubtotal = (cartItems) => {
    let subtotal = 0;

    for (let itemId in cartItems) {
      for (let color in cartItems[itemId]) {
        for (let size in cartItems[itemId][color]) {
          for (let imageIndex in cartItems[itemId][color][size]) {
            const item = cartItems[itemId][color][size][imageIndex];
            subtotal += item.quantity * item.price;
          }
        }
      }
    }

    return subtotal;
  };

  useEffect(() => {
    const tempData = [];
    let tempSubtotal = 0;

    for (const itemId in cartItems) {
      for (const color in cartItems[itemId]) {
        for (const size in cartItems[itemId][color]) {
          const sizeData = cartItems[itemId][color][size];
          for (const imageIndex in sizeData) {
            const quantity = sizeData[imageIndex];
            if (quantity > 0) {
              const productData = APIproducts.find((product) => product._id === itemId);

              if (productData && productData.discounted_price) {
                tempSubtotal += productData.discounted_price * quantity;
              }

              tempData.push({
                _id: itemId,
                color: color,
                size: size,
                imageIndex: imageIndex,
                quantity: quantity,
              });
            }
          }
        }
      }
    }

    setCartData(tempData);
    setSubtotal(tempSubtotal);
  }, [cartItems, APIproducts]);

  const handleQuantityChange = async (itemId, color, size, imageIndex, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevCartItems) => {
      const updatedCart = { ...prevCartItems };

      if (updatedCart[itemId] && updatedCart[itemId][color] && updatedCart[itemId][color][size]) {
        updatedCart[itemId][color][size][imageIndex] = newQuantity;
      }

      const newSubtotal = calculateSubtotal(updatedCart);
      setSubtotal(newSubtotal);

      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, {
          userId: token,
          itemId,
          size,
          colors: color,
          quantity: newQuantity,
          imageIndex
        }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleRemoveItem = async (itemId, color, size, imageIndex) => {

    setCartItems((prevCartItems) => {
    const updatedCart = { ...prevCartItems };

    if (
      updatedCart[itemId] &&
      updatedCart[itemId][color] &&
      updatedCart[itemId][color][size]
    ) {
      delete updatedCart[itemId][color][size][imageIndex];

      if (Object.keys(updatedCart[itemId][color][size]).length === 0) {
        delete updatedCart[itemId][color][size];
      }
      if (Object.keys(updatedCart[itemId][color]).length === 0) {
        delete updatedCart[itemId][color];
      }
      if (Object.keys(updatedCart[itemId]).length === 0) {
        delete updatedCart[itemId];
      }
    }

    return updatedCart;
  });

    if (!itemId || !color || !size) {
      toast.error("Invalid item data");
      return;
    }
  
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/remove`,
          {
            userId: token,
            itemId,
            color,
            size,
          },
          { headers: { token } }
        );
  
        if (response.data.success) {
          toast.success(response.data.message);
          setCartItems((prevCartItems) => {
            const updatedCart = { ...prevCartItems };
            delete updatedCart[itemId]?.[size]?.[color];
            return updatedCart;
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove item from cart");
      }
    }
  };
  


  const [isChecked, setIsChecked] = useState(false);
  const [shake, setShake] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setShake(false);
  };

  const handleCheckoutClick = (e) => {
    if (!isChecked) {
      e.preventDefault();
      setShake(true);
    }
  };

  return (
    <div className='cart-container'>
      <div className='cart-header'>
        <h1 className='text-[10vw] md:text-[4vw] font-normal'>Shopping Cart</h1>
      </div>

      <div className='flex flex-col h-fit items-center px-5 py-10 justify-between gap-2 relative'>
        <div className='cart-items h-full w-full'>
          {cartData.length === 0 ? (
            <div className='h-fit w-full flex flex-col text-center items-center justify-center py-28 gap-6'>
              <h1 className='text-3xl font-semibold'>Your cart is empty</h1>
              <p className='text-slate-800'>
                You may check out all the available products and buy some in the shop
              </p>
              <NavLink to={'/collection'}>
                <button className='bg-black text-white py-3 px-6 rounded-xl'>
                  Return to shop{' '}
                  <FontAwesomeIcon className='rotate-[-45deg]' icon={faArrowRight} />
                </button>
              </NavLink>
            </div>
          ) : (
            cartData.map((item, index) => {
              const productData = APIproducts.find((product) => product._id === item._id);

              if (!productData) return null;

              return (
                <div className='cart-item px-2 py-2 md:px-5 md:py-10 h-fit w-full flex items-center gap-2' key={index}>
                  <div className='cart-item-details w-full flex flex-col gap-4 text-center md:flex md:flex-row items-center justify-between md:gap-10'>
                    <div className='md:flex md:flex-row flex flex-col items-center gap-3'>
                      <img
                        src={productData.image[item.imageIndex]}
                        alt={productData.name}
                        className='cart-item-image h-[100px] w-[80px] rounded-2xl'
                      />
                      <div className='flex flex-col text-center md:text-start'>
                        <h2>{productData.name}</h2>
                        <p>
                          {item.size ? `${item.size}` : 'No Size'} / {item.color}
                        </p>
                      </div>
                    </div>

                    <div className='cart-item-price flex items-center gap-10'>
                      <span>
                        Price: ${productData.discounted_price ? productData.discounted_price.toFixed(2) : 'N/A'}
                      </span>

                      <div className='cart-item-quantity'>
                        <div className='flex items-center justify-between h-fit w-full md:w-fit md:h-fit gap-4 p-3 rounded-md bg-slate-100'>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.color, item.size, item.imageIndex, item.quantity - 1)}
                            className='cursor-pointer'
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <input
                            type='number'
                            value={item.quantity}
                            readOnly
                            className='w-12 text-center bg-transparent outline-none border-none'
                          />
                          <button
                            onClick={() => handleQuantityChange(item._id, item.color, item.size, item.imageIndex, item.quantity + 1)}
                            className='cursor-pointer'
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </div>

                      <span>
                        Total: <span className='font-bold'>{currency}
                          {productData.discounted_price
                            ? new Intl.NumberFormat().format(productData.discounted_price * item.quantity)
                            : 'N/A'}</span>
                      </span>
                    </div>

                    <button
                      className="bg-black text-white py-3 px-6 rounded-xl text-sm"
                      onClick={() => handleRemoveItem(item._id, item.color, item.size, item.imageIndex)}
                    >
                      Remove
                    </button>

                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {cartData.length > 0 && (
          <div className='flex flex-col md:flex md:flex-row gap-3 md:gap-10 w-full'>
            <div className='order-notes h-fit w-full md:w-1/2'>
              <h1 className='font-semibold'>Add Order Note</h1>
              <textarea className='textarea w-full h-[20vh] md:h-[50vh]'></textarea>
            </div>

            <div className={`subtotalOfItems self-center items-center justify-center bg-slate-100 p-3 md:p-6 rounded-md w-full md:w-1/2 ${shake ? 'shake' : ''}`}>
              <div className="subtotal w-full flex items-center justify-between">
                <h1 className="text-xl font-semibold">Subtotal</h1>
                <p className="subtotal-price text-lg font-normal">
                  {currency}{new Intl.NumberFormat().format(subtotal.toFixed(2))}
                </p>
              </div>

              <div className="shipping w-full flex items-center justify-between">
                <h1 className='text-xl font-semibold'>Shipping Fee</h1>
                <p className='text-lg font-normal'>{currency}{new Intl.NumberFormat().format(10)}</p>
              </div>

              <div className="total w-full flex items-center justify-between">
                <h1 className='text-xl font-semibold'>Total</h1>
                <p className='text-xl font-semibold'>
                  {currency}{new Intl.NumberFormat().format((subtotal + 10).toFixed(2))}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-3 w-full">
                <p className="text-[15px]">
                  Taxes and <span>Shipping</span> calculated at checkout
                </p>

                <div className="flex gap-2 items-center self-start">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 bg-red-500 rounded-full cursor-pointer"
                  />
                  <p className='text-[15px]'>
                    I agree with the <span className='underline'>terms and conditions</span>
                  </p>
                </div>

                <div onClick={() => navigate("./checkout")}>
                  <button
                    onClick={handleCheckoutClick}
                    className={`w-full text-white bg-black py-4 text-sm rounded-lg ${isChecked ? '' : 'cursor-not-allowed opacity-50'}`}
                    disabled={!isChecked}
                  >
                    Check out
                  </button>
                </div>

                <p>Guarantee Safe Checkout</p>
                <div className="payment-images flex items-center justify-center w-full">
                  <img
                    src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca12a187f00.svg"
                    alt="Visa"
                  />
                  <img
                    src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd15da6e92cc7266e93eb43762df5aa355d.svg"
                    alt="Paypal"
                  />
                  <img
                    src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg"
                    alt="MasterCard"
                  />
                  <img
                    src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/american_express-12858714bc10cdf384b62b8f41d20f56d8c32c1b8fed98b662f2bfc158dcbcf0.svg"
                    alt="American Express"
                  />
                  <img
                    src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/diners_club-16436b9fb6dd9060edb51f1c7c44e23941e544ad798282d6aef1604319562fba.svg"
                    alt="Diners Club"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;