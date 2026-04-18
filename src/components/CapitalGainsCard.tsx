import type { CapitalGains } from '../types';
import { formatINR } from '../utils/format';

interface CapitalGainsCardProps {
  title: string;
  gains: CapitalGains;
  isBlue?: boolean;
  savingsAmount?: number;
}

export default function CapitalGainsCard({
  title,
  gains,
  isBlue = false,
  savingsAmount,
}: CapitalGainsCardProps) {
  const stcgNet = gains.stcg.profits - gains.stcg.losses;
  const ltcgNet = gains.ltcg.profits - gains.ltcg.losses;
  const effectiveTotal = stcgNet + ltcgNet;

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const cardBg     = isBlue ? 'bg-[#1052FD]'      : 'bg-[#1A1C23]';
  const cardBorder = isBlue ? 'border-[#1052FD]'  : 'border-[#2A2B35]';
  const titleCls   = isBlue ? 'font-bold'          : 'font-semibold';
  const headerCls  = isBlue ? 'text-blue-200'      : 'text-gray-400';
  const labelCls   = isBlue ? 'text-blue-100'      : 'text-gray-300';
  const dividerCls = isBlue ? 'border-blue-400/30' : 'border-[#2A2B35]';

  // On the blue card all values are white; on dark card net gains are colored
  const valueColor = 'text-white';
  const netColor = (v: number) =>
    isBlue ? 'text-white' : v >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]';
  const totalColor = (v: number) =>
    isBlue ? 'text-white' : v >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]';

  return (
    <div className={`rounded-2xl border ${cardBg} ${cardBorder} overflow-hidden`}>

      {/* Title */}
      <div className="px-5 pt-5 pb-4">
        <h3 className={`text-[15px] text-white ${titleCls}`}>{title}</h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-5 pb-2">
        <span className={`text-xs font-medium ${headerCls}`} />
        <span className={`text-xs font-medium ${headerCls} text-right`}>Short-term</span>
        <span className={`text-xs font-medium ${headerCls} text-right`}>Long-term</span>
      </div>

      <div className={`mx-5 border-t ${dividerCls}`} />

      {/* Profits */}
      <div className="grid grid-cols-3 px-5 py-3 items-center">
        <span className={`text-sm ${labelCls}`}>Profits</span>
        <span className={`text-sm font-medium ${valueColor} text-right`}>
          {formatINR(gains.stcg.profits)}
        </span>
        <span className={`text-sm font-medium ${valueColor} text-right`}>
          {formatINR(gains.ltcg.profits)}
        </span>
      </div>

      <div className={`mx-5 border-t ${dividerCls}`} />

      {/* Losses */}
      <div className="grid grid-cols-3 px-5 py-3 items-center">
        <span className={`text-sm ${labelCls}`}>Losses</span>
        <span className={`text-sm font-medium ${valueColor} text-right`}>
          {formatINR(gains.stcg.losses)}
        </span>
        <span className={`text-sm font-medium ${valueColor} text-right`}>
          {formatINR(gains.ltcg.losses)}
        </span>
      </div>

      <div className={`mx-5 border-t ${dividerCls}`} />

      {/* Net Capital Gains */}
      <div className="grid grid-cols-3 px-5 py-3 items-center">
        <span className={`text-sm ${labelCls}`}>Net Capital Gains</span>
        <span className={`text-sm font-semibold ${netColor(stcgNet)} text-right`}>
          {formatINR(stcgNet)}
        </span>
        <span className={`text-sm font-semibold ${netColor(ltcgNet)} text-right`}>
          {formatINR(ltcgNet)}
        </span>
      </div>

      <div className={`mx-5 border-t ${dividerCls} mb-3`} />

      {/* Effective / Realised Capital Gains */}
      <div className="px-5 pb-4 flex items-center justify-between flex-wrap gap-2">
        <span className={`text-sm font-semibold ${isBlue ? 'text-white' : 'text-gray-200'}`}>
          {isBlue ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
        </span>
        <span className={`text-xl font-bold ${totalColor(effectiveTotal)}`}>
          {formatINR(effectiveTotal)}
        </span>
      </div>

      {/* Savings banner — spec: show only when pre > post realised gains */}
      {isBlue && savingsAmount !== undefined && savingsAmount > 0 && (
        <div className="px-5 pb-4">
          <p className="text-sm font-medium text-white/90">
            🎉 Your taxable capital gains are reduced by:{' '}
            <span className="font-bold">{formatINR(savingsAmount)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
