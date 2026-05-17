import React, { useState, useEffect } from 'react';

const AddPostHarvestModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split('T')[0],
    Length: '50.0', 
    Employee_id: '',
    Product_id: '',
    Quantity: ''
  });

  const [products, setProducts] = useState([]);
  const API_BASE_URL = 'http://127.0.0.1:5000';

  // NEW: Check if we are editing an existing log
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/products`)
        .then(res => res.json())
        .then(data => setProducts(data.products || []))
        .catch(error => console.error("Error fetching varieties:", error));
    }
  }, [isOpen]);

  // NEW: Pre-fill data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ Date: new Date().toISOString().split('T')[0], Length: '50.0', Employee_id: '', Product_id: '', Quantity: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      Length: parseFloat(formData.Length),
      Quantity: parseInt(formData.Quantity, 10)
    };
    onSave(payload, isEditMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditMode ? 'Edit Processing Log' : 'Log Post-Harvest Quality Control'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          {/* NEW: Warning banner explaining the locked fields */}
          {isEditMode && (
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-5">
              <p className="text-xs text-orange-800 font-medium">
                <strong>Composite Key Locked:</strong> You are modifying an existing log. You may only update the Quantity. To change the Date, Length, Employee, or Variety, you must delete this log and create a new one.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required type="date" name="Date" value={formData.Date} onChange={handleChange} disabled={isEditMode} className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none ${isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stem Length (cm)</label>
              <select required name="Length" value={formData.Length} onChange={handleChange} disabled={isEditMode} className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none ${isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 bg-white'}`}>
                <option value="40.0">40 cm</option>
                <option value="45.0">45 cm</option>
                <option value="50.0">50 cm</option>
                <option value="55.0">55 cm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input required type="number" name="Employee_id" value={formData.Employee_id} onChange={handleChange} disabled={isEditMode} className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none ${isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flower Variety</label>
              <select required name="Product_id" value={formData.Product_id} onChange={handleChange} disabled={isEditMode} className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none ${isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 bg-white'}`}>
                <option value="" disabled>Select a variety...</option>
                {products.map((p, index) => (
                  <option key={index} value={p.Product_id}>
                    {p.Product_id} — {p.Variety_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity is the ONLY field that remains enabled during Edit Mode */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Processed Stems)</label>
              <input required type="number" min="1" name="Quantity" value={formData.Quantity} onChange={handleChange} placeholder="Total stems processed" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none font-bold text-gray-900 focus:ring-2 focus:ring-[#ccd5ae]" />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#d4a373] hover:bg-[#ccd5ae] transition-colors text-white rounded-lg text-sm">
              {isEditMode ? 'Update Quantity' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostHarvestModal;