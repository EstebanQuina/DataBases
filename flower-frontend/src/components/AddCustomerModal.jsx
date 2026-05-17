import React, { useState, useEffect } from 'react';

const AddCustomerModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    Name: '',
    City_name: '',
    Phone: '',
    Email: ''
  });

  // NEW: Determine if we are editing an existing customer
  const isEditMode = !!initialData;

  // NEW: Pre-fill data when opening in Edit Mode
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ Name: '', City_name: '', Phone: '', Email: '' });
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditMode ? 'Edit Client Profile' : 'Add New Customer'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
            
            {/* NEW: Locked System ID visible only during edits */}
            {isEditMode && (
              <div className="col-span-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-2">
                <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Client ID (Immutable)</label>
                <div className="text-sm font-mono text-blue-900">#{formData.Customer_id}</div>
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / Client Name</label>
              <input required type="text" name="Name" value={formData.Name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
              <input required type="text" name="City_name" value={formData.City_name} onChange={handleChange} placeholder="e.g. Quito or Miami" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
              <p className="text-[10px] text-gray-400 mt-1">Must exist in Cities table</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input required type="text" name="Phone" value={formData.Phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input required type="email" name="Email" value={formData.Email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              {isEditMode ? 'Save Changes' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;