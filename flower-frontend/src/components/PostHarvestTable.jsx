import React, { useState, useEffect } from 'react';
import AddPostHarvestModal from './AddPostHarvestModal';

const PostHarvestTable = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/daily-post-harvest`)
      .then(response => response.json())
      .then(data => {
        // The API returns {"daily_post_harvest": [...]}
        setRecords(data.daily_post_harvest || []); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching post-harvest data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSaveRecord = (newRecord) => {
    fetch(`${API_BASE_URL}/daily-post-harvest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save record');
        return response.json();
    })
    .then(savedRecord => {
      setRecords([...records, savedRecord]); 
      setIsModalOpen(false);
    })
    .catch(error => console.error("Error saving:", error));
  };

  const handleDeleteRecord = (record) => {
    const confirmDelete = window.confirm("Remove this post-harvest log?");
    if (confirmDelete) {
      // Deleting a row with a 4-part composite primary key
      fetch(`${API_BASE_URL}/daily-post-harvest/${record.Date}/${record.Length}/${record.Employee_id}/${record.Product_id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          setRecords(records.filter(r => 
            !(r.Date === record.Date && 
              r.Length === record.Length && 
              r.Employee_id === record.Employee_id && 
              r.Product_id === record.Product_id)
          ));
        } else {
            console.error("Failed to delete record");
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading QC data...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Post-Harvest Quality Control</h2>
          <p className="text-xs text-gray-400">Grading and Length Categorization</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#d4a373] hover:bg-[#ccd5ae] text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + Log QC Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Employee ID</th>
              <th className="px-6 py-4 font-medium">Product ID</th>
              <th className="px-6 py-4 font-medium">Length</th>
              <th className="px-6 py-4 font-medium">Total Stems</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">{record.Date}</td>
                <td className="px-6 py-4 text-gray-500">#{record.Employee_id}</td>
                <td className="px-6 py-4 font-mono text-gray-600">{record.Product_id}</td>
                <td className="px-6 py-4">
                  <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-200">
                    {record.Length} cm
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">{record.Quantity}</td>
                <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteRecord(record)} className="text-gray-400 hover:text-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddPostHarvestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveRecord} />
    </div>
  );
};

export default PostHarvestTable;