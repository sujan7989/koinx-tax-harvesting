import './App.css';
import Navbar from './components/Navbar';
import InfoBanner from './components/InfoBanner';
import CapitalGainsCard from './components/CapitalGainsCard';
import HoldingsTable from './components/HoldingsTable';
import { TaxHarvestingProvider, useTaxHarvesting } from './context/TaxHarvestingContext';

// ─── Card skeleton (dark theme) ───────────────────────────────────────────────
function CardSkeleton({ isBlue }: { isBlue: boolean }) {
  const bg = isBlue ? 'bg-[#1052FD]/20' : 'bg-[#1A1C23]';
  const sh = isBlue ? 'bg-blue-400/20' : 'bg-[#2A2B35]';
  return (
    <div className={`rounded-2xl border border-[#2A2B35] ${bg} p-5 animate-pulse`}>
      <div className={`h-4 w-28 rounded ${sh} mb-5`}/>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[...Array(3)].map((_,i) => <div key={i} className={`h-3 rounded ${sh}`}/>)}
      </div>
      {[...Array(3)].map((_,i) => (
        <div key={i} className="grid grid-cols-3 gap-3 mb-2">
          {[...Array(3)].map((_,j) => <div key={j} className={`h-4 rounded ${sh}`}/>)}
        </div>
      ))}
      <div className={`h-10 rounded-xl ${sh} mt-4`}/>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function TaxHarvestingPage() {
  const {
    capitalGains,
    capitalGainsLoading,
    capitalGainsError,
    afterHarvestingGains,
    savings,
  } = useTaxHarvesting();

  return (
    <div className="min-h-screen bg-[#0B0C0E]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Page heading */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-[26px] font-bold text-white">
            Tax Optimisation
          </h1>
        </div>

        {/* Collapsible info banner */}
        <InfoBanner />

        {/* Capital Gains Cards */}
        {capitalGainsError ? (
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-medium">{capitalGainsError}</p>
          </div>
        ) : capitalGainsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardSkeleton isBlue={false}/>
            <CardSkeleton isBlue={true}/>
          </div>
        ) : capitalGains && afterHarvestingGains ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CapitalGainsCard
              title="Pre Harvesting"
              gains={capitalGains}
              isBlue={false}
            />
            <CapitalGainsCard
              title="After Harvesting"
              gains={afterHarvestingGains}
              isBlue={true}
              savingsAmount={savings > 0.01 ? savings : undefined}
            />
          </div>
        ) : null}

        {/* Holdings Table */}
        <HoldingsTable />

      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <TaxHarvestingProvider>
      <TaxHarvestingPage />
    </TaxHarvestingProvider>
  );
}
