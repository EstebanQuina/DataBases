import React, { useState, useEffect } from 'react';
import AddRecordModal from './AddRecordModal';

const ProductionTable = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  // 1. GET (Read from Flask)
  useEffect(() => {
    fetch(`${API_BASE_URL}/daily-production`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        // We extract the array using the exact key your partner defined in the Flask route
        setRecords(data.daily_production);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Connecting to database...</div>;

  // 2. POST (Create via Flask)
  const handleSaveRecord = (newRecord) => {
    fetch(`${API_BASE_URL}/daily-production`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save record');
        return response.json();
    })
    .then(savedRecord => {
      // Assuming the backend returns the saved record, add it to the UI
      setRecords([...records, savedRecord]); 
      setIsModalOpen(false);
    })
    .catch(error => console.error("Error saving:", error));
  };

  // 3. DELETE (Delete via Flask)
  const handleDeleteRecord = (record) => {
    const confirmDelete = window.confirm("Delete this record from the database?");
    if (confirmDelete) {
      // Passing the composite primary key to the URL
      fetch(`${API_BASE_URL}/daily-production/${record.Date}/${record.Product_id}/${record.Lot_number}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          // Remove it from the UI by filtering out the exact match
          setRecords(records.filter(r => 
            !(r.Date === record.Date && r.Product_id === record.Product_id && r.Lot_number === record.Lot_number)
          ));
        } else {
            console.error("Failed to delete record from database");
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daily Production Tracker</h2>
          <p className="text-xs text-gray-400">{records.length} records retrieved from MySQL</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#2d6a4f] hover:bg-[#1b4332] transition-colors text-white px-4 py-2 rounded-lg text-sm">
          + Add New Record
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Product ID</th>
              <th className="px-6 py-4 font-medium">Lot Number</th>
              <th className="px-6 py-4 font-medium">Quantity</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 text-gray-900">{record.Date}</td>
                <td className="px-6 py-4 font-mono text-gray-600">{record.Product_id}</td>
                <td className="px-6 py-4 text-gray-900">{record.Lot_number}</td>
                <td className="px-6 py-4 font-medium">{record.Quantity}</td>
                <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteRecord(record)} className="text-gray-400 hover:text-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddRecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveRecord} />
    </div>
  );
};

export default ProductionTable;