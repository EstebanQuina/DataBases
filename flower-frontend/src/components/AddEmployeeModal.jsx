import React, { useState, useEffect } from 'react';

const AddEmployeeModal = ({ isOpen, onClose, onSave, departments, initialData }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Last_name: '',
    Role: '',
    Department_name: '',
    Hiring_date: new Date().toISOString().split('T')[0],
    Birth_date: '',
    Sex: 'M'
  });

  // NEW: Check if we are in "Edit Mode"
  const isEditMode = !!initialData;

  // NEW: Pre-fill the form if initialData is provided
  useEffect(() => {
    if (initialData) {
      // Ensure dates are correctly formatted for the HTML date input
      setFormData(initialData);
    } else {
      // Clear the form if adding a new record
      setFormData({ 
        Name: '', Last_name: '', Role: '', Department_name: '', 
        Hiring_date: new Date().toISOString().split('T')[0], Birth_date: '', Sex: 'M' 
      });
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditMode ? 'Edit Employee Profile' : 'Register New Employee'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
            
            {/* NEW: Only show the Employee ID field if we are editing, and lock it! */}
            {isEditMode && (
              <div className="col-span-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-2">
                <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">System ID (Immutable)</label>
                <div className="text-sm font-mono text-blue-900">#{formData.Employee_id}</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input required type="text" name="Name" value={formData.Name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input required type="text" name="Last_name" value={formData.Last_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position</label>
              <input required type="text" name="Role" value={formData.Role} onChange={handleChange} placeholder="e.g. Harvester" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select required name="Department_name" value={formData.Department_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white">
                <option value="" disabled>Select a department...</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.Department_name}>{dept.Department_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
              <input required type="date" name="Birth_date" value={formData.Birth_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Date</label>
              <input required type="date" name="Hiring_date" value={formData.Hiring_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
              <select name="Sex" value={formData.Sex} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white">
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              {isEditMode ? 'Save Changes' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;