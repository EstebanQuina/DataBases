import React, { useState, useEffect } from 'react';
import AddProductModal from './AddProductModal';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.products || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSaveProduct = (newProduct) => {
    fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save product');
        return response.json();
    })
    .then(savedProduct => {
      setProducts([...products, savedProduct]); 
      setIsModalOpen(false);
    })
    .catch(error => console.error("Error saving:", error));
  };

  const handleDeleteProduct = (idToDelete) => {
    const confirmDelete = window.confirm("Delete this variety? This will fail if there are production records tied to it.");
    if (confirmDelete) {
      fetch(`${API_BASE_URL}/products/${idToDelete}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          setProducts(products.filter(p => p.Product_id !== idToDelete));
        }
      })
      .catch(error => console.error("Error deleting:", error));
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Varieties...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Flower Varieties</h2>
          <p className="text-xs text-gray-400">Master catalog of active crops</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          + Add Variety
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Product ID</th>
              <th className="px-6 py-4 font-medium">Variety Name</th>
              <th className="px-6 py-4 font-medium">Color</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono font-bold text-green-700">{product.Product_id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{product.Variety_name}</td>
                <td className="px-6 py-4 text-gray-600">{product.Color}</td>
                <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteProduct(product.Product_id)} className="text-gray-400 hover:text-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />
    </div>
  );
};

export default ProductTable;