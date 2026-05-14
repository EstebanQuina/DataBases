import React, { useState, useEffect } from 'react';

const OrdersDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    // Fetch both endpoints at the exact same time
    Promise.all([
      fetch(`${API_BASE_URL}/customers`).then(res => res.json()),
      fetch(`${API_BASE_URL}/orders`).then(res => res.json())
    ])
    .then(([customerData, orderData]) => {
      setCustomers(customerData.customers || []);
      setOrders(orderData.orders || []);
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching sales data:", error);
      setIsLoading(false);
    });
  }, []);

  const handleDeleteCustomer = (id) => {
    if (window.confirm("Delete this customer? This will fail if they have active orders due to strict Foreign Key constraints.")) {
      fetch(`${API_BASE_URL}/customers/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) setCustomers(customers.filter(c => c.Customer_id !== id));
        });
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Delete this order?")) {
      fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) setOrders(orders.filter(o => o.Order_id !== id));
        });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Sales Database...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* MODULE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales & Orders</h1>
        <p className="text-gray-500 text-sm">Manage client relationships and track outbound flower shipments.</p>
      </div>

      {/* TABLE 1: CUSTOMERS */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Client Directory</h2>
            <p className="text-xs text-gray-400">{customers.length} registered customers</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            + Add Customer
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Client Name</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-gray-600">#{c.Customer_id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.Name}</td>
                  <td className="px-6 py-4 text-gray-600">{c.City_name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div>{c.Email}</div>
                    <div className="text-xs">{c.Phone}</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteCustomer(c.Customer_id)} className="text-gray-400 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 2: ORDERS */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Active Orders</h2>
            <p className="text-xs text-gray-400">{orders.length} orders pending dispatch</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            + Create Order
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer ID</th>
                <th className="px-6 py-4 font-medium">Order Date</th>
                <th className="px-6 py-4 font-medium">Dispatch Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-purple-700">{o.Order_id}</td>
                  <td className="px-6 py-4 text-gray-600">#{o.Customer_id}</td>
                  <td className="px-6 py-4 text-gray-500">{o.Date}</td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium border border-purple-200">
                      {o.Dispatch_date}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 truncate max-w-xs">{o.Description}</td>
                  <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteOrder(o.Order_id)} className="text-gray-400 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OrdersDashboard;