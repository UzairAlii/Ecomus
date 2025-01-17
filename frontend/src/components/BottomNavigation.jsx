import React, { useContext, useEffect, useState } from 'react';
import { Images } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faArrowRight, faSearch, faClose, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './PoductItem';

const BottomNavigation = () => {
    const { getCartCount, APIproducts, token, setToken, email } = useContext(ShopContext);

    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFilteredProducts, setSearchFilteredProducts] = useState([]);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const toggleLogin = () => {
        setIsLoginOpen(!isLoginOpen);
        setIsRegistering(false);
        setIsForgotPassword(false);
    };

    const toggleRegister = () => {
        setIsRegistering(true);
        setIsForgotPassword(false);
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(true);
        setIsRegistering(false);
    };

    const filterUniqueProducts = (products) => {
        const uniqueIds = new Set();
        return products.filter(product => {
            if (uniqueIds.has(product._id)) {
                return false;
            }
            uniqueIds.add(product._id);
            return true;
        });
    };

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchFilteredProducts([]);
        } else {
            const filtered = APIproducts.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const uniqueFiltered = filterUniqueProducts(filtered);
            setSearchFilteredProducts(uniqueFiltered);
        }
    }, [searchQuery, APIproducts]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const ToggleShop = () => {
        setIsShopOpen(!isShopOpen);
    };

    const ToggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        if (ToggleShop || ToggleSearch) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [ToggleSearch, ToggleShop]);

    const onSubmitHandler = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className='BottomNavigation w-full p-[15px] bg-white fixed left-0 bottom-0 flex items-center justify-between shadow-md md:hidden'
                style={{ zIndex: 999 }}>

                <div onClick={ToggleShop} className="bn-shop flex flex-col gap-2 items-center">
                    <img src={Images.shop} alt="" />
                    <p>Shop</p>
                </div>

                <div onClick={ToggleSearch} className="bn-search flex flex-col gap-2 items-center">
                    <img src={Images.search} alt="" />
                    <p>Search</p>
                </div>

                <div onClick={toggleLogin} className='group relative bn-search flex flex-col gap-2 items-center '>
                    <img src={Images.loginSignup} alt="login signup icon" />
                    <p>Account</p>
                    {token && email && (
                        <div className="group-hover:block hidden absolute dropdown-menu top-[-200%] pt-4">
                            <div className='h-fit flex flex-col gap-2 py-3 px-5 bg-slate-100 text-gray-500 rounded-md'>
                                <p onClick={()=> setToken('')} className='cursor-pointer'>Logout</p>
                                <p>{email}</p>
                            </div>
                        </div>
                    )}
                </div>

                <NavLink to={"/cart"}>
                    <div className="cart flex flex-col gap-2 items-center">
                        <img src={Images.cart} alt="cart icon" />
                        <span>{getCartCount()}</span>
                        <p>Cart</p>
                    </div>
                </NavLink>
            </div>

            {/* BOTTOM NAVIGATION MAI SHOP PAR CLICK KARNE PAR AANE WALE ITEMS */}
            <div>
                {isShopOpen && (
                    <div className="overlay lg:hidden" style={{ zIndex: 1000 }} onClick={ToggleShop}>
                        <div
                            className="custom-cursor md:flex items-center justify-center hidden"
                            style={{ top: cursorPosition.y, left: cursorPosition.x }}
                        >
                            <FontAwesomeIcon icon={faTimes} className="cross-icon" />
                        </div>
                    </div>
                )}
                <div className={`Shop-items ${isShopOpen ? 'showShop' : ''} relative lg:hidden`} >

                    <div className='flex items-center gap-4 back-icons' onClick={ToggleShop}>
                        <FontAwesomeIcon icon={faChevronLeft} className='close' />
                        <p className='[@media(max-width : 800px)]:hidden'>Back</p>
                    </div>

                    <div className='mt-10 flex flex-col gap-5 w-full'>

                        <NavLink to={"/NewArrival"}>
                            <div onClick={ToggleShop} className="fashion flex gap-5 items-center py-[7px] w-full">
                                <img className='rounded-full' src={Images.fashionImg} alt="" />
                                <p className='text-[13px] font-semibold '>New Arrival</p>
                            </div>
                        </NavLink>

                        <NavLink to={"/Accessories"}>
                            <div onClick={ToggleShop} className="accessories flex gap-5 items-center py-[7px] w-full">
                                <img className='rounded-full' src={Images.AcessoriesImg} alt="" />
                                <p className='text-[13px] font-semibold '>Accessories</p>
                            </div>
                        </NavLink>

                        <NavLink to={"/Men"}>
                            <div onClick={ToggleShop} className="men flex gap-5 items-center py-[7px] w-full">
                                <img className='rounded-full' src={Images.MenImg} alt="" />
                                <p className='text-[13px] font-semibold '>Men</p>
                            </div>
                        </NavLink>

                        <NavLink to={"/Women"}>
                            <div onClick={ToggleShop} className="women flex gap-5 items-center py-[7px] w-full">
                                <img className='rounded-full' src={Images.WomenImg} alt="" />
                                <p className='text-[13px] font-semibold '>Women</p>
                            </div>
                        </NavLink>

                        <NavLink to={"/Handbag"}>
                            <div onClick={ToggleShop} className="handbag flex gap-5 items-center py-[7px] w-full">
                                <img className='rounded-full' src={Images.HandbagImg} alt="" />
                                <p className='text-[13px] font-semibold '>Handbags</p>
                            </div>
                        </NavLink>

                        <NavLink to={"/Shoes"}>
                            <div onClick={ToggleShop} className="shoes flex gap-5 items-center py-[7px] w-full">
                                <img className='rounded-full' src={Images.ShoesImg} alt="" />
                                <p className='text-[13px] font-semibold '>Shoes</p>
                            </div>
                        </NavLink>
                    </div>

                    <div className='p-6 bg-slate-100 w-full absolute bottom-0 left-0  '>
                        <NavLink to={"/collection"} onClick={ToggleShop}>
                            <div className='view-collections flex gap-4 items-center w-fit'>
                                <p className='text-[15px]'>View All Collections</p>
                                <FontAwesomeIcon icon={faArrowRight} className='rotate-[-45deg]' />
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* BOTTOM NAVIGATION MAI SEARCH PAR CLICK KARNE PAR AANE WALE ITEMS */}
            <div>
                {isSearchOpen && (
                    <div className="overlay lg:hidden" style={{ zIndex: 1000 }} onClick={ToggleSearch}>
                        <div
                            className="custom-cursor md:flex items-center justify-center hidden"
                            style={{ top: cursorPosition.y, left: cursorPosition.x }}
                        >
                            <FontAwesomeIcon icon={faTimes} className="cross-icon" />
                        </div>
                    </div>
                )}
                <div className={`search-items ${isSearchOpen ? 'showSearch' : ''} relative xl:hidden`}>

                    <div className='flex items-center gap-4 back-icons' onClick={ToggleSearch}>
                        <FontAwesomeIcon icon={faChevronLeft} className='close' />
                        <p className='[@media(max-width : 800px)]:hidden'>Back</p>
                    </div>

                    <div className='mt-[20px] flex flex-col gap-[20px]'>
                        <h1 className='text-[25px] font-semibold'>Search Our Site</h1>

                        <div className='border-[1px] border-black px-[10px] rounded-md'>
                            <FontAwesomeIcon className='w-[5%]' icon={faSearch} />
                            <input value={searchQuery} onChange={handleSearch} className='border-none px-[20px] py-[5px] outline-none w-[90%]' type="text" placeholder={`Shirts, Bags, Shoes`} />
                        </div>

                        <div>
                            <h1 className='text-xl font-medium'>Quick Links</h1>
                            <div className='mt-[10px] flex flex-row text-center gap-5 flex-wrap'>
                                <NavLink onClick={ToggleSearch} to={"/NewArrival"}><p className='text-[15px]'>New Arrival</p></NavLink>
                                <NavLink onClick={ToggleSearch} to={"/Men"}><p className='text-[15px]'>Men</p></NavLink>
                                <NavLink onClick={ToggleSearch} to={"/Women"}><p className='text-[15px]'>Women</p></NavLink>
                                <NavLink onClick={ToggleSearch} to={"/Accessories"}><p className='text-[15px]'>Accessories</p></NavLink>
                                <NavLink onClick={ToggleSearch} to={"/Handbag"}><p className='text-[15px]'>Handbags</p></NavLink>
                                <NavLink onClick={ToggleSearch} to={"/Shoes"}><p className='text-[15px]'>Shoes</p></NavLink>
                            </div>
                        </div>
                    </div>

                    <div onClick={ToggleSearch} className="searched-items grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 px-3 py-10 w-full">
                        {searchQuery.trim() === "" ? (
                            <p></p>
                        ) : searchFilteredProducts.length > 0 ? (
                            searchFilteredProducts.map((item) => (
                                <ProductItem
                                    key={item._id}
                                    id={item._id}
                                    name={item.name}
                                    img={item.image}
                                    discounted_price={item.discounted_price}
                                />
                            ))
                        ) : (
                            <p>No products found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTTOM NAVIGATION MAI Account PAR CLICK KARNE PAR AANE WALE ITEMS */}
            <div className='flex items-center justify-center'>
                {isLoginOpen && !token && (
                    <div className="overlay lg:hidden" style={{ zIndex: 1000 }} onClick={toggleLogin}>
                        <div
                            className="custom-cursor md:flex items-center justify-center hidden"
                            style={{ top: cursorPosition.y, left: cursorPosition.x }}
                        >
                            <FontAwesomeIcon icon={faTimes} className="cross-icon" />
                        </div>
                    </div>
                )}
                <div className={`desktopLoginItems ${isLoginOpen && !token ? 'showDesktopLogin' : ''}`}>
                    <div className=" p-3 sm:p-5 md:p-10 w-full">
                        <div className="flex items-center justify-between w-full">
                            <h1 className=" text-2xl md:text-3xl font-normal">
                                {isForgotPassword
                                    ? 'Reset Your Password'
                                    : isRegistering
                                        ? 'Register'
                                        : 'Login'}
                            </h1>
                            <FontAwesomeIcon onClick={toggleLogin} className="text-2xl cursor-pointer" icon={faClose} />
                        </div>

                        {isForgotPassword ? (
                            <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 mt-6">
                                <p className="text-sm text-gray-600">
                                    Enter your email to reset your password. We'll send you a link.
                                </p>
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="Email"
                                    type="email"
                                />
                                <div className="w-full flex items-center gap-5 mt-6">
                                    <button className="w-[45%] py-3 bg-black text-white text-[15px]">
                                        Submit
                                    </button>
                                    <div
                                        className="border-b-[1px] border-black hover:text-red-600 hover:border-b-red-600 cursor-pointer"
                                        onClick={() => setIsForgotPassword(false)}
                                    >
                                        <p className="text-[15px]">Back to Login</p>
                                    </div>
                                </div>
                            </form>
                        ) : isRegistering ? (
                            <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 mt-6">
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="First Name"
                                    type="text"
                                />
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="Last Name"
                                    type="text"
                                />
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="Email"
                                    type="email"
                                />
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="Password"
                                    type="password"
                                />
                                <div className="w-full flex items-center gap-5 mt-6">
                                    <button className="w-[45%] py-3 bg-black text-white text-[15px]">
                                        Register
                                    </button>
                                    <div
                                        className="border-b-[1px] border-black hover:text-red-600 hover:border-b-red-600 cursor-pointer"
                                        onClick={() => setIsRegistering(false)}
                                    >
                                        <p className="text-[10px] md:text-[15px]">Already have an account? Log in</p>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 mt-6">
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="Email"
                                    type="email"
                                />
                                <input
                                    className="border px-5 py-3 outline-none rounded-md"
                                    placeholder="Password"
                                    type="password"
                                />
                                <p
                                    className="text-[15px] mt-6 underline cursor-pointer hover:text-red-600"
                                    onClick={toggleForgotPassword}
                                >
                                    Forgot your password?
                                </p>
                                <div className="w-full flex items-center gap-5 mt-6">
                                    <button className="w-[45%] py-3 bg-black text-white text-[15px]">
                                        Log in
                                    </button>
                                    <div
                                        className="border-b-[1px] border-black hover:text-red-600 hover:border-b-red-600 cursor-pointer"
                                        onClick={toggleRegister}
                                    >
                                        <p className="text-[10px] md:text-[15px]">New Customer? Create your account</p>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BottomNavigation;