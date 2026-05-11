import React, { useState } from 'react';

const AddRecordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split('T')[0],
    Product_id: '',
    Lot_number: '',
    Quantity: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
        Date: formData.Date,
        Product_id: formData.Product_id,
        Lot_number: parseInt(formData.Lot_number, 10), // DB expects integer
        Quantity: parseInt(formData.Quantity, 10)      // DB expects integer
    });
    setFormData({ Date: new Date().toISOString().split('T')[0], Product_id: '', Lot_number: '', Quantity: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Log Daily Production</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required type="date" name="Date" value={formData.Date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <input required type="text" name="Product_id" value={formData.Product_id} onChange={handleChange} placeholder="e.g. P010" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
              <input required type="number" name="Lot_number" value={formData.Lot_number} onChange={handleChange} placeholder="1" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input required type="number" name="Quantity" value={formData.Quantity} onChange={handleChange} placeholder="100" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#2d6a4f] text-white rounded-lg text-sm">Save to Database</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;