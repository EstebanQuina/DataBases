import React, { useState, useEffect } from 'react';

const AddRecordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split('T')[0],
    Product_id: '', // Will start empty to force the user to select one
    Lot_number: '',
    Quantity: ''
  });

  // NEW: State to hold the live list of products
  const [products, setProducts] = useState([]);
  const API_BASE_URL = 'http://127.0.0.1:5000';

  // NEW: Fetch the products whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/products`)
        .then(res => res.json())
        .then(data => {
          setProducts(data.products || []);
        })
        .catch(error => console.error("Error fetching varieties:", error));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure numbers are formatted correctly for the backend
    const payload = {
      ...formData,
      Lot_number: parseInt(formData.Lot_number, 10),
      Quantity: parseInt(formData.Quantity, 10)
    };
    onSave(payload);
    // Reset form after saving
    setFormData({ Date: new Date().toISOString().split('T')[0], Product_id: '', Lot_number: '', Quantity: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Add Production Record</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required type="date" name="Date" value={formData.Date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>

            {/* NEW: The Product ID input is now a dynamic dropdown */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Flower Variety</label>
              <select 
                required 
                name="Product_id" 
                value={formData.Product_id} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white"
              >
                <option value="" disabled>Select a variety...</option>
                {products.map((p, index) => (
                  <option key={index} value={p.Product_id}>
                    {p.Product_id} — {p.Variety_name} ({p.Color})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
              <input required type="number" min="1" name="Lot_number" value={formData.Lot_number} onChange={handleChange} placeholder="e.g. 1" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Stems)</label>
              <input required type="number" min="1" name="Quantity" value={formData.Quantity} onChange={handleChange} placeholder="e.g. 1500" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>

          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg text-sm">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;