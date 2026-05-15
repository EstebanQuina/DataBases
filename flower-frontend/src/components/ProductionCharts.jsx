import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend, Cell 
} from 'recharts';

const ProductionCharts = ({ records }) => {
  // NEW: State to hold our master list of products so we can look up their colors
  const [products, setProducts] = useState([]);
  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(err => console.error("Error fetching products for charts:", err));
  }, []);

  // NEW: Smart color translator. It reads the string from your database and returns a hex code.
  const getChartColor = (colorName) => {
    if (!colorName) return "#52b788"; // Default Green
    const c = colorName.toLowerCase();
    
    if (c.includes('red')) return '#e63946';
    if (c.includes('pink')) return '#ffb5a7';
    if (c.includes('white')) return '#e5e5e5';
    if (c.includes('yellow')) return '#ffe66d';
    if (c.includes('orange')) return '#f4a261';
    if (c.includes('purple') || c.includes('lavender')) return '#9d4edd';
    if (c.includes('blue')) return '#48cae4';
    
    return '#52b788'; // Fallback if the color doesn't match the above
  };

  const COLORS = ['#2d6a4f', '#52b788', '#74c69d', '#b7e4c7', '#d8f3dc', '#02c39a', '#00a896', '#028090'];

  // 1. UPDATED: Process data for the Bar Chart
  const productData = useMemo(() => {
    const totals = records.reduce((acc, record) => {
      acc[record.Product_id] = (acc[record.Product_id] || 0) + record.Quantity;
      return acc;
    }, {});
    
    return Object.keys(totals).map(key => {
      // Look up the product in our fetched database list
      const matchedProduct = products.find(p => p.Product_id === key);
      const dbColor = matchedProduct ? matchedProduct.Color : null;

      return {
        name: key,
        total: totals[key],
        // Assign the exact hex color for this specific bar
        barColor: getChartColor(dbColor)
      };
    }).sort((a, b) => b.total - a.total);
  }, [records, products]);

  // 2. Process data for the Line Chart (Overall Production Trend)
  const trendData = useMemo(() => {
    const dailyTotals = records.reduce((acc, record) => {
      acc[record.Date] = (acc[record.Date] || 0) + record.Quantity;
      return acc;
    }, {});

    return Object.keys(dailyTotals).sort().map(date => ({
      date: date,
      stems: dailyTotals[date]
    }));
  }, [records]);

  // 3. Process data for the Stacked Area Chart (History by Lot)
  const lotHistoryData = useMemo(() => {
    const uniqueLots = [...new Set(records.map(r => r.Lot_number))].sort((a, b) => a - b);
    const grouped = records.reduce((acc, record) => {
      if (!acc[record.Date]) {
        acc[record.Date] = { date: record.Date };
        uniqueLots.forEach(lot => acc[record.Date][`Lot ${lot}`] = 0);
      }
      acc[record.Date][`Lot ${record.Lot_number}`] += record.Quantity;
      return acc;
    }, {});

    return {
      data: Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)),
      lots: uniqueLots
    };
  }, [records]);

  if (!records || records.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* Chart 1: Production Trend */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Daily Yield Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="stems" stroke="#2d6a4f" strokeWidth={3} dot={{ r: 4, fill: '#2d6a4f', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: UPDATED Production by Variety */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Volume by Variety</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              
              {/* NEW: Iterate over the data to assign individual colors to each bar using <Cell> */}
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.barColor} />
                ))}
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Historic Production by Lot */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Historic Production by Lot</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lotHistoryData.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              {lotHistoryData.lots.map((lot, index) => (
                <Area key={lot} type="monotone" dataKey={`Lot ${lot}`} stackId="1" stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ProductionCharts;