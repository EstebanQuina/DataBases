import React, { useState } from 'react';

const AddEmployeeModal = ({ isOpen, onClose, onSave, departments }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Last_name: '',
    Role: '',
    Department_name: '', // Starts empty to force a valid selection
    Hiring_date: new Date().toISOString().split('T')[0],
    Birth_date: '',
    Sex: 'M'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form after saving
    setFormData({ Name: '', Last_name: '', Role: '', Department_name: '', Hiring_date: new Date().toISOString().split('T')[0], Birth_date: '', Sex: 'M' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Register New Employee</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-5 mb-6">
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

            {/* DYNAMIC DROPDOWN FOR DEPARTMENTS */}
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
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;