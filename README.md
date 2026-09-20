# HypurrTrade Dashboard

This project contains the complete extracted source code and standalone web applications from Lovable project:
**`https://lovable.dev/projects/171d434e-bf7e-40e1-a3a8-5b8229cfaebf`**
(Deployed at: `https://hypurrtrade.lovable.app/`)

---

## 🚀 Quick Start (Run Locally)

You can launch the project locally right now using Python or any local web server:

```bash
python serve.py
```
* Or via npm / npx:
```bash
npm start
# or
npx serve .
```

This will automatically serve:
- **Prep Dashboard (ZEC)**: `http://localhost:3000/prep-dashboard.html?coin=ZEC`
- **Signal Dashboard**: `http://localhost:3000/signal-dashboard.html`
- **Landing Page**: `http://localhost:3000/index.html`

> **Note:** You can also simply double-click and open any of the `.html` files in your web browser.

---

## 📁 Project Structure

```
├── index.html                   # Standalone Landing page
├── prep-dashboard.html          # Standalone Prep Trading Dashboard (supports ?coin=ZEC, HYPE, SUI, etc.)
├── signal-dashboard.html        # Standalone Multi-Coin Signal Matrix
├── serve.py                     # Local development server with CORS & browser auto-launch
├── package.json                 # Project configuration
│
├── src/                         # Clean extracted source code files
│   ├── PrepDashboardComponent.js    # 200KB trading engine (Hyperliquid WS, Liquidation Heatmap, PnL)
│   ├── PrepDashboardTemplate.jsx   # Clean JSX view template for the Prep Dashboard
│   ├── SignalDashboardComponent.js  # Signal scanner logic & indicator metrics
│   ├── SignalDashboardTemplate.jsx # Clean JSX view template for the Signal Dashboard
│   ├── LandingComponent.js         # Landing page component logic
│   └── LandingTemplate.jsx         # Clean JSX view template for Landing
│
├── assets/                      # Offline fonts, scripts, and vector assets
│   ├── dc-runtime.js            # Component lifecycle & mounting runtime
│   ├── react.min.js             # React 18.3.1
│   ├── react-dom.min.js         # ReactDOM 18.3.1
│   ├── babel.min.js             # Babel Standalone compiler (100% offline support)
│   ├── font_*.woff2             # Bundled typography (JetBrains Mono, CameraPlainVariable, etc.)
│   └── icon_*.svg               # UI icons & coin logos
│
└── raw_pages/                   # Original raw bundled files downloaded directly from Lovable
    ├── Landing.dc.html
    ├── Prep dashboard.dc.html
    └── Signal Dashboard.dc.html
```

---

## ⚡ Core Features & Component Architecture

1. **Prep Dashboard (`src/PrepDashboardComponent.js` & `prep-dashboard.html`)**:
   - **Hyperliquid Integration**: Live orderbook, trades tape, and meta leverage tiers directly from Hyperliquid.
   - **Liquidation Heatmap (`makeHeat`, `rebuildHeat`, `shape`)**: Real liquidation levels computed from position entries and leverage multipliers.
   - **Multi-Coin Support (`?coin=<SYMBOL>`)**: Supports `ZEC`, `HYPE`, `SUI`, `ETH`, `NEAR`, `HBAR`, `BTC`, `SOL`, and every Hyperliquid perp.
   - **Trade Management & Analytics**: Open/Closed trades table, PnL calculations, net cost mode, and risk-reward ratios.

2. **Signal Dashboard (`src/SignalDashboardComponent.js` & `signal-dashboard.html`)**:
   - Multi-asset scoring engine scanning momentum, volume anomalies, funding shifts, and trend signals across perpetuals.

3. **Landing Page (`src/LandingComponent.js` & `index.html`)**:
   - Product showcase, hero section, and direct routes into the trading and signal dashboards.
