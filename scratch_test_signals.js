// Test the Signal Dashboard Component's exact data fetching and row building logic in Node.js

class DCLogic {
  constructor() {
    this.state = {};
  }
  setState(updater) {
    if (typeof updater === 'function') {
      this.state = Object.assign({}, this.state, updater(this.state));
    } else {
      this.state = Object.assign({}, this.state, updater);
    }
  }
}

// Read the exact Component from src/SignalDashboardComponent.js
const fs = require('fs');
const compCode = fs.readFileSync('src/SignalDashboardComponent.js', 'utf-8');

// Evaluate the component
const fn = new Function('DCLogic', compCode + '; return Component;');
const Component = fn(DCLogic);

async function runTest() {
  console.log('=== Initializing Signal Dashboard Component ===');
  const comp = new Component();
  console.log('Initial state:', comp.state);

  console.log('\n=== Calling comp.fetchData() ===');
  const startTime = Date.now();
  await comp.fetchData();
  const elapsed = Date.now() - startTime;

  console.log(`fetchData() finished in ${elapsed}ms`);
  console.log('dataLive:', comp.state.dataLive);
  console.log('Total rows generated:', comp.state.rows ? comp.state.rows.length : 0);

  if (comp.state.rows && comp.state.rows.length > 0) {
    console.log('\n=== Top 5 Signals in Dashboard ===');
    comp.state.rows.slice(0, 5).forEach((r, idx) => {
      console.log(`#${idx + 1} [${r.sym}]`);
      console.log(`   Price: $${r.priceStr} (24h change: ${r.change.toFixed(2)}%)`);
      console.log(`   Total Score: ${r.score}`);
      console.log(`   Positional: Long Users: ${r.pos.usersLong}, Short Users: ${r.pos.usersShort}, Bear Score: ${r.pos.bearScore}%`);
      console.log(`   Intraday: Long Users: ${r.intra.usersLong}, Short Users: ${r.intra.usersShort}, Bear Score: ${r.intra.bearScore}%`);
      console.log(`   Entry Long: $${r.pos.entryLong} | Entry Short: $${r.pos.entryShort}`);
      console.log(`   Recent Long Entry: ${r.pos.recentLong} | Recent Short Entry: ${r.pos.recentShort}`);
    });

    console.log('\n=== Checking Specific Coins (BTC, ETH, SOL, ZEC, HYPE) ===');
    const checkCoins = ['BTC', 'ETH', 'SOL', 'ZEC', 'HYPE', 'SUI', 'NEAR'];
    checkCoins.forEach(c => {
      const match = comp.state.rows.find(r => r.sym === c);
      if (match) {
        console.log(`  ${c}: Rank=${match.rank}, Price=$${match.priceStr}, Score=${match.score}, Change=${match.change.toFixed(2)}%`);
      } else {
        console.log(`  ${c}: Not in top 40 sorted by score`);
      }
    });

    console.log('\n=== Testing renderVals() ===');
    comp.props = {};
    const vals = comp.renderVals();
    console.log('liveLabel:', vals.liveLabel);
    console.log('liveDot:', vals.liveDot);
    console.log('subtitle:', vals.subtitle);
    console.log('footer:', vals.footer);
    console.log('Displayed rows:', vals.rows.length);
  } else {
    console.error('FAILED: No rows generated!');
  }
}

runTest().catch(err => {
  console.error('Test error:', err);
});
