import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/seller', { withCredentials: true });
      setOrders(res.data.data);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus }, { withCredentials: true });
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">Order Management</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Buyer</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      #{order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {order.buyer?.name || 'Unknown'}<br/>
                      <span className="text-xs text-gray-400">{order.buyer?.phone || ''}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-semibold">
                      ৳{order.totalAmount}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="capitalize text-gray-700">{order.paymentMethod}</span>
                      <span className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button onClick={() => alert('View Details coming soon')} className="text-emerald-600 hover:text-emerald-900">
                        View<span className="sr-only">, {order._id}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
