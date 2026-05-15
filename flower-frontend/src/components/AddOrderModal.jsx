import React, { useState } from 'react';

const AddOrderModal = ({ isOpen, onClose, onSave, customers }) => {
  const [formData, setFormData] = useState({
    Order_id: '',
    Date: new Date().toISOString().split('T')[0],
    Customer_id: '',
    Dispatch_date: '',
    Description: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      Customer_id: parseInt(formData.Customer_id, 10)
    };
    onSave(payload);
    setFormData({ Order_id: '', Date: new Date().toISOString().split('T')[0], Customer_id: '', Dispatch_date: '', Description: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Create New Order</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <input required type="text" name="Order_id" value={formData.Order_id} onChange={handleChange} placeholder="e.g. ORD-101" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select required name="Customer_id" value={formData.Customer_id} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white">
                <option value="" disabled>Select a client...</option>
                {customers.map(c => (
                  <option key={c.Customer_id} value={c.Customer_id}>{c.Name} (#{c.Customer_id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
              <input required type="date" name="Date" value={formData.Date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Date</label>
              <input required type="date" name="Dispatch_date" value={formData.Dispatch_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
              <input required type="text" name="Description" value={formData.Description} onChange={handleChange} placeholder="e.g. Valentine's Day Export" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">Save Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;