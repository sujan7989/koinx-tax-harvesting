import type { Holding, CapitalGainsResponse } from '../types';

/**
 * All gains are computed as: gain = (currentPrice - averageBuyPrice) × balance
 * This ensures data integrity — every number is internally consistent.
 *
 * Capital Gains API data matches the assignment spec exactly:
 *   stcg: { profits: 70200.88, losses: 1548.53 }
 *   ltcg: { profits: 5020,     losses: 3050     }
 *
 * Holdings use the exact data from the assignment spec.
 */

function computeGain(currentPrice: number, avgBuyPrice: number, balance: number): number {
  return parseFloat(((currentPrice - avgBuyPrice) * balance).toFixed(2));
}

const raw = [
  // From assignment spec — exact values
  { coin: 'USDC',   coinName: 'USDC',                                    logo: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',          currentPrice: 85.41,      totalHolding: 0.001534,    avgBuyPrice: 1.5863,   stcgBal: 0.001534,    ltcgBal: 0 },
  { coin: 'WETH',   coinName: 'Polygon PoS Bridged WETH',                logo: 'https://coin-images.coingecko.com/coins/images/2518/large/weth.png?1696503332',          currentPrice: 211756,     totalHolding: 0.00024,     avgBuyPrice: 3599.86,  stcgBal: 0.00024,     ltcgBal: 0 },
  { coin: 'SOL',    coinName: 'SOL (Wormhole)',                           logo: 'https://coin-images.coingecko.com/coins/images/22876/large/SOL_wh_small.png?1696522175', currentPrice: 14758.01,   totalHolding: 0.00000000000000003469, avgBuyPrice: 221.43, stcgBal: 0.00000000000000003469, ltcgBal: 0 },
  { coin: 'WPOL',   coinName: 'Wrapped POL',                             logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg',          currentPrice: 22.08,      totalHolding: 2.3173,      avgBuyPrice: 0.5227,   stcgBal: 1.3173,      ltcgBal: 1 },
  { coin: 'MATIC',  coinName: 'Polygon',                                 logo: 'https://coin-images.coingecko.com/coins/images/4713/large/polygon.png?1698233745',       currentPrice: 22.22,      totalHolding: 2.7515,      avgBuyPrice: 0.6880,   stcgBal: 2.7515,      ltcgBal: 0 },
  { coin: 'GONE',   coinName: 'Gone',                                    logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg',          currentPrice: 0.0001462,  totalHolding: 696324.31,   avgBuyPrice: 0.0000164, stcgBal: 696324.31,  ltcgBal: 0 },
  { coin: 'USDT',   coinName: 'Arbitrum Bridged USDT',                   logo: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661',        currentPrice: 85.42,      totalHolding: 0.000158,    avgBuyPrice: 1.4988,   stcgBal: 0.000158,    ltcgBal: 0 },
  { coin: 'USDC',   coinName: 'Bridged USDC (Polygon PoS Bridge)',       logo: 'https://coin-images.coingecko.com/coins/images/33000/large/usdc.png?1700119918',        currentPrice: 85.41,      totalHolding: 0.005807,    avgBuyPrice: 1.5405,   stcgBal: 0.005807,    ltcgBal: 0 },
  { coin: 'SLN',    coinName: 'Smart Layer Network',                     logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg',          currentPrice: 6.66,       totalHolding: 0.01,        avgBuyPrice: 4.9992,   stcgBal: 0.01,        ltcgBal: 0 },
  { coin: 'OX',     coinName: 'OX Coin',                                 logo: 'https://coin-images.coingecko.com/coins/images/35365/large/logo.png?1708395976',        currentPrice: 0.13319,    totalHolding: 5,           avgBuyPrice: 0.01841,  stcgBal: 5,           ltcgBal: 0 },
  { coin: 'FLAME',  coinName: 'FireStarter',                             logo: 'https://coin-images.coingecko.com/coins/images/17359/large/WhiteOnBlack_Primary_Logo.png?1696516910', currentPrice: 0.355985, totalHolding: 0.0000000000000142, avgBuyPrice: 0.07889, stcgBal: 0.0000000000000142, ltcgBal: 0 },
  { coin: 'PIG',    coinName: 'Pigcoin',                                 logo: 'https://coin-images.coingecko.com/coins/images/35425/large/pigcoin_200.png?1708544734', currentPrice: 0.00008706, totalHolding: 1.79,        avgBuyPrice: 0,        stcgBal: 1.79,        ltcgBal: 0 },
  { coin: '$CULO',  coinName: 'CULO',                                    logo: 'https://coin-images.coingecko.com/coins/images/34662/large/CULO-logo-inverted_200.png?1705641744', currentPrice: 0.00001623, totalHolding: 150000, avgBuyPrice: 0, stcgBal: 150000, ltcgBal: 0 },
  { coin: 'ETH',    coinName: 'Ethereum',                                logo: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',       currentPrice: 216182,     totalHolding: 0.000421,    avgBuyPrice: 3909.79,  stcgBal: 0.000421,    ltcgBal: 0 },
  { coin: 'QUICK',  coinName: 'Quickswap [OLD]',                         logo: 'https://coin-images.coingecko.com/coins/images/13970/large/quick.png?1696513704',       currentPrice: 2319.83,    totalHolding: 0.0000000000596, avgBuyPrice: 65.87, stcgBal: 0.0000000000596, ltcgBal: 0 },
  { coin: 'DFYN',   coinName: 'Dfyn Network',                            logo: 'https://coin-images.coingecko.com/coins/images/15368/large/SgqhfWz4_400x400_%281%29.jpg?1696515016', currentPrice: 0.300613, totalHolding: 0.0000000000312, avgBuyPrice: 0.03486, stcgBal: 0.0000000000312, ltcgBal: 0 },
  { coin: 'LINK',   coinName: 'Chainlink',                               logo: 'https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009', currentPrice: 1450.14, totalHolding: 0.0000472, avgBuyPrice: 9.173, stcgBal: 0.0000472, ltcgBal: 0 },
  { coin: 'BLOK',   coinName: 'Bloktopia',                               logo: 'https://coin-images.coingecko.com/coins/images/18819/large/logo-bholdus-6.png?1696518281', currentPrice: 0.02974533, totalHolding: 0.0000000000982, avgBuyPrice: 0.005182, stcgBal: 0.0000000000982, ltcgBal: 0 },
  { coin: 'SPHERE', coinName: 'Sphere Finance',                          logo: 'https://coin-images.coingecko.com/coins/images/24424/large/2iR2JsL.png?1696523606',     currentPrice: 0.00729945, totalHolding: 0.000000000000000227, avgBuyPrice: 0.011066, stcgBal: 0.000000000000000227, ltcgBal: 0 },
  { coin: 'TRADE',  coinName: 'Polytrade',                               logo: 'https://coin-images.coingecko.com/coins/images/16416/large/Logo_colored_200.png?1696516012', currentPrice: 17.51, totalHolding: 0.0000000000333, avgBuyPrice: 0.2596, stcgBal: 0.0000000000333, ltcgBal: 0 },
  { coin: 'WELT',   coinName: 'Fabwelt',                                 logo: 'https://coin-images.coingecko.com/coins/images/20505/large/welt.PNG?1696519911',         currentPrice: 0.060863,   totalHolding: 1.063543,    avgBuyPrice: 0.015205, stcgBal: 1.063543,    ltcgBal: 0 },
  { coin: 'FTM',    coinName: 'Fantom',                                  logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg',          currentPrice: 52.99,      totalHolding: 0.042658,    avgBuyPrice: 1.7040,   stcgBal: 0.042658,    ltcgBal: 0 },
  { coin: 'EZ',     coinName: 'EasyFi V2',                               logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg',          currentPrice: 0.885074,   totalHolding: 0.000542,    avgBuyPrice: 6.5394,   stcgBal: 0.000542,    ltcgBal: 0 },
  { coin: 'FRM',    coinName: 'Ferrum Network',                          logo: 'https://coin-images.coingecko.com/coins/images/8251/large/FRM.png?1696508455',          currentPrice: 0.093794,   totalHolding: 0.000000644, avgBuyPrice: 0.453965, stcgBal: 0.000000644, ltcgBal: 0 },
  { coin: 'TITAN',  coinName: 'IRON Titanium',                           logo: 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg',          currentPrice: 0.000000865643, totalHolding: 8.861, avgBuyPrice: 0.000000853180, stcgBal: 8.861, ltcgBal: 0 },
];

export const HOLDINGS_DATA: Holding[] = raw.map(h => {
  const stcgGain = computeGain(h.currentPrice, h.avgBuyPrice, h.stcgBal);
  const ltcgGain = h.ltcgBal > 0 ? computeGain(h.currentPrice, h.avgBuyPrice, h.ltcgBal) : 0;
  return {
    coin: h.coin,
    coinName: h.coinName,
    logo: h.logo,
    currentPrice: h.currentPrice,
    totalHolding: h.totalHolding,
    averageBuyPrice: h.avgBuyPrice,
    stcg: { balance: h.stcgBal, gain: stcgGain },
    ltcg: { balance: h.ltcgBal, gain: ltcgGain },
  };
});

// Capital Gains from the assignment spec — exact values
export const CAPITAL_GAINS_DATA: CapitalGainsResponse = {
  capitalGains: {
    stcg: {
      profits: 70200.88,
      losses: 1548.53,
    },
    ltcg: {
      profits: 5020,
      losses: 3050,
    },
  },
};
