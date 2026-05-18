import React, { useState, useEffect } from 'react';
import AddCustomerModal from './AddCustomerModal';
import AddOrderModal from './AddOrderModal';
import AddCityModal from './AddCityModal';

const OrdersDashboard = () => {
  const [cities, setCities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const [editingCity, setEditingCity] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    // Fetch Cities alongside Customers and Orders
    Promise.all([
      fetch(`${API_BASE_URL}/cities`).then(res => res.json()),
      fetch(`${API_BASE_URL}/customers`).then(res => res.json()),
      fetch(`${API_BASE_URL}/orders`).then(res => res.json())
    ])
    .then(([cityData, customerData, orderData]) => {
      setCities(cityData.cities || []);
      setCustomers(customerData.customers || []);
      setOrders(orderData.orders || []);
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching sales data:", error);
      setIsLoading(false);
    });
  }, []);

  // --- CITY HANDLERS ---
  const handleEditCityClick = (city) => {
    setEditingCity(city);
    setIsCityModalOpen(true);
  };

  const handleSaveCity = (cityData, isEditMode) => {
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
        ? `${API_BASE_URL}/cities/${cityData.City_name}` 
        : `${API_BASE_URL}/cities`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityData)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save city');
      return res.json();
    })
    .then(saved => {
      if (isEditMode) {
        setCities(cities.map(c => c.City_name === saved.City_name ? saved : c));
      } else {
        setCities([...cities, saved]);
      }
      setEditingCity(null);
      setIsCityModalOpen(false);
    })
    .catch(err => alert("Error saving city. Check database constraints."));
  };

  const handleDeleteCity = (id) => {
    if (window.confirm("Delete this city? This will fail if there are customers registered to it.")) {
      fetch(`${API_BASE_URL}/cities/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) setCities(cities.filter(c => c.City_name !== id));
        });
    }
  };

  // --- CUSTOMER HANDLERS ---
  const handleEditCustomerClick = (customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (customerData, isEditMode) => {
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
        ? `${API_BASE_URL}/customers/${customerData.Customer_id}` 
        : `${API_BASE_URL}/customers`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save customer');
      return res.json();
    })
    .then(saved => {
      if (isEditMode) {
        setCustomers(customers.map(c => c.Customer_id === saved.Customer_id ? saved : c));
      } else {
        setCustomers([...customers, saved]);
      }
      setEditingCustomer(null);
      setIsCustomerModalOpen(false);
    })
    .catch(err => alert("Error saving customer. Make sure the City exists and the Email is unique."));
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm("Delete this customer? This will fail if they have active orders.")) {
      fetch(`${API_BASE_URL}/customers/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) setCustomers(customers.filter(c => c.Customer_id !== id));
        });
    }
  };

  // --- ORDER HANDLERS ---
  const handleSaveOrder = (newOrder) => {
    fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save order');
      return res.json();
    })
    .then(saved => {
      setOrders([...orders, saved]);
      setIsOrderModalOpen(false);
    })
    .catch(err => alert("Error saving order. Check your constraints."));
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
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales & Orders</h1>
        <p className="text-gray-500 text-sm">Manage export destinations, client relationships, and outbound shipments.</p>
      </div>

      {/* TABLE 0: CITIES */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Export Destinations</h2>
            <p className="text-xs text-gray-400">Master list of approved delivery cities</p>
          </div>
          <button onClick={() => { setEditingCity(null); setIsCityModalOpen(true); }} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            + Add City
          </button>
        </div>
        <div className="overflow-x-auto max-h-[250px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">City Name</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cities.map((city, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900">{city.City_name}</td>
                  <td className="px-6 py-4 text-gray-600">{city.Country}</td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity space-x-3">
                    <button onClick={() => handleEditCityClick(city)} className="text-gray-400 hover:text-blue-600 text-xs font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDeleteCity(city.City_name)} className="text-gray-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 1: CUSTOMERS */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Client Directory</h2>
            <p className="text-xs text-gray-400">{customers.length} registered customers</p>
          </div>
          <button onClick={() => { setEditingCustomer(null); setIsCustomerModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
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
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">{c.City_name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div>{c.Email}</div>
                    <div className="text-xs">{c.Phone}</div>
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity space-x-3">
                    <button onClick={() => handleEditCustomerClick(c)} className="text-gray-400 hover:text-blue-600 text-xs font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDeleteCustomer(c.Customer_id)} className="text-gray-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
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
          <button onClick={() => setIsOrderModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
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
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteOrder(o.Order_id)} className="text-gray-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddCityModal 
        isOpen={isCityModalOpen} 
        onClose={() => { setEditingCity(null); setIsCityModalOpen(false); }} 
        onSave={handleSaveCity} 
        initialData={editingCity}
      />
      
      <AddCustomerModal 
        isOpen={isCustomerModalOpen} 
        onClose={() => { setEditingCustomer(null); setIsCustomerModalOpen(false); }} 
        onSave={handleSaveCustomer} 
        initialData={editingCustomer}
      />
      
      <AddOrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        onSave={handleSaveOrder} 
        customers={customers} 
      />

    </div>
  );
};

export default OrdersDashboard;