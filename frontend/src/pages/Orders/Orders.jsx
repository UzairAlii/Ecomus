import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return;
      }

      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });
      if (response.data.success) {
        const allOrders = response.data.orders.map((order) =>
          order.items.map((item) => ({
            ...item,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            orderDate: new Date(order.date).toLocaleDateString(),
          }))
        ).flat();
        setOrderData(allOrders.reverse());
      }
    } catch (error) {
      console.error('Error fetching order data:', error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="flex flex-col p-5">
      {orderData.length == 0 ? (
        <div className='h-fit w-full flex flex-col text-center items-center justify-center py-28 gap-6'>
          <h1 className='text-3xl font-semibold'>You have not order anything</h1>
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
        <div className="mt-10 space-y-4">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

          {orderData.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg flex flex-col md:flex-row items-center md:justify-between gap-4">
              <div className="flex items-center gap-5">
                <img className="w-20 h-20 object-cover rounded-lg" src={item.image[item.imageIndex]} alt={item.name} />
                <div>
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <div className="text-sm text-gray-600 flex sm:flex-row flex-col items-start sm:items-center sm:gap-2">
                    <p>Price: {currency}{item.discounted_price},</p>
                    <p>Quantity: {item.quantity},</p>
                    <p>Size: {item.size},</p>
                    <p>Color: {item.color}</p>
                  </div>
                  <p className="text-sm text-gray-500">Order Date: {item.orderDate}</p>
                  <p className="text-sm text-gray-500">Payment: {item.paymentMethod}</p>
                </div>
              </div>
              <div className="text-sm text-green-500 font-medium">{item.status}</div>
              <button onClick={loadOrderData} className="border border-gray-800 py-2 px-4 bg-white hover:bg-gray-100 rounded-md text-black">Track Order</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
