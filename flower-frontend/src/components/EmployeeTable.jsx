import React, { useState, useEffect } from 'react';
import AddEmployeeModal from './AddEmployeeModal';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/employees`)
      .then(response => response.json())
      .then(data => {
        setEmployees(data.employees || []); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching employees:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSaveEmployee = (newEmployee) => {
    fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save employee');
        return response.json();
    })
    .then(savedEmployee => {
      setEmployees([...employees, savedEmployee]); 
      setIsModalOpen(false);
    })
    .catch(error => console.error("Error saving:", error));
  };

  const handleDeleteEmployee = (idToDelete) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this employee?");
    if (confirmDelete) {
      fetch(`${API_BASE_URL}/employees/${idToDelete}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          setEmployees(employees.filter(emp => emp.Employee_id !== idToDelete));
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading HR database...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Human Resources</h2>
          <p className="text-xs text-gray-400">Active Staff Directory</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + Add Employee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Employee Name</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium">Hired</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-gray-600">{emp.Employee_id}</td>
                {/* We combine First and Last name for a cleaner UI */}
                <td className="px-6 py-4 font-medium text-gray-900">{emp.Name} {emp.Last_name}</td>
                <td className="px-6 py-4 text-gray-600">{emp.Role}</td>
                <td className="px-6 py-4 text-gray-500">
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-200">
                    {emp.Department_name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{emp.Hiring_date}</td>
                <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteEmployee(emp.Employee_id)} className="text-gray-400 hover:text-red-600 transition-colors">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEmployee} />
    </div>
  );
};

export default EmployeeTable;