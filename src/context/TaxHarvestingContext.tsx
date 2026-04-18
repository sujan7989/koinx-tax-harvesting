import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { Holding, CapitalGains } from '../types';
import { fetchHoldings, fetchCapitalGains } from '../api';

interface TaxHarvestingContextValue {
  holdings: Holding[];
  holdingsLoading: boolean;
  holdingsError: string | null;
  capitalGains: CapitalGains | null;
  capitalGainsLoading: boolean;
  capitalGainsError: string | null;
  selectedIds: Set<number>;
  toggleHolding: (index: number) => void;
  toggleAll: () => void;
  afterHarvestingGains: CapitalGains | null;
  savings: number;
}

const TaxHarvestingContext = createContext<TaxHarvestingContextValue | null>(null);

export function TaxHarvestingProvider({ children }: { children: React.ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const [holdingsError, setHoldingsError] = useState<string | null>(null);

  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [capitalGainsLoading, setCapitalGainsLoading] = useState(true);
  const [capitalGainsError, setCapitalGainsError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchHoldings()
      .then((data) => setHoldings(data))
      .catch(() => setHoldingsError('Failed to load holdings. Please try again.'))
      .finally(() => setHoldingsLoading(false));

    fetchCapitalGains()
      .then((data) => setCapitalGains(data.capitalGains))
      .catch(() => setCapitalGainsError('Failed to load capital gains. Please try again.'))
      .finally(() => setCapitalGainsLoading(false));
  }, []);

  const toggleHolding = useCallback((index: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === holdings.length) {
        return new Set<number>();
      }
      return new Set<number>(holdings.map((_, i) => i));
    });
  }, [holdings]);

  const afterHarvestingGains = useMemo<CapitalGains | null>(() => {
    if (!capitalGains) return null;

    let stcgProfits = capitalGains.stcg.profits;
    let stcgLosses = capitalGains.stcg.losses;
    let ltcgProfits = capitalGains.ltcg.profits;
    let ltcgLosses = capitalGains.ltcg.losses;

    // Convert Set to Array to iterate — ensures useMemo sees the values
    Array.from(selectedIds).forEach((idx) => {
      const holding = holdings[idx];
      if (!holding) return;

      // STCG: positive gain → add to profits, negative gain → add to losses
      if (holding.stcg.gain > 0) {
        stcgProfits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        stcgLosses += Math.abs(holding.stcg.gain);
      }

      // LTCG: positive gain → add to profits, negative gain → add to losses
      if (holding.ltcg.gain > 0) {
        ltcgProfits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        ltcgLosses += Math.abs(holding.ltcg.gain);
      }
    });

    return {
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses },
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capitalGains, selectedIds, holdings]);

  const savings = useMemo(() => {
    if (!capitalGains || !afterHarvestingGains) return 0;

    const preNet =
      (capitalGains.stcg.profits - capitalGains.stcg.losses) +
      (capitalGains.ltcg.profits - capitalGains.ltcg.losses);

    const postNet =
      (afterHarvestingGains.stcg.profits - afterHarvestingGains.stcg.losses) +
      (afterHarvestingGains.ltcg.profits - afterHarvestingGains.ltcg.losses);

    return preNet - postNet;
  }, [capitalGains, afterHarvestingGains]);

  return (
    <TaxHarvestingContext.Provider
      value={{
        holdings,
        holdingsLoading,
        holdingsError,
        capitalGains,
        capitalGainsLoading,
        capitalGainsError,
        selectedIds,
        toggleHolding,
        toggleAll,
        afterHarvestingGains,
        savings,
      }}
    >
      {children}
    </TaxHarvestingContext.Provider>
  );
}

export function useTaxHarvesting() {
  const ctx = useContext(TaxHarvestingContext);
  if (!ctx) throw new Error('useTaxHarvesting must be used within TaxHarvestingProvider');
  return ctx;
}
