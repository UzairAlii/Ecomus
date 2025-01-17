import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faArrowRight, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../context/ShopContext';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const CartViewer = ({ isCartViewerOpen, toggleCartViewer }) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const { cartItems, setCartItems, APIproducts, currency, navigate, token, backendUrl } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
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

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        if (toggleCartViewer) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [toggleCartViewer]);

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

    return (
        <div className='z-[1001] overflow-scroll'>
            {isCartViewerOpen && (
                <div className="overlay" onClick={toggleCartViewer}>
                    <div
                        className="custom-cursor md:flex items-center justify-center hidden"
                        style={{ top: cursorPosition.y, left: cursorPosition.x }}
                    >
                        <FontAwesomeIcon icon={faTimes} className="cross-icon" />
                    </div>
                </div>
            )}
            <div className={`cart-viewer w-[90%] lg:w-[40%] ${isCartViewerOpen ? 'open' : ''}`}>
                <div className='flex items-center gap-3 self-start w-full justify-between'>
                    <div onClick={() => toggleCartViewer(false)} className='flex items-center gap-3 cursor-pointer'>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <h1>Back</h1>
                    </div>

                    <h1 className='text-black text-3xl'>Shopping Cart</h1>
                </div>

                <div className='cart-items-wrapper overflow-y-auto h-[280px] my-4 relative rounded-lg'>
                    <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none"></div>

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
                                <div className='cart-item h-fit w-full flex flex-col items-center gap-2' key={index}>
                                    <div className='cart-item-details w-full flex flex-col gap-4 justify-between mt-[30px]'>
                                        <div className='flex items-center gap-3'>
                                            <img
                                                src={productData.image[item.imageIndex]}
                                                alt={productData.name}
                                                className='cart-item-image h-[100px] w-[80px] rounded-2xl'
                                            />
                                            <div className='flex flex-col md:text-start'>
                                                <h2>{productData.name}</h2>
                                                <p>
                                                    {item.size ? `${item.size}` : 'No Size'} / {item.color}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='cart-item-price flex items-center gap-5 md:gap-10'>
                                            <span>
                                                ${productData.discounted_price ? productData.discounted_price.toFixed(2) : 'N/A'}
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
                                                <span className='font-bold'>{currency}
                                                    {productData.discounted_price
                                                        ? new Intl.NumberFormat().format(productData.discounted_price * item.quantity)
                                                        : 'N/A'}</span>
                                            </span>
                                        </div>

                                        <button
                                            className="bg-black text-white py-3 px-6 rounded-xl text-sm"
                                            onClick={() => {
                                                handleRemoveItem(item._id, item.color, item.size, item.imageIndex);
                                                    toggleCartViewer();
                                                
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="subtotal md:p-5">
                    <div className='border-bottom w-full flex flex-col pb-3'>
                        <div className='flex items-center justify-between w-full'>
                            <h1 className='text-xl font-normal'>Subtotal</h1>
                            <p className='text-2xl font-xl font-semibold'>{currency}{new Intl.NumberFormat().format(subtotal.toFixed(2))} USD</p>
                        </div>
                        <p className="text-[15px] mt-3">
                            Taxes and <span className='underline cursor-pointer hover:text-red-600'>Shipping</span> calculated at checkout
                        </p>
                    </div>

                    <div className='flex flex-col mt-3'>
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

                        <div className="cart-checkout-buttons self-center w-[85%] flex items-center gap-2 justify-between mt-10">
                            <NavLink to={"/cart"}>
                                <button className='px-4 lg:px-10 rounded-xl py-3 border-[1px] border-black'>View Cart</button>
                            </NavLink>

                            <div onClick={() => navigate("/checkout")}>
                                <button
                                    onClick={handleCheckoutClick}
                                    disabled={!isChecked}
                                    className={`px-4 lg:px-10 rounded-xl py-3 bg-black text-white ${isChecked ? '' : 'cursor-not-allowed opacity-50'}`}
                                >
                                    Check out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartViewer;