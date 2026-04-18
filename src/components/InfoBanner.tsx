import { useState } from 'react';

export default function InfoBanner() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#1A1C23] border border-[#2A2B35] rounded-xl overflow-hidden">
      {/* Header row — always visible, clickable */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          {/* Info circle icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8.5" stroke="#6B7280" strokeWidth="1"/>
            <path d="M9 8V13" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="5.5" r="1" fill="#6B7280"/>
          </svg>
          <span className="text-sm font-medium text-gray-300">
            Important Notes And Disclaimers
          </span>
        </div>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Expandable content */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-[#2A2B35]">
          <ul className="space-y-1.5 text-sm text-gray-400 list-none">
            <li className="flex items-start gap-2">
              <span className="text-gray-500 mt-0.5">•</span>
              See your capital gains for FY 2024-25 in the left card
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500 mt-0.5">•</span>
              Check boxes for assets you plan on selling to reduce your tax liability
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500 mt-0.5">•</span>
              Instantly see your updated tax liability in the right card
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-400">
            <span className="font-semibold text-gray-300">Pro tip: </span>
            Experiment with different combinations of your holdings to optimise your tax liability
          </p>
        </div>
      )}
    </div>
  );
}
