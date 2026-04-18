import type { Holding, CapitalGainsResponse } from '../types';
import { HOLDINGS_DATA, CAPITAL_GAINS_DATA } from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchHoldings(): Promise<Holding[]> {
  await delay(800);
  return HOLDINGS_DATA;
}

export async function fetchCapitalGains(): Promise<CapitalGainsResponse> {
  await delay(600);
  return CAPITAL_GAINS_DATA;
}
