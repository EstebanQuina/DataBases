import React, { useState, useEffect } from 'react';
import AddRecordModal from './AddRecordModal';

const ProductionTable = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NEW: State for tracking edits
  const [editingRecord, setEditingRecord] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/daily-production`)
      .then(response => response.json())
      .then(data => {
        setRecords(data.daily_production || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // NEW: Modal handlers
  const handleEditClick = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRecord(null);
    setIsModalOpen(false);
  };

  // UPDATED: Now supports POST and PUT using a 3-part Composite URL
  const handleSaveRecord = (recordData, isEditMode) => {
    const method = isEditMode ? 'PUT' : 'POST';
    
    // The PUT URL strictly requires Date, Product_id, and Lot_number to find the unique row
    const url = isEditMode 
      ? `${API_BASE_URL}/daily-production/${recordData.Date}/${recordData.Product_id}/${recordData.Lot_number}` 
      : `${API_BASE_URL}/daily-production`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save record');
        return response.json();
    })
    .then(savedRecord => {
      if (isEditMode) {
        // Find the exact matching composite key and update it
        setRecords(records.map(r => 
          (r.Date === savedRecord.Date && r.Product_id === savedRecord.Product_id && r.Lot_number === savedRecord.Lot_number)
            ? savedRecord 
            : r
        ));
      } else {
        setRecords([...records, savedRecord]); 
      }
      handleCloseModal();
    })
    .catch(error => alert("Error saving record. Check database constraints."));
  };

  const handleDeleteRecord = (record) => {
    if (window.confirm("Delete this production record?")) {
      fetch(`${API_BASE_URL}/daily-production/${record.Date}/${record.Product_id}/${record.Lot_number}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          setRecords(records.filter(r => 
            !(r.Date === record.Date && r.Product_id === record.Product_id && r.Lot_number === record.Lot_number)
          ));
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Daily Production...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daily Production Log</h2>
          <p className="text-xs text-gray-400">Raw harvest data from the greenhouse</p>
        </div>
        <button onClick={() => { setEditingRecord(null); setIsModalOpen(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + Add New Record
        </button>
      </div>
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Product ID</th>
              <th className="px-6 py-4 font-medium">Lot Number</th>
              <th className="px-6 py-4 font-medium">Quantity (Stems)</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">{record.Date}</td>
                <td className="px-6 py-4 font-mono font-bold text-green-700">{record.Product_id}</td>
                <td className="px-6 py-4 text-gray-600">Lot #{record.Lot_number}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{record.Quantity}</td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity space-x-3">
                    {/* NEW: Edit Button */}
                    <button onClick={() => handleEditClick(record)} className="text-gray-400 hover:text-blue-600 text-xs font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDeleteRecord(record)} className="text-gray-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <AddRecordModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveRecord} 
        initialData={editingRecord}
      />
    </div>
  );
};

export default ProductionTable;