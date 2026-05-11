import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1b4332] text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-400 p-2 rounded-lg text-white">
              {/* Placeholder for the logo icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </div>
            <div>
              <p className="text-xs text-gray-300 tracking-wider">SOCIEDAD</p>
              <h1 className="text-sm font-bold leading-tight">La Clementina Farms</h1>
            </div>
          </div>
          <span className="text-[10px] text-green-300 bg-green-800/50 px-2 py-0.5 rounded-full border border-green-700 uppercase tracking-wider">● Enterprise ERP</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-4">
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-green-800/50 text-gray-300 text-sm flex justify-between items-center">
            Dashboard
          </a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-green-800/50 text-gray-300 text-sm flex justify-between items-center">
            Human Resources <span className="text-gray-500">›</span>
          </a>
          <a href="#" className="block px-3 py-2 rounded-md bg-green-800/60 font-medium text-white text-sm flex justify-between items-center">
            Production <span className="text-gray-400">⌄</span>
          </a>
          <div className="pl-6 space-y-1 pb-2">
            <a href="#" className="block px-3 py-1.5 text-xs text-gray-400 hover:text-white">Planting Schedule</a>
            <a href="#" className="block px-3 py-1.5 text-xs text-gray-400 hover:text-white">Crop Tracker</a>
            <a href="#" className="block px-3 py-1.5 text-xs text-gray-400 hover:text-white">Inputs & Inventory</a>
            <a href="#" className="block px-3 py-1.5 text-xs text-gray-400 hover:text-white">Field Map</a>
          </div>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-green-800/50 text-gray-300 text-sm flex justify-between items-center">
            Post-Harvest <span className="text-gray-500">›</span>
          </a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-green-800/50 text-gray-300 text-sm flex justify-between items-center">
            Sales <span className="text-gray-500">›</span>
          </a>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-green-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-sm">A</div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@laclementina.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="text-sm text-gray-500">
            ERP / <span className="text-gray-900 font-medium">Production</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 border rounded-md px-3 py-1.5 flex items-center gap-2">
               📅 Sunday, May 10, 2026
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-sm font-bold">A</div>
          </div>
        </header>

        {/* Dynamic Page Content goes here */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;