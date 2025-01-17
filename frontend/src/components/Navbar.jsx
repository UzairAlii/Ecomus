import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faClose, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './PoductItem';
import { Images } from "../assets/assets";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const { getCartCount, APIproducts, token, setToken, email } = useContext(ShopContext);
    const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
    const [searchFilteredProducts, setSearchFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
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

    const ToggleNav = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDesktopSearch = () => {
        setDesktopSearchOpen(!desktopSearchOpen);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        if (ToggleNav) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [ToggleNav]);

    const onSubmitHandler = (e) => {
        e.preventDefault();
    };

    return (
        <div className='Navbar'>
            <div className="bars">
                <img onClick={ToggleNav} src={Images.bars} alt="menu icon" />
            </div>

            <NavLink to={"/"}>
                <div className="logo">
                    <img src={Images.logo} alt="logo" />
                </div>
            </NavLink>

            {/*----------------- RESPONSIVE MAI DIKHNE WALA NAVBAR ----------------------- */}
            <div className="navbar-div">
                {isMenuOpen && (
                    <div className="overlay lg:hidden" onClick={ToggleNav}>
                        <div
                            className="custom-cursor md:flex items-center justify-center hidden"
                            style={{ top: cursorPosition.y, left: cursorPosition.x }}
                        >
                            <FontAwesomeIcon icon={faTimes} className="cross-icon" />
                        </div>
                    </div>
                )}

                <ul className={`menu ${isMenuOpen ? 'showMenu' : ''} z-[1001] flex items-center`}>
                    <div className='flex items-center gap-4 back-icons' onClick={ToggleNav}>
                        <FontAwesomeIcon icon={faChevronLeft} className='close' />
                        <p className='[@media(max-width : 800px)]:hidden'>Back</p>
                    </div>
                    <NavLink to={"/"} className='group' onClick={ToggleNav}>
                        <li className='text-slate-950 font-semibold'>Home</li>
                        <span></span>
                    </NavLink>
                    <NavLink to={"/about"} className='group' onClick={ToggleNav}>
                        <li className='text-slate-950 font-semibold'>About</li>
                        <span></span>
                    </NavLink>
                    <NavLink to={"/BestSeller"} className='group' onClick={ToggleNav}>
                        <li className='text-slate-950 font-semibold'>Best Seller</li>
                        <span></span>
                    </NavLink>
                    <NavLink to={"/collection"} className='group' onClick={ToggleNav}>
                        <li className='text-slate-950 font-semibold'>Collections</li>
                        <span></span>
                    </NavLink>
                    <NavLink to={"/cart"} className='group' onClick={ToggleNav}>
                        <li className='text-slate-950 font-semibold'>Your cart</li>
                        <span></span>
                    </NavLink>
                    <NavLink to={"/orders"} className='group' onClick={ToggleNav}>
                        <li className='text-slate-950 font-semibold'>Your Orders</li>
                        <span></span>
                    </NavLink>

                    <div className="navlinks-items">
                        <div className="lower-section">
                            <div className="info">
                                <NavLink onClick={ToggleNav} to={"/contact"}>
                                    <p className='need-help'>Need Help ?</p>
                                </NavLink>
                                <p>Adress: 1234 Fashion street, Suit 567,</p>
                                <p>New York: NY 10001</p>
                                <p>Email: <span>info@fashionshop.com</span></p>
                                <p>Phone: <span>(212) 555-1234</span></p>
                            </div>
                        </div>
                    </div>
                    <div className='block md:hidden'>
                        {token && email ? (
                            <div className='text-sm'>
                                <p className='font-semibold'>Login ID: {email}</p>
                            </div>
                        ) : (
                            <NavLink onClick={ToggleNav} to={"/login"}>
                                <button className='bg-black px-6 py-2 text-white text-sm rounded-md'>Login</button>
                            </NavLink>
                        )}
                    </div>

                    {/* admin panel button */}

                    <div>
                        <a href="https://ecomus-admin-alpha.vercel.app/login" target="_blank" rel="noopener noreferrer">
                            <button className="bg-black text-white py-2 px-4 rounded-md">Admin Panel</button>
                        </a>
                    </div>


                </ul>
            </div>

            <div className="navbar-icons flex items-center">
                <img onClick={toggleDesktopSearch} className={`search hidden md:block `} src={Images.search} alt="search icon" />

                {/* --------------------------------- DESKTOP SEARCH ---------------------------------- */}
                <div>
                    <div className={`desktop-search ${desktopSearchOpen ? "showDesktopSearch" : "overflow-hidden"} relative py-10 `}>
                        <div className='flex items-center gap-4 back-icons absolute top-10 right-8' onClick={toggleDesktopSearch}>
                            <FontAwesomeIcon icon={faClose} className='close text-3xl font-extralight' />
                        </div>

                        <div className='w-full flex flex-col items-center mt-5 gap-6'>
                            <h1 className='text-3xl font-medium'>Search our site</h1>
                            <div className='search-bar flex items-center gap-5 px-5 py-2 w-[50%]'>
                                <FontAwesomeIcon icon={faSearch} />
                                <input value={searchQuery} onChange={handleSearch} type="text" className='border-none outline-none w-[100%]' placeholder='Shirts, Bags, Shoes' />
                                {searchQuery.length > 0 && (
                                    <FontAwesomeIcon onClick={() => setSearchQuery("")} className='px-2 py-1 rounded-md border-[1px] border-black' icon={faClose} />
                                )}
                            </div>
                        </div>

                        <div className='w-full flex gap-20 mt-3'>
                            <div className="left-quick-links flex flex-col w-[20%] ">
                                <h1 className='text-xl font-semibold mb-5'>Quick links</h1>
                                <NavLink to={"/Men"}><p className='hover:text-red-600' onClick={toggleDesktopSearch}>Men</p></NavLink>
                                <NavLink to={"/Women"}><p className='hover:text-red-600' onClick={toggleDesktopSearch}>Women</p></NavLink>
                                <NavLink to={"/Accessories"}><p className='hover:text-red-600' onClick={toggleDesktopSearch}>Accessories</p></NavLink>
                                <NavLink to={"/Handbag"}><p className='hover:text-red-600' onClick={toggleDesktopSearch}>Handbags</p></NavLink>
                                <NavLink to={"/Shoes"}><p className='hover:text-red-600' onClick={toggleDesktopSearch}>Shoes</p></NavLink>
                            </div>

                            <div className="right-searched-items w-[80%] h-full">
                                <div onClick={toggleDesktopSearch} className="searched-items sm:grid sm:grid-cols-2 xl:grid xl:grid-cols-3 gap-4 gap-y-6 px-3 w-full">
                                    {searchQuery.trim() === "" ? (
                                        <div className='flex flex-col w-full h-full'>
                                            <h1 className='text-xl font-semibold mb-5'>Need some inspiration?</h1>
                                            <div className="sample-products">
                                                {APIproducts.filter(product => product.category === 'Women').slice(0, 6).map((product) => (
                                                    <ProductItem
                                                        key={product._id}
                                                        id={product._id}
                                                        name={product.name}
                                                        img={product.image}
                                                        sizes={product.size}
                                                        color={product.color}
                                                        discounted_price={product.discounted_price}
                                                        customClass="sample-product-image"
                                                        customClassTwo="sample-product-price"
                                                        customClassThree="sample-product-name"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : searchFilteredProducts.length > 0 ? (
                                        searchFilteredProducts.map((item) => (
                                            <ProductItem
                                                key={item._id}
                                                id={item._id}
                                                name={item.name}
                                                img={item.image}
                                                sizes={item.sizes}
                                                color={item.color}
                                                discounted_price={item.discounted_price}
                                            />
                                        ))
                                    ) : (
                                        <p>No products found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------- DESKTOP LOGIN -------------------------- */}
                <div onClick={toggleLogin} className='group relative '>
                    <img className='login-signup' src={Images.loginSignup} alt="login signup icon" />
                    {token && email && (
                        <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-[1000]">
                            <div className='h-fit flex flex-col gap-2 py-3 px-5 bg-slate-100 text-gray-500 rounded-md'>
                                <p>{email}</p>
                                <p onClick={() => setToken('')} className='cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* LOGIN IMAGE PAR CLICK KARNE PAR AANE WALE ITEMS  */}
                <div className='flex items-center justify-center'>
                    {isLoginOpen && !token && (
                        <div className="overlay" onClick={toggleLogin}>
                            <div
                                className="custom-cursor md:flex items-center justify-center hidden"
                                style={{ top: cursorPosition.y, left: cursorPosition.x }}
                            >
                                <FontAwesomeIcon icon={faTimes} className="cross-icon" />
                            </div>
                        </div>
                    )}
                    <div className={`desktopLoginItems ${isLoginOpen && !token ? 'showDesktopLogin' : ''}`}>
                        <div className="p-10 w-full">
                            <div className="flex items-center justify-between w-full">
                                <h1 className="text-3xl font-normal">
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
                                            <p className="text-[15px]">Already have an account? Log in</p>
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
                                            <p className="text-[15px]">New Customer? Create your account</p>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                <NavLink to={"/cart"}>
                    <div className="cart">
                        <img src={Images.cart} alt="cart icon" />
                        <span>{getCartCount()}</span>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default Navbar;