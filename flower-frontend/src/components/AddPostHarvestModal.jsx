import React, { useState } from 'react';

const AddPostHarvestModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split('T')[0],
    Length: '50.0', // Default to a valid length
    Employee_id: '',
    Product_id: '',
    Quantity: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert Length and Quantity to numbers before sending to Flask
    const payload = {
      ...formData,
      Length: parseFloat(formData.Length),
      Quantity: parseInt(formData.Quantity, 10)
    };
    onSave(payload);
    // Reset form
    setFormData({ Date: new Date().toISOString().split('T')[0], Length: '50.0', Employee_id: '', Product_id: '', Quantity: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Log Post-Harvest Quality Control</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required type="date" name="Date" value={formData.Date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stem Length (cm)</label>
              <select required name="Length" value={formData.Length} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white">
                <option value="40.0">40 cm</option>
                <option value="45.0">45 cm</option>
                <option value="50.0">50 cm</option>
                <option value="55.0">55 cm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input required type="number" name="Employee_id" value={formData.Employee_id} onChange={handleChange} placeholder="e.g. 1" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <input required type="text" name="Product_id" value={formData.Product_id} onChange={handleChange} placeholder="e.g. P-GER-01" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Processed Stems)</label>
              <input required type="number" min="1" name="Quantity" value={formData.Quantity} onChange={handleChange} placeholder="Total stems processed" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#d4a373] hover:bg-[#ccd5ae] transition-colors text-white rounded-lg text-sm">Save Log</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostHarvestModal;