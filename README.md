# KoinX – Tax Loss Harvesting Tool

A responsive React application for simulating tax loss harvesting on crypto holdings.

## Screenshots

> Dark-themed dashboard with two capital gains cards (pre- and post-harvesting) and an interactive holdings table.

## Setup & Run

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`.

## Build

```bash
npm run build
```

## Folder Structure

```
src/
  api/
    mockApi.js          # Mock API (Promise-based, no server needed)
  components/
    GainsCard.jsx       # Capital gains display card
    GainsCard.css
    HoldingsTable.jsx   # Selectable holdings table with skeleton loader
    HoldingsTable.css
  hooks/
    useHarvesting.js    # Core state management hook
  utils/
    format.js           # Number/currency formatting helpers
  App.jsx
  App.css
  index.js
```

## Features

- **Pre-Harvesting card** — shows STCG/LTCG profits, losses, net, and realised gains from the Capital Gains API.
- **After Harvesting card** — mirrors pre-harvesting; updates in real-time as holdings are selected/deselected.
- **Savings banner** — shown only when post-harvest realised gains < pre-harvest realised gains.
- **Holdings table** — sortable by total gain, select all/individual rows, skeleton loader, "View all" toggle.
- **Qty to sell** — auto-populated with `totalHolding` when a row is selected.
- **Mobile responsive** — fluid grid, horizontal scroll on table.
- **Error & loading states** — shimmer skeletons while APIs resolve; error banner on failure.

## API Mocking

Both APIs are mocked as Promises in `src/api/mockApi.js` with realistic delays (600ms and 900ms). No external server required.

## Assumptions

- `gains` from the Holdings API represent unrealised gains/losses on the current balance.
- Selecting a holding adds its STCG/LTCG gains to post-harvest figures (positive → profits, negative → losses).
- Holdings are sorted by absolute total gain (largest impact first) for UX clarity.
- INR (₹) is used throughout as the currency.
