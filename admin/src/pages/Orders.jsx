import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Orders:", response.data.orders);

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const status = event.target.value;

      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data)

      if (response.data.success) {
        toast.success("Order status updated successfully");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to update order status");
    }
  };


  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-6 py-3 border-b border-gray-200">Order #</th>
              <th className="text-left px-6 py-3 border-b border-gray-200">Date</th>
              <th className="text-left px-6 py-3 border-b border-gray-200">Customer Name</th>
              <th className="text-left px-6 py-3 border-b border-gray-200">Payment Status</th>
              <th className="text-left px-6 py-3 border-b border-gray-200">Order Fulfillment</th>
              <th className="text-left px-6 py-3 border-b border-gray-200">Payment Method</th>
              <th className="text-left px-6 py-3 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200">
                    <button className="text-blue-600 hover:underline" onClick={() => navigate(`/orderdetails/${order.userId}`, { state: { orders: orders.filter(o => o.userId === order.userId) } })}>
                      #{index + 1}
                    </button>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {order.address.firstName + " " + order.address.lastName}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-gray-200 `}
                  >
                    {order.paymentMethod === "Stripe" ? "paid" : "pending"}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-gray-200`}
                  >
                    <div className="w-full p-2 border-[1px] border-[#0000003a] rounded-md">
                      <select
                        onChange={(event) => statusHandler(event, order._id)}
                        className="h-full w-full border-none outline-none font-semibold"
                        value={order.status}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">{order.paymentMethod}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <button
                      className="px-4 py-2 bg-[#000000d6] text-white rounded hover:bg-[#000000bc]"
                      onClick={() => navigate(`/orderdetails/${order.userId}`, { state: { orders: orders.filter(o => o.userId === order.userId) } })}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;