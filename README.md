# HypurrTrade Dashboard

High-performance quantitative perpetual trading analytics, liquidation heatmap, and multi-coin momentum signal matrix powered by Hyperliquid and AI conviction models.

---

## 🚀 Quick Start (Modern React + Vite)

Run the modern Vite SPA with instant Hot Module Replacement (HMR) and integrated AI proxy:

```bash
npm install
npm run dev
```

The app will start at `http://localhost:3000/`:
- **Landing Page**: `http://localhost:3000/`
- **Prep Dashboard (Perps & Heatmap)**: `http://localhost:3000/prep-dashboard?coin=ZEC`
- **Signal Dashboard (40-Coin Matrix)**: `http://localhost:3000/signal-dashboard`

### 📦 Production Build

To compile a production-ready, minified bundle with code-splitting:

```bash
npm run build
```
Build output is saved to the `dist/` directory ready for deployment to Vercel, Netlify, Cloudflare Pages, or AWS S3.

To preview the production build locally:
```bash
npm run preview
```

---

## 🛠 Standalone Offline Fallback

The project also maintains standalone zero-dependency HTML files that can be run directly without Node.js:

```bash
python serve.py
```
- Standalone Prep Dashboard: `http://localhost:3000/prep-dashboard.html?coin=ZEC`
- Standalone Signal Dashboard: `http://localhost:3000/signal-dashboard.html`
- Standalone Landing Page: `http://localhost:3000/landing-standalone.html`

---

## 📁 Project Architecture

```
├── index.html                   # Modern Vite SPA root entry
├── vite.config.js               # Vite config with React plugin & integrated AI Proxy dev middleware
├── package.json                 # Modern dependencies & build scripts
├── public/assets/               # Static fonts, SVGs, and vector assets served at /assets/
│
├── src/
│   ├── main.jsx                 # React 18 createRoot bootstrap
│   ├── App.jsx                  # SPA Router (react-router-dom) with code-splitting & link interception
│   ├── dc-adapter.jsx           # High-performance component bridge for modular templates
│   ├── pages/
│   │   ├── LandingPage.jsx      # Product showcase, interactive R:R curve, animated mascot
│   │   ├── PrepDashboardPage.jsx# Live orderbook, trades tape, liquidation heatmap, manual cancel
│   │   └── SignalDashboardPage.jsx # Multi-coin signal matrix & momentum indicators
│   ├── components/
│   │   └── SignalCard.jsx       # 3D interactive tilt card with donut ratio charts
│   ├── PrepDashboardComponent.js # 200KB trading engine (Hyperliquid WS, Liquidation math, PnL)
│   ├── PrepDashboardTemplate.jsx# JSX view template for the Prep Dashboard
│   ├── SignalDashboardComponent.js # Signal scanner logic & indicator metrics
│   ├── SignalDashboardTemplate.jsx # JSX view template for the Signal Dashboard
│   ├── LandingComponent.js      # Landing page component logic
│   └── LandingTemplate.jsx      # JSX view template for Landing
│
└── legacy/
    ├── prep-dashboard.html      # Standalone fallback
    ├── signal-dashboard.html    # Standalone fallback
    └── landing-standalone.html  # Standalone fallback
```

---

## ⚡ Core Features

1. **Prep Dashboard (`/prep-dashboard`)**:
   - **Hyperliquid WebSocket**: Direct streaming connection for order book, trades tape, and prices.
   - **Liquidation Heatmap**: Real liquidation density calculations plotted dynamically across leverage tiers.
   - **Live Paper Trading & Manual Cancellation**: Real-time position tracking with custom risk parameters and one-click manual trade cancellation (`✕ CANCEL`).
   - **AI Conviction Engine**: Integrated multi-model analysis (Gemini 3.8 Flash, Anthropic Claude, OpenAI, DeepSeek, Groq) via local proxy.

2. **Signal Dashboard (`/signal-dashboard`)**:
   - 40-asset scoring engine scanning momentum, volume anomalies, funding shifts, and trend signals across perpetuals.

3. **Interactive Mascot (Hypurr)**:
   - Coordinated vector animations with natural breathing, double blinking, ear twitches, spectacles glare reflection, and purr reactions on click.
