import React, { useState } from 'react';

const AddLotModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    Lot_number: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If they typed a number, send it. If blank, send an empty object so MySQL auto-increments.
    const payload = formData.Lot_number ? { Lot_number: parseInt(formData.Lot_number, 10) } : {};
    onSave(payload);
    setFormData({ Lot_number: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Add Crop Lot</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
            <input 
              type="number" 
              name="Lot_number" 
              value={formData.Lot_number} 
              onChange={handleChange} 
              placeholder="Leave blank to auto-assign" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" 
            />
            <p className="text-xs text-gray-400 mt-2">MySQL will automatically assign the next available number if left blank.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg text-sm">Save Lot</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLotModal;