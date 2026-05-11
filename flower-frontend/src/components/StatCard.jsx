import React from 'react';

const StatCard = ({ title, subtitle, mainValue, unit, trend, trendIsPositive, icon, iconColorClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-xl ${iconColorClass}`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-900">{mainValue}</span>
          <span className="text-sm text-gray-500 font-medium">{unit}</span>
        </div>
        
        <div className="mt-4 flex items-center text-xs font-medium">
          <span className={`flex items-center gap-1 ${trendIsPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-0.5 rounded-md`}>
            {trendIsPositive ? '↗' : '↘'} {trend}
          </span>
          <span className="text-gray-400 ml-2 font-normal">vs. yesterday</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;