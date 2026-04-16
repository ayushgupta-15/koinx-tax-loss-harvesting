# KoinX – Tax Loss Harvesting Tool

A responsive React application for simulating tax loss harvesting on crypto holdings.

## Live Demo

🔗 **Live Demo:** https://koinx-tax-loss-harvesting-theta.vercel.app/

## Screenshots

### Desktop

![Home screen light](public/screenshots/HomeScreenLight.png)

![Home screen dark](public/screenshots/HomeScreenDark.png)

### Selection State

![Asset selected light](public/screenshots/AssetSelected.png)

![Asset selected dark](public/screenshots/AssetSelectedDark.png)

### Mobile

![Mobile home light](public/screenshots/HomeMobileLight.jpeg)

![Mobile home dark](public/screenshots/HomeMobileDark.jpeg)

![Mobile holdings light](public/screenshots/AssetsMobile.jpeg)

![Mobile holdings dark](public/screenshots/AssetsMobileDark.jpeg)

## Setup & Run

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`.

You can also run the development server with:

```bash
npm run dev
```

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
    useHarvesting.js    # Core logic for selection & capital gains recalculation
  utils/
    format.js           # Number/currency formatting helpers
  App.jsx
  App.css
  index.js
```

## Features

- **Pre-Harvesting card** — shows STCG/LTCG profits, losses, net, and realised gains from the Capital Gains API.
- **After Harvesting card** — mirrors pre-harvesting; updates instantly in real-time as holdings are selected/deselected (no page refresh).
- **Savings banner** — shown only when post-harvest realised gains < pre-harvest realised gains.
- **Holdings table** — sortable by short-term and long-term gains, select all/individual rows, skeleton loader, "View all" toggle.
- **Qty to sell** — auto-populated with `totalHolding` when a row is selected.
- **Mobile responsive** — fluid grid, horizontal scroll on table.
- **Theme toggle** — light and dark modes with persisted preference.
- **Compact values** — large values are displayed with K/M suffixes and full values appear on hover.
- **Error & loading states** — shimmer skeletons while APIs resolve; error banner on failure.

## Approach & Key Decisions

- Used derived state instead of storing computed values to avoid inconsistencies.
- Encapsulated all tax-loss harvesting logic inside a custom hook (`useHarvesting`) for scalability and separation of concerns.
- Ensured real-time updates with minimal re-renders by structuring calculations efficiently.
- Sorted assets by impact (absolute gain/loss) to improve decision-making UX.
- Designed the UI to reflect a production-grade fintech dashboard with responsiveness and accessibility in mind.

## API Mocking

Both APIs are mocked as Promises in `src/api/mockApi.js` with realistic delays (600ms and 900ms). No external server required.

## Assumptions

- `gains` from the Holdings API represent unrealised gains/losses on the current balance.
- Selecting a holding adds its STCG/LTCG gains to post-harvest figures (positive → profits, negative → losses).
- Holdings are sorted by absolute total gain (largest impact first) for UX clarity.
- INR (₹) is used throughout as the currency.

## Future Improvements

- Persist user selections across sessions.
- Add filtering for profit-only and loss-only holdings.
- Integrate real APIs instead of mocks.
