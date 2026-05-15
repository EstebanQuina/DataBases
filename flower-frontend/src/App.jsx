import React, { useState } from 'react';
import ProductionTable from './components/ProductionTable';
import EmployeeTable from './components/EmployeeTable';
import PostHarvestDashboard from './components/PostHarvestDashboard';
import OrdersDashboard from './components/OrdersDashboard';
import ProductTable from './components/ProductTable';
import LotTable from './components/LotTable';
import HRDashboard from './components/HRDashboard';

function App() {
  // This state controls which table is visible! Defaults to 'production'.
  const [activeModule, setActiveModule] = useState('production');

  // This function acts like a traffic cop, returning the correct UI based on the active module
  const renderContent = () => {
    switch (activeModule) {
      case 'production':
        return (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Production Dashboard</h1>
              <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium border border-green-200">LIVE</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Manage flower varieties, planting schedules, and daily field operations.</p>

            {/* NEW: Side-by-Side Master Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ProductTable />
              <LotTable />
            </div>

            {/* Your existing Daily Production Tracker below the grid */}
            <ProductionTable />
          </div>
        );
      case 'postharvest':
        return <PostHarvestDashboard />;

      // Put this right above default: return <ProductionTable />;
      case 'sales':
        return <OrdersDashboard />;

      case 'hr':
        return <HRDashboard />;
      default:
        return <ProductionTable />;
    }
  };

  // Helper function to style the sidebar buttons depending on if they are active or not
  const getButtonClass = (moduleName) => {
    const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ";
    return activeModule === moduleName 
      ? baseClass + "bg-green-50 text-green-700 shadow-sm border border-green-100" 
      : baseClass + "text-gray-500 hover:bg-gray-50 hover:text-gray-900";
  };

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        
        {/* Brand Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-lg">
            Y
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">Flower Production Company</h2>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Farm OS</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          
          <button onClick={() => setActiveModule('production')} className={getButtonClass('production')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Production
          </button>

          <button onClick={() => setActiveModule('postharvest')} className={getButtonClass('postharvest')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            Post-Harvest
          </button>
          <button onClick={() => setActiveModule('sales')} className={getButtonClass('sales')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            Sales & Orders
          </button>

          <button onClick={() => setActiveModule('hr')} className={getButtonClass('hr')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Human Resources
          </button>

        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* This executes the traffic cop function to display the correct screen */}
          {renderContent()}
        </div>
      </main>

    </div>
  );
}

export default App;