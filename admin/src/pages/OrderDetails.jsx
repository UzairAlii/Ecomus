import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { currency } from '../App';

const OrderDetails = ({ token }) => {
  const { userId } = useParams();
  const location = useLocation();
  const [orders, setOrders] = useState(location.state?.orders || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const shippingFee = 10;

  useEffect(() => {
    if (orders.length > 0) {
      calculateTotal(orders);
    }
  }, [orders]);

  const calculateTotal = (orders) => {
    let total = 0;
    orders.forEach(order => {
      total += order.items.reduce((sum, item) => {
        return sum + item.discounted_price * item.quantity;
      }, 0);
    });
    setTotalPrice(total);
  };

  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-6">
        <h2 className="text-lg md:text-2xl font-semibold mr-4">Order Details</h2>
        <div className="bg-gray-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm md:text-lg">
        {totalItems}
        </div>
      </div>

      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 mb-4 flex flex-col gap-4"
          >
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border-b pb-4 last:border-b-0"
              >
                <img
                  src={item.image[item.imageIndex]}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h4 className="text-sm md:text-base font-semibold">{item.name}</h4>
                  <p className="text-xs md:text-sm text-gray-600">Color: {item.color}</p>
                  <p className="text-xs md:text-sm text-gray-600">Size: {item.size}</p>
                </div>
                <div className="flex-1 text-center text-sm md:text-base">{currency}{item.discounted_price}</div>
                <div className="flex-1 text-center text-sm md:text-base">{item.quantity}</div>
                <div className="flex-1 text-center text-sm md:text-base font-semibold">
                  {currency}{item.discounted_price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}

      <div>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 mb-4 flex flex-col gap-4"
          >
            <h1 className='text-lg md:text-2xl font-semibold mr-4'>Shipping details</h1>
            <p>Name : <span className='font-semibold'>{order.address.firstName + " " + order.address.lastName}</span></p>
            <p>Email : <span className='font-semibold'>{order.address.email}</span></p>
            <p>Phone : <span className='font-semibold'>{order.address.phone}</span></p>
            <p>City : <span className='font-semibold'>{order.address.city}</span></p>
            <p>Zip Code : <span className='font-semibold'>{order.address.postalCode}</span></p>
            <p>Address : <span className='font-semibold'>{order.address.address}</span></p>
            <p>Payment : <span className='font-semibold'>{order.paymentMethod === "Stripe" ? "paid" : "pending"}</span></p>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
      </div>

      <div className="mt-6 text-right text-sm md:text-base">
        <p>Total Price: {currency}{totalPrice.toFixed(2)}</p>
        <p>Shipping Fee: {currency}{shippingFee.toFixed(2)}</p>
        <p className="font-semibold">Total Amount: {currency}{(totalPrice + shippingFee).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderDetails;