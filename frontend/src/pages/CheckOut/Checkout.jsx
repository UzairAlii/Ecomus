import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTruck } from '@fortawesome/free-solid-svg-icons';
import { Images } from '../../assets/assets';
import "./checkout.css";
import { toast } from 'react-toastify';
import axios from 'axios';

const Checkout = () => {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { backendUrl, token, APIproducts, currency, cartItems, setCartItems, getCartAmount, delivery_fee, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    selectedCountry : "",
    city: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    nameOnCard: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^(?:\+92|92|0)(3[0-9]{2}|[1-9][0-9]{1,2})[0-9]{7}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number format.";
    }
    

    if (!formData.lastName) {
      errors.lastName = "Last name is required.";
    }

    if (!formData.address) {
      errors.address = "Address is required.";
    }

    if (!formData.postalCode) {
      errors.postalCode = "Postal code is required.";
    }

    if (!formData.city) {
      errors.city = "City is required.";
    }

    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      setIsPopupVisible(true);
    }
  
    try {
      let orderItems = [];
      for (const itemId in cartItems) {
        for (const color in cartItems[itemId]) {
          for (const size in cartItems[itemId][color]) {
            for (const imageIndex in cartItems[itemId][color][size]) {
              const quantity = cartItems[itemId][color][size][imageIndex];
              if (quantity > 0) {
                const itemInfo = structuredClone(APIproducts.find((product) => product._id === itemId));
                if (itemInfo) {
                  itemInfo.size = size;
                  itemInfo.color = color;
                  itemInfo.quantity = quantity;
                  itemInfo.imageIndex = imageIndex;
                  orderItems.push(itemInfo);
                }
              }
            }
          }
        }
      }

      let orderData = {
        address : formData,
        items : orderItems,
        amount : getCartAmount() + delivery_fee,
      }

      switch (selectedPaymentMethod) {
        // for COD
        case "cod":
          const response = await axios.post(`${backendUrl}/api/order/COD`, orderData, { headers: { token } });
          console.log(response.data);
          
          if(response.data.success){
            setCartItems({});
            setIsPopupVisible(true);
          } else {
            toast.error(response.data.message);
          }
        break;

        case "stripe" : 
          const responseStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, {headers : {token}})
          if (responseStripe.data.success) {
            const session_url = responseStripe.data.session_url;
            if (session_url) {
              window.location.replace(session_url); 
            } else {
              console.error("Stripe session URL missing in response:", responseStripe.data);
              toast.error("Failed to initiate payment. Please try again.");
            }
          } else {
            toast.error(responseStripe.data.message);
          }
          
          
          

        break;
        
        default:
          break;
      }
  
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
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

  return (
    <form onSubmit={handleFormSubmit} className='checkout-container flex flex-col md:flex-row w-full h-full overflow-y-auto'>
      <div className="left-side flex flex-col gap-10 w-full md:w-1/2 border-2 p-2 md:pl-20 md:pt-10 md:pr-10 md:pb-20">
        {/* CONTACT */}
        <div className="contact flex flex-col gap-3 ">
          <h1 className="text-[20px] font-semibold">Contact</h1>
          <input
            className="outline-none light-border"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm">{validationErrors.email}</p>
          )}
          <input
            className="outline-none light-border"
            type="text"
            name="phone"
            placeholder="phone number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-sm">{validationErrors.phone}</p>
          )}
        </div>

        {/* DELIVERY */}
        <div className="delivery flex flex-col gap-3">
          <h1 className='text-[20px] font-semibold'>Delivery</h1>
          <div className='flex light-border items-center gap-2 relative w-full bg-[#0b7eab1f] border-[1px] border-[#0b7fab]'>
            <input type="radio" checked />
            <p>Ship</p>
            <FontAwesomeIcon className='absolute right-3 text-[#0b7fab]' icon={faTruck} />
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="personal-info">
          <h1 className="text-[20px] font-semibold">Country/Region</h1>
          <div className="select-container light-border py-0 px-[12px] w-full mt-2">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full h-full py-[14px] border-none outline-none bg-white"
            >
              <option value="option1">United States</option>
              <option value="option2">Pakistan</option>
              <option value="option3">India</option>
              <option value="option4">France</option>
            </select>
          </div>

          <div className="first-last-name w-full flex justify-between gap-4 mt-3">
            <div className='w-full'>
              <input
                className="light-border w-full"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='flex flex-col w-full'>
              <input
                className="light-border w-full"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-sm">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          <input
            className="light-border w-full mt-3"
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          {validationErrors.address && (
            <p className="text-red-500 text-sm">{validationErrors.address}</p>
          )}

          <div className="postal-city w-full flex justify-between gap-4 mt-3">
            <div className='flex flex-col w-full'>
              <input
                className="light-border w-full"
                type="text"
                name="postalCode"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
              {validationErrors.postalCode && (
                <p className="text-red-500 text-sm">{validationErrors.postalCode}</p>
              )}
            </div>

            <div className='flex flex-col w-full'>
              <input
                className="light-border w-full"
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              {validationErrors.city && (
                <p className="text-red-500 text-sm">{validationErrors.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* SHIPPING METHOD */}
        <div className="shipping-method flex flex-col gap-3">
          <h1 className='text-[18px] font-semibold'>Shipping Method</h1>
          <div className='flex light-border items-center gap-2 relative w-full bg-[#0b7eab1f] border-[1px] border-[#0b7fab]'>
            <input type="radio" checked />
            <p>Standard shipping</p>
            <p className='absolute right-3 text-[black] font-medium'>$10.00</p>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="payment-method">
          <div className="flex flex-col gap-2">
            <h1 className="text-[20px] font-semibold">Payment</h1>
            <p className="text-[14px] text-slate-500">All transactions are secure and encrypted.</p>
          </div>


          <div onClick={() => setSelectedPaymentMethod("stripe")} className="stripe flex flex-col gap-3 mt-3">
            <div className={`flex rounded-t-lg p-[12px] items-center gap-2 relative w-full ${selectedPaymentMethod === "stripe" ? 'bg-[#0b7eab1f] border-[1px] border-[#0b7fab]' : 'border'} `}>
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedPaymentMethod === "stripe"}
                onChange={() => handlePaymentMethodChange("stripe")}
              />
              <p>stripe</p>
              <img className='w-8 absolute right-3' src={Images.stripe} alt="" />
            </div>
          </div>

          <div onClick={() => setSelectedPaymentMethod("cod")} className="COD flex flex-col gap-3 mt-3">
            <div className={`flex rounded-t-lg p-[12px] items-center gap-2 relative w-full ${selectedPaymentMethod === "cod" ? 'bg-[#0b7eab1f] border-[1px] border-[#0b7fab]' : 'border'} `}>
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedPaymentMethod === "cod"}
                onChange={() => handlePaymentMethodChange("cod")}
              />
              <p>Cash On Delivery</p>
            </div>
          </div>

          <div className="payNow-btn mt-10">
            <button
            type='submit'
              className="w-full py-3 bg-[#0b7eabe2] text-white font-medium rounded-lg hover:bg-[#0b7fab] transition-all"
            >
              Confirm order
            </button>
          </div>
        </div>
      </div>

      {/* ------------------ RIGHT SIDE ---------------------------- */}
      <div className="right-side w-full md:w-1/2 block md:fixed md:top-0 md:right-0 px-2 pb-10 md:px-10 md:pt-5 overflow-y-auto md:h-screen">
        <div>
          {cartData.map((item, index) => {
            const productData = APIproducts.find((product) => product._id === item._id);

            if (!productData) return null;

            return (
              <div className="cart-item flex justify-between items-center border-b py-4" key={index}>
                <div className="flex gap-4 items-center">
                  <div className='relative'>
                    <img src={productData.image[item.imageIndex]} alt={productData.name} className="w-16 h-20" />
                    <div className='flex items-center justify-center absolute right-[-10px] top-[-10px] h-6 w-6 rounded-full bg-[grey]'>
                      <span className=' text-white text-[15px]'>{item.quantity}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold">{productData.name}</h2>
                    <p>Color: <span className='font-semibold'>{item.color}</span>, Size: <span className='font-semibold'>{item.size}</span></p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-medium">{currency} {(productData.discounted_price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}

          <div className="coupon-code w-full flex items-center gap-3 justify-between mt-6">
            <input className='w-[80%] light-border' type="text" placeholder='Discount code' />
            <button className='bg-black text-white py-3 px-6 rounded-md hover:bg-[#000000d8]'>Apply</button>
          </div>
          <div className="subtotal mt-6 font-semibold flex items-center justify-between">
            <p>Subtotal • {cartData.reduce((total, item) => total + item.quantity, 0)} items</p>
            <p>{currency} {subtotal.toFixed(2)}</p>
          </div>
          <div className="shipping-charges mt-3 font-semibold flex items-center justify-between">
            <p>Shipping</p>
            <p>{currency} {10.00.toFixed(2)}</p>
          </div>
          <div className="total-charges mt-3 font-semibold flex items-center justify-between">
            <p className='text-2xl'>Total</p>
            <p className='text-2xl'>{currency} {(subtotal + 10.00).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* THANKS FOR ORDER POPUP */}
      <div className='flex items-center justify-center'>
        {isPopupVisible && (
          <div className="overlay cursor-default">
          </div>
        )}
        <div className={`ThankspopUpitems ${isPopupVisible ? "ShowThanksForOrderPopup" : ""} rounded-xl`}>
          <div className='bg-white flex flex-col items-center justify-center text-center py-10'>
            <div className='flex flex-col items-center justify-center'>
              <img className='w-[100px]' src={Images.ThanksImg} alt="" />
              <h2 className='text-3xl'>Thank you for your order!</h2>
            </div>

            <div className='flex flex-col items-center justify-center mt-10'>
              <p>Your order has been successfully placed.</p>
            </div>

            <div className="popup-buttons flex items-center gap-3 mt-10">
              <button
                onClick={() => navigate("/orders")}
                className="border border-black py-2 px-5 text-black rounded-md"
              >
                See Your Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="py-2 px-5 bg-black text-white rounded-md"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Checkout;