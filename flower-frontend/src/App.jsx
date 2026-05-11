import Layout from './components/Layout';
import StatCard from './components/StatCard';
import ProductionTable from './components/ProductionTable';

function App() {
  return (
    <Layout>
      {/* Main Wrapper - Opened here */}
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Production</h1>
          <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium border border-green-200">LIVE</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">Track planting schedules, crop lots, and field operations.</p>
        
        {/* Top Row: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard 
            title="Daily Yield"
            subtitle="Total stems harvested today"
            mainValue="24,380"
            unit="stems"
            trend="+8.3%"
            trendIsPositive={true}
            iconColorClass="bg-green-50 text-green-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
          />
          <StatCard 
            title="Active Fumigations"
            subtitle="Ongoing fumigation treatments"
            mainValue="3"
            unit="lots"
            trend="-1"
            trendIsPositive={false}
            iconColorClass="bg-yellow-50 text-yellow-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>}
          />
          <StatCard 
            title="Pending Orders"
            subtitle="Awaiting dispatch or processing"
            mainValue="17"
            unit="orders"
            trend="+4"
            trendIsPositive={false}
            iconColorClass="bg-purple-50 text-purple-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
          />
        </div>

        {/* The dashed placeholder is entirely gone, replaced by the table component */}
        <ProductionTable />

      </div> {/* Main Wrapper - Closed right here! */}
    </Layout>
  )
}

export default App