class Component extends DCLogic {
  state = { rows: null, dataLive: false, globalView: 'score', globalBias: 'positional', clock: '' };

  PALETTE = ['#F7931A', '#97FCE4', '#627EEA', '#14F195', '#F0B90B', '#23292F', '#E6007A', '#FF6B7A', '#3FE0A0', '#C2A633', '#8247E5', '#2775CA'];

  mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  fmtPrice(n) {
    if (n < 0.01) return n.toFixed(5);
    if (n < 1) return n.toFixed(4);
    if (n < 1000) return n.toFixed(2);
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  stamp(rnd) {
    const d = new Date(Date.now() - Math.floor(rnd() * 18) * 3600000);
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const z = (n) => String(n).padStart(2, '0');
    return z(d.getUTCDate()) + ' ' + mo[d.getUTCMonth()] + ' ' + String(d.getUTCFullYear()).slice(2) + ' ' + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes()) + ' UTC';
  }

  ICON_OK = 'btc eth sol xrp bnb ada doge trx ton link avax xlm sui hbar shib dot ltc bch uni pepe near apt icp etc aave vet fil algo atom arb op inj sei tia ldo imx grt stx mkr rune ftm gala sand mana axs crv comp snx sushi yfi zec dash xmr eos xtz neo iota zil enj bat omg qtum icx waves kava band ankr storj fet rose one ens ape gmt hype wld jup pyth strk blur tao render pendle ondo ena wif bonk floki not io zk pol matic celo rsr hnt ar egld flow ksm dydx gmx cake twt rpl fxs cfx mina rndr magic hot chz lunc ust btt hifi vtho';
  iconUrl(sym) {
    let s = sym.toLowerCase().replace(/^k/, '').replace(/[0-9]/g, '');
    const map = { xbt: 'btc', weth: 'eth' };
    if (map[s]) s = map[s];
    if (this.ICON_OK.split(' ').includes(s)) return 'https://assets.coincap.io/assets/icons/' + s + '@2x.png';
    // fallback: Hyperliquid's own coin art — covers every listed perp (LIT, FARTCOIN, PUMP, SPX, GRAM, …)
    return 'https://app.hyperliquid.xyz/coins/' + sym.replace(/^k/, '') + '.svg';
  }
  stamp2(ms) {
    if (!ms) return '—';
    const d = new Date(ms);
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const z = (n) => String(n).padStart(2, '0');
    return z(d.getUTCDate()) + ' ' + mo[d.getUTCMonth()] + ' ' + String(d.getUTCFullYear()).slice(2) + ' ' + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes()) + ' UTC';
  }
  stampStr(s) {
    if (!s) return '—';
    const m = s.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
    if (!m) return s;
    const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return m[3] + ' ' + mo[+m[2] - 1] + ' ' + m[1].slice(2) + ' ' + m[4] + ':' + m[5] + ' UTC';
  }
  wavgEntries(trades) {
    const byCoin = {};
    (trades || []).forEach((t) => {
      const c = byCoin[t.coin] = byCoin[t.coin] || { ln: 0, ld: 0, sn: 0, sd: 0 };
      const v = Math.abs(t.size);
      if (t.side === 'Long') { c.ln += v * t.entryPrice; c.ld += v; } else { c.sn += v * t.entryPrice; c.sd += v; }
    });
    const out = {};
    for (const c in byCoin) { const b = byCoin[c]; out[c] = { long: b.ld ? b.ln / b.ld : 0, short: b.sd ? b.sn / b.sd : 0 }; }
    return out;
  }
  sideFromSignal(sig, entries) {
    const L = sig.long || {}, S = sig.short || {};
    const uL = L.users || 0, uS = S.users || 0;
    const sL = Math.max(0, L.score || 0), sS = Math.max(0, S.score || 0);
    return {
      users: uL + uS, usersLong: uL, usersShort: uS,
      scoreLong: sL, scoreShort: sS,
      bearScore: (sL + sS) ? Math.round(sS / (sL + sS) * 100) : 50,
      bearUsers: (uL + uS) ? Math.round(uS / (uL + uS) * 100) : 50,
      entryLong: entries && entries.long ? this.fmtPrice(entries.long) : '—',
      entryShort: entries && entries.short ? this.fmtPrice(entries.short) : '—',
      recentLong: this.stampStr(L.most_recent_entry), recentShort: this.stampStr(S.most_recent_entry),
    };
  }
  buildRows(posSignals, daySignals, posEntries, dayEntries, markMap, changeMap) {
    const dayBy = {};
    (daySignals || []).forEach((s) => { dayBy[s.coin] = s; });
    const empty = { users: 0, usersLong: 0, usersShort: 0, scoreLong: 0, scoreShort: 0, bearScore: 50, bearUsers: 50, entryLong: '—', entryShort: '—', recentLong: '—', recentShort: '—' };
    return (posSignals || []).map((sig) => {
      const sym = sig.coin;
      const mark = markMap[sym] || 0;
      const pos = this.sideFromSignal(sig, posEntries[sym]);
      const daySig = dayBy[sym];
      const intra = daySig ? this.sideFromSignal(daySig, dayEntries[sym]) : empty;
      return {
        sym, rank: sig.rank || 999, price: mark, priceStr: mark ? this.fmtPrice(mark) : '—', change: changeMap[sym] || 0,
        alias: sym === 'SPX' ? 'SPX6900 · not the S&P index' : (sym[0] === 'k' ? '1000× ' + sym.slice(1) : ''),
        color: this.PALETTE[this.hash(sym) % this.PALETTE.length], icon: this.iconUrl(sym),
        score: pos.scoreLong + pos.scoreShort, pos, intra,
      };
    });
  }

  fallbackRows() {
    const FB = [
      { rank: 1, coin: 'BTC', long: { users: 11, score: 320, most_recent_entry: '' }, short: { users: 20, score: 610, most_recent_entry: '' } },
      { rank: 2, coin: 'ETH', long: { users: 8, score: 150, most_recent_entry: '' }, short: { users: 12, score: 380, most_recent_entry: '' } },
      { rank: 3, coin: 'SOL', long: { users: 6, score: 210, most_recent_entry: '' }, short: { users: 5, score: 90, most_recent_entry: '' } },
    ];
    return this.applyToggles(this.buildRows(FB, FB, {}, {}, {}, {}));
  }

  applyToggles(rows) {
    const prev = {}; (this.state.rows || []).forEach((r) => { prev[r.sym] = r; });
    rows.forEach((r) => {
      r.view = (prev[r.sym] && prev[r.sym].view) || this.state.globalView;
      r.bias = (prev[r.sym] && prev[r.sym].bias) || this.state.globalBias;
    });
    return rows;
  }

  async fetchData() {
    const markMap = {}, changeMap = {};
    try {
      const res = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
      });
      const [meta, ctxs] = await res.json();
      meta.universe.forEach((u, i) => {
        const c = ctxs[i];
        if (c) { const mk = parseFloat(c.markPx), pv = parseFloat(c.prevDayPx); markMap[u.name] = mk; changeMap[u.name] = pv > 0 ? ((mk - pv) / pv) * 100 : 0; }
      });
    } catch (e) {}
    try {
      // freshest price source: live mids straight from Hyperliquid's book
      const r2 = await fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":"allMids"}' });
      const mids = await r2.json();
      Object.keys(mids || {}).forEach((k) => {
        const v = parseFloat(mids[k]);
        if (!(v > 0) || k[0] === '@') return;
        const mk = markMap[k];
        // sanity guard: never let a thin-book mid replace the official mark if it drifts >3%
        if (!(mk > 0) || Math.abs(v - mk) / mk < 0.03) markMap[k] = v;
      });
    } catch (e) {}
    try {
      const j = (u) => fetch('https://apihyperliquid.github.io/api/' + u).then((r) => r.json()).catch(() => null);
      const [posSig, daySig, posTrades, dayTrades] = await Promise.all([
        j('signalOpenScore.json'), j('signalOpenScoreDay.json'), j('openTrades.json'), j('openDayTrades.json'),
      ]);
      if (!posSig || !posSig.signals) throw new Error('no signals');
      let rows = this.buildRows(posSig.signals, (daySig && daySig.signals) || [], this.wavgEntries(posTrades), this.wavgEntries(dayTrades), markMap, changeMap);
      rows.sort((a, b) => b.score - a.score);
      rows = this.applyToggles(rows.slice(0, 40));
      this.setState({ rows, dataLive: true });
    } catch (e) {
      if (!this.state.rows) this.setState({ rows: this.fallbackRows(), dataLive: false });
    }
  }

  componentDidMount() {
    this.fetchData();
    this.poll = setInterval(() => this.fetchData(), 15000);
  }
  componentWillUnmount() { clearInterval(this.poll); }

  onToggle = (sym, key, val) => {
    this.setState((s) => ({ rows: (s.rows || []).map((r) => r.sym === sym ? { ...r, [key]: val } : r) }));
  };
  setGlobal(key, val) {
    const sk = key === 'view' ? 'globalView' : 'globalBias';
    this.setState((s) => ({ [sk]: val, rows: (s.rows || []).map((r) => ({ ...r, [key]: val })) }));
  }

  renderVals() {
    const q = (this.state.q || '').trim().toLowerCase();
    const all = this.state.rows || [];
    const rows = q ? all.filter((r) => (r.sym || '').toLowerCase().includes(q)) : all;
    const gv = this.state.globalView, gb = this.state.globalBias;
    const aBg = (on) => on ? '#97FCE4' : 'transparent';
    const aC = (on) => on ? '#08130f' : '#7C9A91';
    return {
      rows,
      qVal: this.state.q || '',
      qTxt: (this.state.q || '').trim(),
      onSearch: (e) => this.setState({ q: e.target.value }),
      onClearQ: () => this.setState({ q: '' }),
      noMatch: !!q && rows.length === 0 && all.length > 0,
      onToggle: this.onToggle,
      onNavCb: this.props.onNav || null,
      pbGo: () => { if (this.props.onBack) this.props.onBack(); else location.href = 'Prep dashboard.dc.html?coin=SUI'; },
      hzGo: () => { if (this.props.onHedge) this.props.onHedge(); else location.href = 'Prep dashboard.dc.html?view=hedge'; },
      subtitle: all.length ? (q ? rows.length + ' of ' + all.length + ' assets match — clear FIND to see all.' : 'Top ' + all.length + ' assets · Score = Σ round(monthly ROI × 100) per open position.') : 'Loading live signals…',
      liveDot: this.state.dataLive ? '#3FE0A0' : '#F7C948',
      liveLabel: this.state.dataLive ? 'LIVE' : 'SIM',
      footer: (this.state.dataLive ? 'Live · signalOpenScore feed (positional) + signalOpenScoreDay (intraday) · apihyperliquid.github.io · marks from Hyperliquid' : 'Live feed unavailable — showing sample') + ' · Click a card to flip into its full perps dashboard',
      onScore: () => this.setGlobal('view', 'score'),
      onUsers: () => this.setGlobal('view', 'users'),
      onPos: () => this.setGlobal('bias', 'positional'),
      onIntra: () => this.setGlobal('bias', 'intraday'),
      gScoreBg: aBg(gv === 'score'), gScoreColor: aC(gv === 'score'),
      gUsersBg: aBg(gv === 'users'), gUsersColor: aC(gv === 'users'),
      gPosBg: aBg(gb === 'positional'), gPosColor: aC(gb === 'positional'),
      gIntraBg: aBg(gb === 'intraday'), gIntraColor: aC(gb === 'intraday'),
    };
  }
}