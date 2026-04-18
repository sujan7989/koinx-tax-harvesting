import { useState, useRef, useEffect } from 'react';
import type { Holding } from '../types';
import { useTaxHarvesting } from '../context/TaxHarvestingContext';
import { formatINR, formatNumber, formatGain } from '../utils/format';

const DEFAULT_VISIBLE = 5;

// ─── Indeterminate checkbox ───────────────────────────────────────────────────
function IndeterminateCheckbox({
  checked, indeterminate, onChange, disabled, ariaLabel,
}: {
  checked: boolean; indeterminate: boolean; onChange: () => void;
  disabled?: boolean; ariaLabel?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-4 h-4 rounded border-gray-600 cursor-pointer accent-[#1052FD]"
    />
  );
}

// ─── Asset cell ───────────────────────────────────────────────────────────────
function AssetCell({ holding, isSelected }: { holding: Holding; isSelected: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden
        ${isSelected ? 'ring-2 ring-[#1052FD]' : ''}`}>
        <img
          src={holding.logo}
          alt={holding.coin}
          width={36}
          height={36}
          className="w-full h-full object-cover bg-[#1E1F24]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
          }}
        />
      </div>
      <div className="min-w-0">
        {/* Always show coinName truncated via CSS, never swap to ticker */}
        <p className="text-sm font-semibold text-white leading-tight truncate max-w-[160px]">
          {holding.coinName}
        </p>
        <p className="text-xs text-gray-500 leading-tight mt-0.5">{holding.coin}</p>
      </div>
    </div>
  );
}

// ─── Gain cell ────────────────────────────────────────────────────────────────
function GainCell({ gain, balance, coin }: { gain: number; balance: number; coin: string }) {
  const isPos = gain > 0;
  const isNeg = gain < 0;
  const colorCls = isPos ? 'text-[#4ADE80]' : isNeg ? 'text-[#F87171]' : 'text-gray-400';

  return (
    <div className="text-right">
      <p className={`text-sm font-semibold ${colorCls}`}>{formatGain(gain)}</p>
      <p className="text-xs text-gray-500 mt-0.5">{formatNumber(balance)} {coin}</p>
    </div>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-t border-[#1E1F24]">
      <td className="px-4 py-4 w-10"><div className="skeleton-dark h-4 w-4 rounded"/></td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="skeleton-dark h-9 w-9 rounded-lg flex-shrink-0"/>
          <div>
            <div className="skeleton-dark h-4 w-20 mb-1.5"/>
            <div className="skeleton-dark h-3 w-10"/>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="skeleton-dark h-4 w-24 ml-auto mb-1.5"/>
        <div className="skeleton-dark h-3 w-16 ml-auto"/>
      </td>
      <td className="px-4 py-4 text-right"><div className="skeleton-dark h-4 w-20 ml-auto"/></td>
      <td className="px-4 py-4 text-right">
        <div className="skeleton-dark h-4 w-20 ml-auto mb-1.5"/>
        <div className="skeleton-dark h-3 w-16 ml-auto"/>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="skeleton-dark h-4 w-16 ml-auto mb-1.5"/>
        <div className="skeleton-dark h-3 w-12 ml-auto"/>
      </td>
      <td className="px-4 py-4 text-right"><div className="skeleton-dark h-4 w-8 ml-auto"/></td>
    </tr>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HoldingsTable() {
  const { holdings, holdingsLoading, holdingsError, selectedIds, toggleHolding, toggleAll } =
    useTaxHarvesting();
  const [showAll, setShowAll] = useState(false);

  if (holdingsError) {
    return (
      <div className="bg-[#1A1C23] rounded-2xl border border-[#2A2B35] p-10 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-gray-400">{holdingsError}</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 text-sm text-[#1052FD] hover:underline">Retry</button>
      </div>
    );
  }

  const visibleHoldings = showAll ? holdings : holdings.slice(0, DEFAULT_VISIBLE);
  const allSelected = holdings.length > 0 && selectedIds.size === holdings.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < holdings.length;

  return (
    <div className="bg-[#1A1C23] rounded-2xl border border-[#2A2B35] overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">Holdings</h2>
        {!holdingsLoading && selectedIds.size > 0 && (
          <span className="text-xs font-medium text-[#1052FD] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            {selectedIds.size} asset{selectedIds.size > 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-t border-b border-[#2A2B35] bg-[#13141A]">
              <th className="px-4 py-3 w-10 text-left">
                <IndeterminateCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  disabled={holdingsLoading}
                  ariaLabel="Select all"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Asset</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Holdings</span>
                <br/>
                <span className="text-[11px] font-normal text-gray-500 normal-case tracking-normal">Avg Buy Price</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Price</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Short-Term</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Long-Term</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount to Sell</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {holdingsLoading
              ? Array.from({ length: DEFAULT_VISIBLE }).map((_, i) => <SkeletonRow key={i}/>)
              : visibleHoldings.map((holding, idx) => {
                  const isSelected = selectedIds.has(idx);
                  return (
                    <tr
                      key={`${holding.coin}-${idx}`}
                      onClick={() => toggleHolding(idx)}
                      className={`border-t border-[#1E1F24] cursor-pointer transition-colors
                        ${isSelected ? 'bg-[#1052FD]/10 hover:bg-[#1052FD]/15' : 'hover:bg-white/[0.03]'}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5 w-10" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleHolding(idx)}
                          aria-label={`Select ${holding.coin}`}
                          className="w-4 h-4 rounded border-gray-600 cursor-pointer accent-[#1052FD]"
                        />
                      </td>

                      {/* Asset */}
                      <td className="px-4 py-3.5">
                        <AssetCell holding={holding} isSelected={isSelected}/>
                      </td>

                      {/* Holdings / Avg Buy Price */}
                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-medium text-white">
                          {formatNumber(holding.totalHolding)} {holding.coin}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatINR(holding.averageBuyPrice)}/{holding.coin}
                        </p>
                      </td>

                      {/* Current Price */}
                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-semibold text-white">
                          {formatINR(holding.currentPrice)}
                        </p>
                      </td>

                      {/* Short-Term */}
                      <td className="px-4 py-3.5">
                        <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} coin={holding.coin}/>
                      </td>

                      {/* Long-Term */}
                      <td className="px-4 py-3.5">
                        <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} coin={holding.coin}/>
                      </td>

                      {/* Amount to Sell */}
                      <td className="px-4 py-3.5 text-right">
                        {isSelected
                          ? <span className="text-sm font-semibold text-white">
                              {formatNumber(holding.totalHolding)} {holding.coin}
                            </span>
                          : <span className="text-sm text-gray-600">-</span>
                        }
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      {/* View All / Show Less */}
      {!holdingsLoading && holdings.length > DEFAULT_VISIBLE && (
        <div className="border-t border-[#2A2B35] px-5 py-3.5 flex justify-center">
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1052FD] hover:text-blue-400 transition-colors"
          >
            {showAll ? (
              <>Show Less
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
                </svg>
              </>
            ) : (
              <>View All {holdings.length} Assets
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
