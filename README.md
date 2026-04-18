# KoinX – Tax Loss Harvesting Tool

A responsive, dark-themed React + TypeScript application that helps users visualise and optimise their crypto tax liability through tax-loss harvesting.

**Live Demo:** https://koinx-tax-harvesting-eta.vercel.app

**GitHub:** https://github.com/sujan7989/koinx-tax-harvesting

---

## Screenshots

### Full Page View
![Tax Optimisation Page](./screenshots/full-page.png)

### Pre & After Harvesting Cards
![Capital Gains Cards](./screenshots/cards.png)

### Holdings Table – Selection Active
![Holdings Table](./screenshots/table-selected.png)

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repo
git clone <your-repo-url>
cd koinx-tax-harvesting

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v3 |
| State management | React Context + `useMemo` / `useCallback` |
| API mocking | In-app Promises with simulated network delay |

---

## Project Structure

```
src/
├── api/
│   ├── index.ts              # Mock API functions (fetchHoldings, fetchCapitalGains)
│   └── mockData.ts           # Raw mock data matching the assignment spec
├── components/
│   ├── CapitalGainsCard.tsx  # Pre Harvesting (dark) & After Harvesting (blue) cards
│   ├── HoldingsTable.tsx     # Selectable holdings table with View All toggle
│   ├── InfoBanner.tsx        # Collapsible "Important Notes" accordion
│   └── Navbar.tsx            # Sticky top navigation bar
├── context/
│   └── TaxHarvestingContext.tsx  # Global state via React Context
├── types/
│   └── index.ts              # TypeScript interfaces
├── utils/
│   └── format.ts             # ₹ formatting, number abbreviation helpers
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

---

## Features

- **Pre Harvesting card** — reads from Capital Gains mock API, shows Short-term & Long-term Profits / Losses / Net Capital Gains, and Realised Capital Gains total
- **After Harvesting card** — mirrors pre-harvesting initially, updates in real-time as holdings are selected
  - If `stcg.gain > 0` → added to STCG profits
  - If `stcg.gain < 0` → absolute value added to STCG losses
  - Same logic for LTCG
  - Shows "🎉 Your taxable capital gains are reduced by ₹X" only when post < pre effective gains
- **Holdings table** — 25 crypto assets with checkbox selection
  - Select-all checkbox with indeterminate state
  - Click row or checkbox to toggle
  - "Amount to Sell" column populates on selection
  - "View All / Show Less" toggle
- **Loading skeletons** for both cards and table rows
- **Error states** with retry option
- **Collapsible info banner** with usage tips
- **Fully responsive** — mobile hamburger menu, horizontal scroll on table

---

## Assumptions

1. The Capital Gains API `losses` field stores a **positive number** representing a loss (e.g. `1548.53` = ₹1,548.53 loss). Net = `profits - losses`.
2. Selecting a holding **adds** its gains/losses on top of the existing capital gains — it does not replace them.
3. The savings/reduction banner is shown only when `preEffectiveGains > postEffectiveGains`.
4. Coin logos that fail to load fall back to the KoinX default coin SVG.
5. Very small numbers (< 1e-8) are displayed as `~0` to avoid scientific notation.
6. Large values are abbreviated: `₹25.31M`, `₹1,548.53` etc.
