import React, { useState, useEffect } from 'react';
import AddEmployeeModal from './AddEmployeeModal';

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NEW: State to track which employee is being edited
  const [editingEmployee, setEditingEmployee] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/employees`).then(res => res.json()),
      fetch(`${API_BASE_URL}/departments`).then(res => res.json()).catch(() => ({ departments: [] }))
    ])
    .then(([employeeData, departmentData]) => {
      setEmployees(employeeData.employees || []);
      setDepartments(departmentData.departments || []);
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching HR data:", error);
      setIsLoading(false);
    });
  }, []);

  // NEW: Open modal with specific employee data
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  // NEW: Close and clean up
  const handleCloseModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(false);
  };

  // UPDATED: Now handles both Create (POST) and Update (PUT)
  const handleSaveEmployee = (employeeData, isEditMode) => {
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
        ? `${API_BASE_URL}/employees/${employeeData.Employee_id}` 
        : `${API_BASE_URL}/employees`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'save'} employee`);
        return response.json();
    })
    .then(savedEmployee => {
      if (isEditMode) {
        // Replace the old record with the new one
        setEmployees(employees.map(emp => emp.Employee_id === savedEmployee.Employee_id ? savedEmployee : emp));
      } else {
        // Add the brand new employee to the list
        setEmployees([...employees, savedEmployee]); 
      }
      handleCloseModal();
    })
    .catch(error => alert(`Error saving employee: ${error.message}`));
  };

  const handleDeleteEmployee = (idToDelete) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      fetch(`${API_BASE_URL}/employees/${idToDelete}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          setEmployees(employees.filter(emp => emp.Employee_id !== idToDelete));
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading HR Database...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
          <p className="text-gray-500 text-sm">Manage farm staff, departments, and roles.</p>
        </div>
        {/* UPDATED: Pass null when adding a new employee */}
        <button onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          + Add Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Active Staff Directory</h2>
            <p className="text-xs text-gray-500">{employees.length} total employees registered</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Employee Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Hired</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {employees.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-gray-500">#{emp.Employee_id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{emp.Name} {emp.Last_name}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.Role}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-200">
                      {emp.Department_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{emp.Hiring_date}</td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity space-x-3">
                      {/* NEW: Edit Button added next to Remove */}
                      <button onClick={() => handleEditClick(emp)} className="text-gray-400 hover:text-blue-600 text-xs font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDeleteEmployee(emp.Employee_id)} className="text-gray-400 hover:text-red-600 text-xs font-medium transition-colors">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveEmployee} 
        departments={departments} 
        initialData={editingEmployee} // NEW: Pass the state here
      />
    </div>
  );
};

export default HRDashboard;