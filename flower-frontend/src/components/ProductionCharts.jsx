import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend
} from 'recharts';

const ProductionCharts = ({ records }) => {
  // A palette of nice green/earth tones for our different lots
  const COLORS = ['#2d6a4f', '#52b788', '#74c69d', '#b7e4c7', '#d8f3dc', '#02c39a', '#00a896', '#028090'];

  // 1. Process data for the Bar Chart (Total Quantity by Product)
  const productData = useMemo(() => {
    const totals = records.reduce((acc, record) => {
      acc[record.Product_id] = (acc[record.Product_id] || 0) + record.Quantity;
      return acc;
    }, {});
    
    return Object.keys(totals).map(key => ({
      name: key,
      total: totals[key]
    })).sort((a, b) => b.total - a.total);
  }, [records]);

  // 2. Process data for the Line Chart (Overall Production Trend)
  const trendData = useMemo(() => {
    const dailyTotals = records.reduce((acc, record) => {
      acc[record.Date] = (acc[record.Date] || 0) + record.Quantity;
      return acc;
    }, {});

    return Object.keys(dailyTotals)
      .sort() 
      .map(date => ({
        date: date,
        stems: dailyTotals[date]
      }));
  }, [records]);

  // 3. NEW: Process data for the Stacked Area Chart (History by Lot)
  const lotHistoryData = useMemo(() => {
    // Find every unique lot that has ever produced something
    const uniqueLots = [...new Set(records.map(r => r.Lot_number))].sort((a, b) => a - b);

    // Group records by Date, and assign the quantity to the specific Lot
    const grouped = records.reduce((acc, record) => {
      if (!acc[record.Date]) {
        acc[record.Date] = { date: record.Date };
        // Initialize all lots to 0 for this date so the chart draws cleanly
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
      
      {/* Chart 1: Production Trend (Line Chart) */}
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

      {/* Chart 2: Production by Variety (Bar Chart) */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Volume by Variety</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="total" fill="#52b788" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW Chart 3: Historic Production by Lot (Spans both columns) */}
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
              
              {/* Dynamically generate an Area for every unique lot in the database */}
              {lotHistoryData.lots.map((lot, index) => (
                <Area 
                  key={lot} 
                  type="monotone" 
                  dataKey={`Lot ${lot}`} 
                  stackId="1" 
                  stroke={COLORS[index % COLORS.length]} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ProductionCharts;