import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import OrderDetails from "./pages/OrderDetails";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
      if (!token && location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }, [token, location.pathname]);

     useEffect(() => {
            localStorage.setItem('admin_token', token);
        }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen relative overflow-x-hidden">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} toggleSidebar={toggleSidebar} />
          <hr />
          <div className="flex w-full">
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[1000]"
                onClick={closeSidebar}
              ></div>
            )}
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <div className="w-full p-5 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Add token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/orderdetails/:userId" element={<OrderDetails token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;