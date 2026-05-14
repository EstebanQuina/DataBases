import React, { useState, useEffect } from 'react';
import AddLotModal from './AddLotModal';

const LotTable = () => {
  const [lots, setLots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/lots`)
      .then(response => response.json())
      .then(data => {
        setLots(data.lots || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching lots:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSaveLot = (newLot) => {
    fetch(`${API_BASE_URL}/lots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLot)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save lot');
        return response.json();
    })
    .then(savedLot => {
      // Append the new lot and sort them numerically so they stay in order
      const updatedLots = [...lots, savedLot].sort((a, b) => a.Lot_number - b.Lot_number);
      setLots(updatedLots); 
      setIsModalOpen(false);
    })
    .catch(error => console.error("Error saving:", error));
  };

  const handleDeleteLot = (idToDelete) => {
    const confirmDelete = window.confirm("Delete this lot? This will fail if there are plants currently growing in it.");
    if (confirmDelete) {
      fetch(`${API_BASE_URL}/lots/${idToDelete}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          setLots(lots.filter(l => l.Lot_number !== idToDelete));
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Lots...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden mb-8 h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Active Lots</h2>
          <p className="text-xs text-gray-400">Greenhouse planting zones</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + Add Lot
        </button>
      </div>
      <div className="overflow-y-auto max-h-[300px]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-medium">Lot Number</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lots.map((lot, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono font-bold text-gray-900">Lot #{lot.Lot_number}</td>
                <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteLot(lot.Lot_number)} className="text-gray-400 hover:text-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddLotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLot} />
    </div>
  );
};

export default LotTable;