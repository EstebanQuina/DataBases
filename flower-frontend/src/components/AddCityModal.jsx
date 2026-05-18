import React, { useState, useEffect } from 'react';

const AddCityModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    City_name: '',
    Country: ''
  });

  // Check if we are editing an existing city
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ City_name: '', Country: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEditMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditMode ? 'Edit City' : 'Add Export Destination'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 mb-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
              <input 
                required 
                type="text" 
                name="City_name" 
                value={formData.City_name} 
                onChange={handleChange} 
                disabled={isEditMode}
                placeholder="e.g. Bogota"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none ${isEditMode ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`} 
              />
              {isEditMode && <p className="text-[10px] text-gray-400 mt-1">Primary Key cannot be changed.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input 
                required 
                type="text" 
                name="Country" 
                value={formData.Country} 
                onChange={handleChange} 
                placeholder="e.g. Colombia"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" 
              />
            </div>
            
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              {isEditMode ? 'Save Changes' : 'Save City'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCityModal;