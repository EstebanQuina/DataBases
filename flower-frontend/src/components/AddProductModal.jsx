import React, { useState, useEffect } from 'react';

// NEW: Added initialData as a prop
const AddProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    Product_id: '',
    Variety_name: '',
    Color: ''
  });

  // NEW: Check if we are in "Edit Mode"
  const isEditMode = !!initialData;

  // NEW: Pre-fill the form if initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Clear the form if adding a new record
      setFormData({ Product_id: '', Variety_name: '', Color: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEditMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {/* Dynamic Title */}
          <h3 className="text-lg font-bold text-gray-900">
            {isEditMode ? 'Edit Variety' : 'Add New Variety'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <input 
                required 
                type="text" 
                name="Product_id" 
                value={formData.Product_id} 
                onChange={handleChange} 
                placeholder="e.g. P-ROS-02" 
                disabled={isEditMode} // Locks the primary key during edits
                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none ${
                  isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'
                }`} 
              />
              {isEditMode && <p className="text-[10px] text-gray-400 mt-1">Primary Key cannot be changed.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variety Name</label>
              <input required type="text" name="Variety_name" value={formData.Variety_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input required type="text" name="Color" value={formData.Color} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg text-sm">
              {isEditMode ? 'Save Changes' : 'Save Variety'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;