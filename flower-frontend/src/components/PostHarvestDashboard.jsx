import React, { useState, useEffect, useMemo } from 'react';
import AddPostHarvestModal from './AddPostHarvestModal';

const PostHarvestDashboard = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/daily-post-harvest`)
      .then(response => response.json())
      .then(data => {
        setRecords(data.daily_post_harvest || []); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching post-harvest data:", error);
        setIsLoading(false);
      });
  }, []);

  // AUTOMATIC INVENTORY CALCULATOR
  // This groups all individual logs into total available stock by Product and Length
  const inventoryStock = useMemo(() => {
    const stockMap = records.reduce((acc, record) => {
      const key = `${record.Product_id}-${record.Length}`;
      if (!acc[key]) {
        acc[key] = {
          Product_id: record.Product_id,
          Length: record.Length,
          Total_Quantity: 0
        };
      }
      acc[key].Total_Quantity += record.Quantity;
      return acc;
    }, {});

    // Convert the map back to an array and sort it nicely
    return Object.values(stockMap).sort((a, b) => {
      if (a.Product_id === b.Product_id) return b.Length - a.Length;
      return a.Product_id.localeCompare(b.Product_id);
    });
  }, [records]);

  const handleSaveRecord = (newRecord) => {
    fetch(`${API_BASE_URL}/daily-post-harvest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to save record');
        return res.json();
    })
    .then(savedRecord => {
      setRecords([...records, savedRecord]); 
      setIsModalOpen(false);
    })
    .catch(error => alert("Error saving. Make sure the Employee and Product IDs exist!"));
  };

  const handleDeleteRecord = (record) => {
    if (window.confirm("Remove this post-harvest log? This will reduce your calculated inventory.")) {
      fetch(`${API_BASE_URL}/daily-post-harvest/${record.Date}/${record.Length}/${record.Employee_id}/${record.Product_id}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (res.ok) {
          setRecords(records.filter(r => 
            !(r.Date === record.Date && r.Length === record.Length && r.Employee_id === record.Employee_id && r.Product_id === record.Product_id)
          ));
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Post-Harvest Data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* MODULE HEADER */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post-Harvest Processing</h1>
          <p className="text-gray-500 text-sm">Manage flower processing, grading, and finished goods inventory.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#d4a373] hover:bg-[#ccd5ae] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          + Process New Batch
        </button>
      </div>

      {/* TABLE 1: CURRENT INVENTORY STOCK (The Aggregated View) */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Finished Goods Inventory</h2>
          <p className="text-xs text-gray-500">Current stock available for sale, grouped by variety and length.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Variety (Product ID)</th>
                <th className="px-6 py-4 font-medium">Stem Length</th>
                <th className="px-6 py-4 font-medium text-right">Total Processed Stems</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {inventoryStock.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#d4a373]">{item.Product_id}</td>
                  <td className="px-6 py-4">
                    <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-200">
                      {item.Length} cm
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-lg font-bold text-gray-900">
                    {item.Total_Quantity.toLocaleString()}
                  </td>
                </tr>
              ))}
              {inventoryStock.length === 0 && (
                <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No processed inventory available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 2: DAILY PROCESSING LOG (The Raw Data) */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Daily Processing Log</h2>
          <p className="text-xs text-gray-400">Raw historical data of all post-harvest activity.</p>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Employee ID</th>
                <th className="px-6 py-4 font-medium">Product ID</th>
                <th className="px-6 py-4 font-medium">Length</th>
                <th className="px-6 py-4 font-medium">Batch Size</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-900">{record.Date}</td>
                  <td className="px-6 py-4 text-gray-500">#{record.Employee_id}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{record.Product_id}</td>
                  <td className="px-6 py-4 text-gray-600">{record.Length} cm</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{record.Quantity}</td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteRecord(record)} className="text-gray-400 hover:text-red-600 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddPostHarvestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveRecord} />
    </div>
  );
};

export default PostHarvestDashboard;