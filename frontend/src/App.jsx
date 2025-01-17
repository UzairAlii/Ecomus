import React, { useContext, useEffect } from 'react';
import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from "./pages/HomePage/Home";
import BestSeller from "./pages/BestSeller/Bestseller";
import Collection from "./pages/Collection/Collection";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Orders from "./pages/Orders/Orders";
import Product from "./pages/Products/Product";
import Cart from "./pages/Carts/Cart";
import Checkout from "./pages/CheckOut/Checkout";
import NewArrival from './pages/NewArrival/NewArrival';
import Accessories from './pages/Accessories/Accessories';
import Men from './pages/Men/Men';
import Women from './pages/Women/Women';
import Handbag from './pages/Handbag/Handbag';
import Shoes from './pages/Shoes/Shoes';
import Outwear from './pages/Outwear/Outwear';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import ScrollToTop from './components/ScrollToTop';
import ScrollUpButton from './components/ScrollUpButton';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login';
import PrivateRoute from './components/PrivateRoute';
import { ShopContext } from './context/ShopContext';
import Verify from './pages/verify';

const App = () => {
  const { token } = useContext(ShopContext);
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname === '/checkout';
  const hideBottomNavigation = location.pathname === '/checkout';

  useEffect(() => {
    if (!token && location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [token, location.pathname]);

  return (
    <div className='overflow-hidden relative'>
      <ScrollUpButton />
      <ScrollToTop />
      <ToastContainer />

      {!hideNavbarAndFooter && <Navbar />}
      {!hideBottomNavigation && <BottomNavigation />}

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path='/BestSeller' element={token ? <BestSeller /> : <Navigate to="/login" />} />
        <Route path='/collection' element={token ? <Collection /> : <Navigate to="/login" />} />
        <Route path='/about' element={token ? <About /> : <Navigate to="/login" />} />
        <Route path='/contact' element={token ? <Contact /> : <Navigate to="/login" />} />
        <Route path='/product/:productId' element={token ? <Product /> : <Navigate to="/login" />} />
        <Route path='/NewArrival' element={token ? <NewArrival /> : <Navigate to="/login" />} />
        <Route path='/Accessories' element={token ? <Accessories /> : <Navigate to="/login" />} />
        <Route path='/Men' element={token ? <Men /> : <Navigate to="/login" />} />
        <Route path='/Women' element={token ? <Women /> : <Navigate to="/login" />} />
        <Route path='/Handbag' element={token ? <Handbag /> : <Navigate to="/login" />} />
        <Route path='/Shoes' element={token ? <Shoes /> : <Navigate to="/login" />} />
        <Route path='/Outwear' element={token ? <Outwear /> : <Navigate to="/login" />} />

        {/* Protected Routes */}
        <Route path='/orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path='/verify' element={<PrivateRoute><Verify /></PrivateRoute>} />
        <Route path='/Cart' element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path='/checkout' element={<PrivateRoute><Checkout /></PrivateRoute>} />
      </Routes>

      {!hideNavbarAndFooter && <Footer />}
    </div>
  );
}

export default App;