window.HYPURR_MODELS = {
  gemini: [
    { id: 'gemini-3.8-flash', name: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Latest & Best)', tag: 'Latest' },
    { id: 'gemini-3.7-flash', name: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash', tag: '3.7' },
    { id: 'gemini-2.5-flash', name: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', tag: 'Fast' },
    { id: 'gemini-2.5-pro', name: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Deep Reasoning)', tag: 'Pro' },
    { id: 'gemini-2.0-flash', name: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Stable Fast)', tag: 'Stable' },
    { id: 'gemini-2.0-flash-lite', name: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite (Lightweight)', tag: 'Lite' },
    { id: 'gemini-2.0-flash-thinking-exp-01-21', name: 'gemini-2.0-thinking', label: 'Gemini 2.0 Flash Thinking Exp', tag: 'Thinking' },
    { id: 'gemini-2.0-pro-exp-02-05', name: 'gemini-2.0-pro-exp', label: 'Gemini 2.0 Pro Exp', tag: 'ProExp' },
    { id: 'gemini-1.5-flash', name: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Legacy)', tag: '1.5' },
    { id: 'gemini-1.5-pro', name: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Legacy Pro)', tag: '1.5' }
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'gpt-4o-mini', label: 'GPT-4o Mini (Recommended)', tag: 'Fast' },
    { id: 'gpt-4o', name: 'gpt-4o', label: 'GPT-4o (Flagship Omni)', tag: 'Omni' },
    { id: 'gpt-4.1-mini', name: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', tag: '4.1' },
    { id: 'gpt-4.1', name: 'gpt-4.1', label: 'GPT-4.1 (Flagship)', tag: '4.1' },
    { id: 'o3-mini', name: 'o3-mini', label: 'o3-mini (Reasoning)', tag: 'o3' }
  ],
  anthropic: [
    { id: 'claude-3-5-haiku-20241022', name: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Recommended)', tag: 'Fast' },
    { id: 'claude-3-7-sonnet-20250219', name: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (Advanced)', tag: '3.7' },
    { id: 'claude-3-5-sonnet-20241022', name: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', tag: '3.5' },
    { id: 'claude-3-haiku-20240307', name: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Legacy)', tag: '3.0' }
  ],
  openrouter: [
    { id: 'google/gemini-3.8-flash', name: 'google/gemini-3.8-flash', label: 'Gemini 3.8 Flash (via OpenRouter)', tag: 'Gemini' },
    { id: 'google/gemini-2.0-flash-001', name: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash (Recommended)', tag: 'Gemini' },
    { id: 'anthropic/claude-3.5-haiku', name: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku', tag: 'Claude' },
    { id: 'openai/gpt-4o-mini', name: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', tag: 'GPT' },
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct', tag: 'Llama' },
    { id: 'deepseek/deepseek-chat', name: 'deepseek/deepseek-chat', label: 'DeepSeek Chat (V3)', tag: 'DeepSeek' }
  ]
};

class Component extends DCLogic {
  T = { price: 3.4218, change: 5.84, funding: 0.0121, oi: 284.6, vol: 1.24, fng: 72 };
  coin = (new URLSearchParams(location.search).get('coin') || 'SUI').toUpperCase();
  // no coin picked and not the hedge view → show the lightweight board picker and start NOTHING heavy
  noCoin = (() => { const q = new URLSearchParams(location.search); return !q.has('coin') && q.get('view') !== 'hedge'; })();
  hedgeDeep = new URLSearchParams(location.search).get('view') === 'hedge';
  goCoin(c) { if (!c || c === this.coin) return; const u = new URL(location.href); u.searchParams.set('coin', c); location.href = u.href; }

  // per-coin max leverage straight from Hyperliquid's meta (BTC 40x … small caps 3x)
  maxLev = {};
  levFor(coin) { const L = Math.round(+this.maxLev[coin] || 0); return L >= 1 ? L : 10; }

  fmtPrice(n) {
    if (n < 0.1) return n.toFixed(6);
    if (n < 10) return n.toFixed(4);
    if (n < 1000) return n.toFixed(2);
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  coinTrades = [];
  state = {
    p: 0, liveDelta: 0, flash: '', clock: '--:--:--', dataLive: false,
    catMood: null,
    heat: this.makeHeat(this.T.price, []), hoverIdx: null, tipX: 0, tipY: 0, tipW: 600,
    heatSrc: (() => { try { return localStorage.getItem('perps-heat-src') || 'model'; } catch (e) { return 'model'; } })(), cgBust: 0,
    modal: null, lvTick: 0,
    trTab: (() => { try { return localStorage.getItem('hlg_tr_tab') || 'open'; } catch (e) { return 'open'; } })(),
    trStrat: (() => { try { return localStorage.getItem('hlg_tr_strat') || 'all'; } catch (e) { return 'all'; } })(),
    costMode: (() => { try { return localStorage.getItem('hlg_cost_mode') || 'net'; } catch (e) { return 'net'; } })(),
    pnlDisp: (() => { try { return localStorage.getItem('hlg_pnl_disp') || 'usd'; } catch (e) { return 'usd'; } })(),
  };

  // ---- liquidation heatmap geometry ----
  ICON_OK = 'btc eth sol xrp bnb ada doge trx ton link avax xlm sui hbar shib dot ltc bch uni pepe near apt icp etc aave vet fil algo atom arb op inj sei tia ldo imx grt stx mkr rune ftm gala sand mana axs crv comp snx sushi yfi zec dash xmr eos xtz neo iota zil enj bat omg qtum icx waves kava band ankr storj fet rose one ens ape gmt hype wld jup pyth strk blur tao render pendle ondo ena wif bonk floki not io zk pol matic celo rsr hnt ar egld flow ksm dydx gmx cake twt rpl fxs cfx mina rndr magic hot chz lunc ust btt hifi vtho';
  icon(sym) {
    let s = sym.toLowerCase().replace(/^k/, '').replace(/[0-9]/g, '');
    const map = { xbt: 'btc', weth: 'eth' };
    if (map[s]) s = map[s];
    if (this.ICON_OK.split(' ').includes(s)) return 'https://assets.coincap.io/assets/icons/' + s + '@2x.png';
    // fallback: Hyperliquid's own coin art — covers every listed perp (LIT, FARTCOIN, PUMP, SPX, GRAM, …)
    return 'https://app.hyperliquid.xyz/coins/' + sym.replace(/^k/, '') + '.svg';
  }
  fmtK(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return Math.round(n).toString();
  }
  fmtAxisPrice(n) {
    if (n >= 10000) return (n / 1000).toFixed(1) + 'K';
    if (n >= 1000) return (n / 1000).toFixed(2) + 'K';
    return this.fmtPrice(n);
  }
  shape(mid, n) {
    const low = mid * 0.9, span = mid * 0.22, bw = span / n;
    const rnd = (i) => { const x = Math.sin(i * 12.9898 + mid * 7.13) * 43758.5453; return x - Math.floor(x); };
    const arr = []; let sum = 0;
    for (let i = 0; i < n; i++) {
      const c = low + (i + 0.5) * bw, d = Math.abs(c - mid) / mid;
      const v = Math.exp(-Math.pow(d - 0.02, 2) / 8e-5)
              + 0.8 * Math.exp(-Math.pow(d - 0.05, 2) / 1.6e-4)
              + 0.6 * Math.exp(-Math.pow(d - 0.085, 2) / 2.4e-4);
      arr[i] = v * (0.5 + 0.95 * rnd(i)) + 0.04; sum += arr[i];
    }
    return arr.map((v) => v / (sum / n));
  }

  makeHeat(mid, trades) {
    const n = 48, low = mid * 0.82, high = mid * 1.18, span = high - low;
    const W = 1000, base = 300, top = 14;
    const x = (i) => (i / (n - 1)) * W;
    const bw = (W / n) * 0.66;
    const TIERS = [[10, 0.5], [25, 0.3], [50, 0.2]];
    const C = { 10: '#8FC0F0', 25: '#5B6EE8', 50: '#F2B33D' };

    // real liquidation levels: long liq = entry*(1-1/L), short liq = entry*(1+1/L)
    const mk = () => ({ t10: 0, t25: 0, t50: 0, longU: 0, shortU: 0, total: 0 });
    const buckets = []; for (let i = 0; i < n; i++) buckets.push(mk());
    let placed = 0;
    (trades || []).forEach((t) => {
      const ntl = Math.abs(t.size) * t.entryPrice;
      const isLong = t.side === 'Long';
      TIERS.forEach(([L, w]) => {
        const liq = isLong ? t.entryPrice * (1 - 1 / L) : t.entryPrice * (1 + 1 / L);
        if (liq < low || liq >= high) return;
        const b = buckets[Math.min(n - 1, Math.floor((liq - low) / (span / n)))];
        const v = ntl * w;
        b['t' + L] += v; b.total += v;
        if (isLong) b.longU += v; else b.shortU += v;
        placed += v;
      });
    });

    // fallback shape only when no real positions exist for this coin
    if (placed === 0) {
      const shape = this.shape(mid, n), scale = mid * 4e5 / n;
      const center0 = Math.round(((mid - low) / span) * (n - 1));
      shape.forEach((s, i) => {
        const b = buckets[i], v = s * scale;
        b.t10 = v * 0.5; b.t25 = v * 0.3; b.t50 = v * 0.2; b.total = v;
        if (i < center0) b.longU = v; else b.shortU = v;
      });
    }

    const center = Math.round(((mid - low) / span) * (n - 1));
    const maxU = Math.max(...buckets.map((b) => b.total), 1);

    const rects = [];
    buckets.forEach((b, i) => {
      if (b.total <= 0) { b.price = low + (i + 0.5) * (span / n); b.cx = +x(i).toFixed(1); return; }
      const totH = (b.total / maxU) * (base - top), cx = x(i);
      let yb = base;
      [['t10', C[10]], ['t25', C[25]], ['t50', C[50]]].forEach(([k, fill]) => {
        if (b[k] <= 0) return;
        const h = (b[k] / b.total) * totH; yb -= h;
        rects.push({ x: +(cx - bw / 2).toFixed(1), y: +yb.toFixed(1), w: +bw.toFixed(1), h: +h.toFixed(1), fill });
      });
      b.price = low + (i + 0.5) * (span / n); b.cx = +cx.toFixed(1);
    });

    // cumulative curves from real long/short liq notional
    const cumL = new Array(n).fill(0), cumR = new Array(n).fill(0);
    let run = 0; for (let i = center; i >= 0; i--) { run += buckets[i].longU; cumL[i] = run; }
    run = 0; for (let i = center; i < n; i++) { run += buckets[i].shortU; cumR[i] = run; }
    const maxCum = Math.max(cumL[0] || 1, cumR[n - 1] || 1, 1);
    buckets.forEach((b, i) => { b.cumLong = cumL[i]; b.cumShort = cumR[i]; });
    const cy = (v) => base - (v / maxCum) * (base - top) * 0.92;
    buckets.forEach((b, i) => { b.dotY = +cy(i <= center ? cumL[i] : cumR[i]).toFixed(1); b.isLong = i <= center; });

    let longLine = '', longFill = '';
    for (let i = 0; i <= center; i++) { longLine += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + cy(cumL[i]).toFixed(1) + ' '; }
    longFill = longLine + 'L' + x(center).toFixed(1) + ',' + base + ' L0,' + base + ' Z';
    let shortLine = '', shortFill = '';
    for (let i = center; i < n; i++) { shortLine += (i === center ? 'M' : 'L') + x(i).toFixed(1) + ',' + cy(cumR[i]).toFixed(1) + ' '; }
    shortFill = shortLine + 'L' + W + ',' + base + ' L' + x(center).toFixed(1) + ',' + base + ' Z';

    const leftAxis = [], rightAxis = [];
    for (let k = 4; k >= 0; k--) { leftAxis.push(this.fmtK(maxU * k / 4)); rightAxis.push(this.fmtK(maxCum * k / 4)); }
    const gridY = [0, 1, 2, 3, 4].map((k) => +(top + (base - top) * k / 4).toFixed(1));
    const xLabels = [0, 1, 2, 3, 4, 5].map((k) => this.fmtAxisPrice(low + span * k / 5));

    let li = 0, ri = n - 1;
    for (let i = 0; i < center; i++) if (buckets[i].longU > buckets[li].longU) li = i;
    for (let i = center + 1; i < n; i++) if (buckets[i].shortU > buckets[ri].shortU) ri = i;

    // ---- S/R zones: support = biggest long-liq wall below price, resistance = biggest short-liq wall above.
    // Zone = contiguous buckets holding ≥35% of the wall's peak notional.
    const zone = (idx, key) => {
      const peak = buckets[idx][key] || 1;
      let a = idx, b = idx;
      while (a > 0 && buckets[a - 1][key] >= peak * 0.35) a--;
      while (b < n - 1 && buckets[b + 1][key] >= peak * 0.35) b++;
      const bwF = span / n;
      return { lo: low + a * bwF, hi: low + (b + 1) * bwF, x0: Math.max(0, +(x(a) - bw / 2).toFixed(1)), x1: Math.min(W, +(x(b) + bw / 2).toFixed(1)) };
    };
    const supZ = zone(li, 'longU'), resZ = zone(ri, 'shortU');

    return {
      n, rects, buckets, longLine, longFill, shortLine, shortFill,
      curX: +x(center).toFixed(1), curXPct: +(x(center) / 10).toFixed(2),
      low, span,
      leftAxis, rightAxis, gridY, xLabels,
      longWall: this.fmtPrice(buckets[li].price) + ' · $' + this.fmtK(buckets[li].longU),
      shortWall: this.fmtPrice(buckets[ri].price) + ' · $' + this.fmtK(buckets[ri].shortU),
      supX: +x(li).toFixed(1), resX: +x(ri).toFixed(1),
      supXPct: +(x(li) / 10).toFixed(2), resXPct: +(x(ri) / 10).toFixed(2),
      supZX: supZ.x0, supZW: +(supZ.x1 - supZ.x0).toFixed(1),
      resZX: resZ.x0, resZW: +(resZ.x1 - resZ.x0).toFixed(1),
      supPill: '▼ SUP $' + this.fmtAxisPrice(buckets[li].price), resPill: '▲ RES $' + this.fmtAxisPrice(buckets[ri].price),
      supPrice: '$' + this.fmtPrice(buckets[li].price), resPrice: '$' + this.fmtPrice(buckets[ri].price),
      supRange: '$' + this.fmtPrice(supZ.lo) + ' – $' + this.fmtPrice(supZ.hi) + ' · $' + this.fmtK(buckets[li].longU) + ' long liqs',
      resRange: '$' + this.fmtPrice(resZ.lo) + ' – $' + this.fmtPrice(resZ.hi) + ' · $' + this.fmtK(buckets[ri].shortU) + ' short liqs',
    };
  }

  rebuildHeat() { this.setState({ heat: this.makeHeat(this.T.price, this.coinTrades) }); }

  hmWin() { const z = this.state.hmZ || 1; const vbW = 1000 / z; const vbX = Math.max(0, Math.min(1000 - vbW, this.state.hmX || 0)); return { z, vbW, vbX }; }
  onHover = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const h = this.state.heat; if (!h) return;
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const { vbW, vbX } = this.hmWin();
    if (this.hmDrag != null) { // drag-to-pan
      const dx = px - this.hmDrag; this.hmDrag = px;
      this.setState({ hmX: Math.max(0, Math.min(1000 - vbW, vbX - (dx / r.width) * vbW)), hoverIdx: null });
      return;
    }
    const idx = Math.max(0, Math.min(h.n - 1, Math.round(((vbX + (px / r.width) * vbW) / 1000) * (h.n - 1))));
    this.setState({ hoverIdx: idx, tipX: px, tipY: py, tipW: r.width });
  };
  onLeave = () => { this.hmDrag = null; this.setState({ hoverIdx: null }); };
  hmDown = (e) => { this.hmDrag = e.clientX - e.currentTarget.getBoundingClientRect().left; };
  hmUp = () => { this.hmDrag = null; };
  hmWheel = (e) => {
    const h = this.state.heat; if (!h) return;
    try { e.preventDefault(); } catch (x) {}
    const r = e.currentTarget.getBoundingClientRect();
    const { z: z0, vbW: vbW0, vbX: vbX0 } = this.hmWin();
    const fx = (e.clientX - r.left) / r.width;
    const z = Math.max(1, Math.min(8, z0 * (e.deltaY < 0 ? 1.25 : 0.8)));
    const vbW = 1000 / z;
    const cursor = vbX0 + fx * vbW0; // keep the price under the cursor pinned while zooming
    this.setState({ hmZ: z, hmX: Math.max(0, Math.min(1000 - vbW, cursor - fx * vbW)) });
  };
  hmReset = () => this.setState({ hmZ: 1, hmX: 0 });

  catHeadRef = React.createRef();
  // random idle moods once she's seated: happy hop, pumped jump, dance, wave a paw, groom/lick
  scheduleMood = () => {
    const moods = [
      { wrap: 'catHappy .6s ease-in-out 2', say: 'nya~', d: 1400 },
      { wrap: 'catPumped .5s ease-in-out 3', say: 'LFG!', d: 1650 },
      { wrap: 'catDance .5s ease-in-out 4', say: '\u266a \u266a', d: 2200 },
      { paw: 'pawWave 1.1s ease-in-out 2', say: 'hi!', d: 2350 },
      { paw: 'catLick 1.6s ease-in-out 2', head: 'catHeadLick 1.6s ease-in-out 2', tongue: true, say: '*lick lick*', d: 3350 },
    ];
    const m = moods[Math.floor(Math.random() * moods.length)];
    if (this.paused()) { this._moodT = setTimeout(this.scheduleMood, 6000); return; }
    this.setState({ catMood: m });
    clearTimeout(this._moodClr);
    this._moodClr = setTimeout(() => this.setState({ catMood: null }), m.d);
    this._moodT = setTimeout(this.scheduleMood, 4500 + Math.random() * 5200);
  };
  // pupils track the cursor via CSS vars --px/--py set on the head
  onCatMouse = (e) => {
    const el = this.catHeadRef.current; if (!el || this._pupRaf) return;
    const cx = e.clientX, cy = e.clientY;
    this._pupRaf = requestAnimationFrame(() => {
      this._pupRaf = 0;
      const h = this.catHeadRef.current; if (!h) return;
      const r = h.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1, k = Math.min(1, dist / 200);
      h.style.setProperty('--px', (dx / dist * 3.4 * k).toFixed(1) + 'px');
      h.style.setProperty('--py', (dy / dist * 2.8 * k).toFixed(1) + 'px');
    });
  };

  // pet the mascot: synthesized purr (no audio asset) + a little wiggle
  petCat = () => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this._ac = this._ac || new AC();
      const ac = this._ac, t = ac.currentTime;
      if (ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(), f = ac.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = 58;
      lfo.type = 'sine'; lfo.frequency.value = 23; lg.gain.value = 0.45;
      lfo.connect(lg); lg.connect(g.gain);
      f.type = 'lowpass'; f.frequency.value = 220;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.55, t + 0.12);
      g.gain.setValueAtTime(0.55, t + 1.15);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.55);
      o.connect(f); f.connect(g); g.connect(ac.destination);
      o.start(t); lfo.start(t); o.stop(t + 1.6); lfo.stop(t + 1.6);
    } catch (e) {}
    clearTimeout(this._petT);
    this.setState({ pet: true });
    this._petT = setTimeout(() => this.setState({ pet: false }), 1700);
  };

  // ---- Claude reads the liquidation heat map as a conviction factor ----
  // Works two ways: the built-in helper in the home workspace, or a user-supplied
  // Anthropic API key (stored ONLY in this browser) when deployed publicly.
  hasHostAI() { return !!(window.claude && typeof window.claude.complete === 'function'); }

  keyFor(p) {
    try {
      return (localStorage.getItem('hlg_ai_key_' + p) || (localStorage.getItem('hlg_ai_provider') === p ? localStorage.getItem('hlg_ai_key') : '') || (p === 'anthropic' ? localStorage.getItem('hlg_anthropic_key') : '') || '').trim();
    } catch (e) { return ''; }
  }

  modelFor(p) {
    try {
      return (localStorage.getItem('hlg_ai_model_' + p) || (localStorage.getItem('hlg_ai_provider') === p ? localStorage.getItem('hlg_ai_model') : '') || this.defModel(p)).trim();
    } catch (e) { return this.defModel(p); }
  }

  apiKey() {
    const p = this.kmSel();
    if (this.keyTmp !== undefined) return this.keyTmp.trim();
    return this.keyFor(p) || (localStorage.getItem('hlg_ai_key') || '').trim();
  }

  aiProv() { try { return localStorage.getItem('hlg_ai_provider') || 'gemini'; } catch (e) { return 'gemini'; } }

  aiModel() {
    const p = this.kmSel();
    if (this.modelTmp !== undefined) return (this.modelTmp || '').trim() || this.defModel(p);
    return this.modelFor(p) || this.defModel(p);
  }

  defModel(p) {
    return p === 'openai' ? 'gpt-4o-mini' : p === 'gemini' ? 'gemini-3.8-flash' : p === 'openrouter' ? 'google/gemini-3.8-flash' : 'claude-3-5-haiku-20241022';
  }

  kmSel() { return this.state.kmProv || this.aiProv(); }

  setKmProv(p) {
    this.keyTmp = undefined;
    this.modelTmp = undefined;
    this.kmDropOpen = false;
    this.kmTesting = null;
    this.setState({ kmProv: p });
  }

  async aiCall(system, userMsg) {
    if (this.hasHostAI()) {
      return window.claude.complete({ system, messages: [{ role: 'user', content: userMsg }], max_tokens: 400 });
    }
    const key = this.apiKey();
    if (!key) throw new Error('nokey');
    const provider = this.kmSel(), model = this.aiModel();
    let res = null;
    try {
      res = await fetch(location.origin + '/api/public/ai-proxy', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider, apiKey: key, model, system, prompt: userMsg }),
      });
    } catch (e) { res = null; }
    if (res) {
      let j = null;
      try { j = await res.json(); } catch (e) {}
      if (j && typeof j.text === 'string') return j.text;
      if (j && j.error) throw new Error(j.error);
    }
    return this.aiCallDirect(provider, model, key, system, userMsg);
  }

  async aiCallDirect(prov, model, key, system, userMsg) {
    if (prov === 'openai' || prov === 'openrouter') {
      const url = prov === 'openrouter' ? 'https://openrouter.ai/api/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      const headers = { 'content-type': 'application/json', authorization: 'Bearer ' + key };
      if (prov === 'openrouter') { headers['HTTP-Referer'] = location.origin; headers['X-Title'] = 'HypurrTrade'; }
      const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ model: model || this.defModel(prov), max_tokens: 200, messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }] }) });
      if (!r.ok) {
        let em = 'http ' + r.status;
        try { const ej = await r.json(); if (ej.error && ej.error.message) em = ej.error.message; } catch (e) {}
        throw new Error(em);
      }
      const j = await r.json();
      return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    }
    if (prov === 'gemini') {
      const fullPrompt = (system ? (system + '\n\n' + userMsg) : userMsg).trim();
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + (model || this.defModel('gemini')) + ':generateContent?key=' + encodeURIComponent(key), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: fullPrompt }] }], generationConfig: { maxOutputTokens: 200 } }),
      });
      if (!r.ok) {
        let em = 'http ' + r.status;
        try {
          const ej = await r.json();
          if (ej.error) {
            if (ej.error.message) em = ej.error.message;
            if (ej.error.details && ej.error.details[0] && ej.error.details[0].reason) {
              if (ej.error.details[0].reason === 'API_KEY_INVALID') em = 'API key not valid. Please pass a valid API key from aistudio.google.com';
            }
          }
        } catch (e) {}
        throw new Error(em);
      }
      const j = await r.json();
      return (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0].text) || '';
    }
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: model || this.defModel('anthropic'), max_tokens: 200, system, messages: [{ role: 'user', content: userMsg }] }),
    });
    if (!r.ok) {
      let em = 'http ' + r.status;
      try { const ej = await r.json(); if (ej.error && ej.error.message) em = ej.error.message; } catch (e) {}
      throw new Error(em);
    }
    const j = await r.json();
    return (j.content && j.content[0] && j.content[0].text) || '';
  }

  async kmRunTest() {
    if (this.hasHostAI()) { this.kmTesting = 'ok'; this.forceUpdate(); return; }
    const key = this.apiKey();
    if (!key) { this.kmTesting = 'No key entered yet.'; this.forceUpdate(); return; }
    this.kmTesting = 'testing'; this.forceUpdate();
    try {
      const t = await this.aiCall('Reply with exactly: OK', 'Connection test — reply OK.');
      this.kmTesting = (t && String(t).trim()) ? 'ok' : 'Empty reply from the provider.';
      this.aiErr = null; this.ai = null; this.aiLiqRead();
    } catch (e) {
      const m = ((e && e.message) || 'failed').toString();
      if (/API_KEY_INVALID|API key not valid/i.test(m)) {
        this.kmTesting = 'API key not valid — check your key at ' + (this.kmSel() === 'gemini' ? 'aistudio.google.com' : 'provider console');
      } else if (/401|403|unauthorized|forbidden|rejected/i.test(m)) {
        this.kmTesting = 'Key rejected — check your API key permissions';
      } else if (/429|quota|rate/i.test(m)) {
        this.kmTesting = 'Rate limited or quota exceeded (429) — try again shortly';
      } else if (/404|not found/i.test(m)) {
        this.kmTesting = 'Model not found — select another model from the dropdown';
      } else if (m === 'nokey') {
        this.kmTesting = 'No key entered yet.';
      } else {
        this.kmTesting = 'Failed: ' + m.replace(/^Error:\s*/, '').slice(0, 95);
      }
    }
    this.forceUpdate();
  }

  async aiLiqRead() {
    if (this.aiBusy) return;
    if (this.ai && Date.now() - this.ai.t < 60e3) return; // refresh at most every 60s
    const h = this.state.heat, m = this.T.price;
    if (!m || !h || !h.buckets || !h.buckets.length) return;
    if (!this.hasHostAI() && !this.apiKey()) { this.aiErr = 'nokey'; return; }
    this.aiBusy = true;
    try {
      const above = [], below = [];
      h.buckets.forEach((b) => { if (b.price > m && b.shortU > 0) above.push(b); if (b.price < m && b.longU > 0) below.push(b); });
      above.sort((a, b) => b.shortU - a.shortU); below.sort((a, b) => b.longU - a.longU);
      const ev = this.loadLiq();
      const hr = Date.now() - 3600e3;
      const sum = {
        coin: this.coin, price: m,
        shortLiqPocketsAbove: above.slice(0, 3).map((b) => ({ px: +b.price.toFixed(6), usd: Math.round(b.shortU) })),
        longLiqPocketsBelow: below.slice(0, 3).map((b) => ({ px: +b.price.toFixed(6), usd: Math.round(b.longU) })),
        realLiqs48h: { longsLiquidatedUsd: Math.round(ev.filter((e) => e.s === 'long').reduce((s, e) => s + e.usd, 0)), shortsLiquidatedUsd: Math.round(ev.filter((e) => e.s === 'short').reduce((s, e) => s + e.usd, 0)) },
        realLiqsLastHourCount: ev.filter((e) => e.t > hr).length,
      };
      const text = await this.aiCall(
        'You are a crypto liquidation heat-map analyst (Coinglass-style). Given liquidation cluster data, judge which side price is more likely to be pulled toward (liquidity-magnet logic: dense short-liq pockets above attract upward sweeps; dense long-liq pockets below attract downward sweeps; heavy one-sided recent cascades may be exhausted). Reply STRICT JSON only: {"bias":<number -1..1, positive=upside>,"target":<the price level (number) it is most likely pulled toward, from the given pockets>,"note":"<short plain sentence, max 60 chars>"}',
        JSON.stringify(sum));
      let cleaned = String(text || '').replace(/```(?:json)?/gi, '').trim();
      let mt = cleaned.match(/\{[\s\S]*\}/);
      let j = null;
      if (mt) {
        try { j = JSON.parse(mt[0]); } catch (e) {}
      }
      if (!j) {
        const biasM = cleaned.match(/["']?bias["']?\s*:\s*(-?[\d.]+)/i);
        const targetM = cleaned.match(/["']?target["']?\s*:\s*([\d.]+)/i);
        const noteM = cleaned.match(/["']?note["']?\s*:\s*["']([^"']+)["']/i);
        if (biasM) {
          j = {
            bias: parseFloat(biasM[1]),
            target: targetM ? parseFloat(targetM[1]) : 0,
            note: noteM ? noteM[1] : ''
          };
        }
      }
      if (!j) throw new Error('no JSON in reply: ' + cleaned.slice(0, 80));
      const bias = Math.max(-1, Math.min(1, +j.bias || 0));
      // target sanity: must be a price on the side the AI leans; else use the densest pocket there
      let tgt = +j.target || 0;
      const pocketUp = above.length ? above[0].price : 0, pocketDn = below.length ? below[0].price : 0;
      if (bias > 0.05) { if (!(tgt > m)) tgt = pocketUp; }
      else if (bias < -0.05) { if (!(tgt < m) || tgt <= 0) tgt = pocketDn; }
      else tgt = 0;
      this.ai = { bias, target: tgt, note: String(j.note || '').slice(0, 90), t: Date.now() };
      this.aiErr = null;
      this.forceUpdate();
    } catch (e) {
      const msg = (e && e.message) || '';
      this.aiErr = msg === 'nokey' ? 'nokey' : /401|403/.test(msg) ? 'badkey' : 'AI read failed — retrying';
      this.aiErrDetail = msg.slice(0, 120);
      if (!this.aiRetryT) this.aiRetryT = setTimeout(() => { this.aiRetryT = null; this.aiLiqRead(); }, 20000); // fast retry instead of waiting the full 90s
      this.forceUpdate();
    }
    this.aiBusy = false;
  }

  computeRec(bookOut) {
    const m = this.T.price;
    const h = this.state.heat;
    if (!m || !h || !h.buckets) return null;

    // factor 1: smart-money positioning (signal scores = ROI-weighted)
    const sL = this.sig ? Math.max(0, (this.sig.long || {}).score || 0) : 0;
    const sS = this.sig ? Math.max(0, (this.sig.short || {}).score || 0) : 0;
    const fSm = (sL + sS) ? (sL - sS) / (sL + sS) : 0;

    // factor 2: funding (positive = crowded longs = contrarian short)
    const fFund = -Math.tanh(this.T.funding / 0.02);

    // factor 3: order book depth imbalance
    const bidPct = bookOut ? bookOut.bidPct : 50;
    const fBook = (bidPct - 50) / 50;

    // factor 4: liquidation magnet (price sweeps the denser pool)
    const center = Math.round(h.buckets.length * ((m - m * 0.82) / (m * 1.18 - m * 0.82)));
    let longPool = 0, shortPool = 0, bigShortB = null, bigLongB = null;
    h.buckets.forEach((b, i) => {
      longPool += b.longU; shortPool += b.shortU;
      if (i > center && (!bigShortB || b.shortU > bigShortB.shortU)) bigShortB = b;
      if (i < center && (!bigLongB || b.longU > bigLongB.longU)) bigLongB = b;
    });
    const fLiq = (longPool + shortPool) ? (shortPool - longPool) / (shortPool + longPool) : 0;

    // factor 5: 24h momentum
    const fMom = Math.tanh(this.T.change / 5);

    // factor 6: Claude's read of the liquidation heat map (refreshes ~90s)
    const ai = (this.ai && Date.now() - this.ai.t < 300e3) ? this.ai : null;
    const fAI = ai ? Math.max(-1, Math.min(1, +ai.bias || 0)) : 0;

    const score = fSm * 30 + fFund * 10 + fBook * 20 + fLiq * 25 + fMom * 15 + fAI * 15;
    const isLong = score >= 0;
    const neutral = Math.abs(score) < 8;
    const conv = Math.min(92, Math.round(50 + Math.abs(score) * 0.45));

    // trade params @ this coin's max Hyperliquid leverage
    const L = this.levFor(this.coin);
    const liqDist = 0.95 / L; // isolated-margin liq distance ≈ 1/L minus maintenance buffer
    let target;
    if (isLong) target = (bigShortB && bigShortB.shortU > 0) ? bigShortB.price : m * 1.05;
    else target = (bigLongB && bigLongB.longU > 0) ? bigLongB.price : m * 0.95;
    const tPct = (target / m - 1);
    // stop must sit safely inside the liquidation distance (≤60% of it)
    const risk = Math.min(Math.min(0.04, liqDist * 0.6), Math.max(0.015 > liqDist * 0.6 ? liqDist * 0.6 : 0.015, Math.abs(tPct) * 0.35));
    const stop = isLong ? m * (1 - risk) : m * (1 + risk);
    const liq = isLong ? m * (1 - liqDist) : m * (1 + liqDist);
    const R = Math.abs(tPct) / risk;

    const P = (v) => '$' + this.fmtPrice(v);
    const pc = (v) => (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(1) + '%';
    const G = '#3FE0A0', Rd = '#FF6B7A', Y = '#F7C948';
    const bar = (f) => { const w = Math.min(50, Math.abs(f) * 50); return { barLeft: f >= 0 ? 50 : 50 - w, barW: Math.max(2, w), color: f > 0.05 ? G : f < -0.05 ? Rd : Y, click: null, cur: 'default' }; };
    const factors = [
      { label: 'Smart-money score (ROI-wtd)', val: 'L ' + sL.toLocaleString() + ' / S ' + sS.toLocaleString(), ...bar(fSm) },
      { label: 'Liquidation magnet', val: '$' + this.fmtK(longPool) + ' below / $' + this.fmtK(shortPool) + ' above', ...bar(fLiq) },
      { label: 'Liq-map read (AI)', val: ai ? (Math.abs(fAI) <= 0.05 || !(ai.target > 0) ? 'no clear pull' : (Math.abs(fAI) >= 0.6 ? 'strong ' : Math.abs(fAI) >= 0.25 ? 'clear ' : 'slight ') + (fAI > 0 ? 'up to $' : 'down to $') + this.fmtPrice(ai.target)) : (this.aiErr === 'nokey' ? 'connect AI key →' : this.aiErr === 'badkey' ? 'key rejected — tap to fix' : this.aiErr ? 'retrying in 20s…' : 'analyzing…'), full: ai ? (ai.target > 0 ? 'AI expects price to get pulled ' + (fAI > 0.05 ? 'UP' : 'DOWN') + ' toward the $' + this.fmtPrice(ai.target) + ' liq. cluster — ' : '') + ai.note : (this.aiErrDetail ? 'Last error: ' + this.aiErrDetail : 'Click to connect an AI key — Claude, GPT, Gemini or OpenRouter'), ...bar(fAI), click: this.hasHostAI() ? null : (() => this.setState({ keyModal: true })), cur: this.hasHostAI() ? 'default' : 'pointer' },
      { label: 'Order book depth', val: bidPct + '% bid / ' + (100 - bidPct) + '% ask', ...bar(fBook) },
      { label: '24h momentum', val: (this.T.change >= 0 ? '+' : '') + this.T.change.toFixed(2) + '%', ...bar(fMom) },
      { label: 'Funding (contrarian)', val: (this.T.funding >= 0 ? '+' : '') + this.T.funding.toFixed(4) + '%/h', ...bar(fFund) },
    ];

    const sideWord = neutral ? 'NEUTRAL' : (isLong ? 'LONG' : 'SHORT');
    // narrative: rank factors by signed contribution toward the verdict
    const dir = isLong ? 1 : -1;
    const smPctLong = (sL + sS) ? Math.round(sL / (sL + sS) * 100) : 50;
    const descs = [
      { c: fSm * 30, sup: smPctLong + '% of ROI-weighted trader score is ' + (fSm >= 0 ? 'long' : 'short'), opp: 'profitable traders lean ' + (fSm >= 0 ? 'long (' + smPctLong + '%)' : 'short (' + (100 - smPctLong) + '%)') },
      { c: fLiq * 25, sup: fLiq >= 0 ? '$' + this.fmtK(shortPool) + ' of short liquidations sits above (largest pocket ' + P(bigShortB ? bigShortB.price : m * 1.05) + ') and acts as a magnet — forced buy-backs fuel the move up' : '$' + this.fmtK(longPool) + ' of long liquidations sits below (largest pocket ' + P(bigLongB ? bigLongB.price : m * 0.95) + ') and acts as a magnet — cascading stop-outs accelerate the drop', opp: 'the bigger liquidation pool sits ' + (fLiq >= 0 ? 'above' : 'below') + ' price' },
      { c: fBook * 20, sup: (fBook >= 0 ? bidPct + '% of near-book depth is on the bid, cushioning dips' : (100 - bidPct) + '% of near-book depth is on the ask, capping rallies'), opp: 'book depth leans ' + (fBook >= 0 ? 'bid' : 'ask') },
      { c: fMom * 15, sup: '24h momentum is ' + (this.T.change >= 0 ? '+' : '') + this.T.change.toFixed(1) + '%', opp: '24h momentum runs ' + (this.T.change >= 0 ? 'up' : 'down') + ' ' + Math.abs(this.T.change).toFixed(1) + '%' },
      { c: fFund * 10, sup: 'funding at ' + (this.T.funding >= 0 ? '+' : '') + this.T.funding.toFixed(4) + '%/h ' + (fFund >= 0 ? 'punishes crowded longs' : 'punishes crowded shorts'), opp: 'funding leans the other way' },
      { c: fAI * 15, sup: 'the AI liq-map read is ' + (fAI >= 0 ? 'bullish' : 'bearish') + (ai ? ' — ' + ai.note : ''), opp: 'the AI liq-map read leans ' + (fAI >= 0 ? 'bullish' : 'bearish') },
    ];
    const supports = descs.filter((d) => d.c * dir > 0.5).sort((a, b) => Math.abs(b.c) - Math.abs(a.c));
    const opposes = descs.filter((d) => d.c * dir < -0.5).sort((a, b) => Math.abs(b.c) - Math.abs(a.c));
    let why;
    if (neutral) {
      why = 'Signals conflict — ' + (supports[0] ? supports[0].sup : 'no factor dominates') + ', but ' + (opposes[0] ? opposes[0].opp : 'the rest is balanced') + '. At ' + L + 'x a conflicted tape is how accounts die: the model has no edge here, and flat is a position.';
    } else {
      why = 'The model leans ' + (isLong ? 'long' : 'short') + ' because ' + supports.slice(0, 2).map((d) => d.sup).join('; and ') + '.'
        + (opposes.length ? ' It leans this way despite ' + opposes[0].opp + ' — that factor is outweighed.' : '')
        + ' Stop ' + pc(isLong ? -risk : risk) + ' keeps you inside the ' + L + 'x liquidation at ' + P(liq) + '.';
    }

    // ---- positioning read: real cohort bases from top-trader open positions ----
    let lnN = 0, lnD = 0, shN = 0, shD = 0;
    (this.coinTrades || []).forEach((t) => { const v = Math.abs(t.size); if (t.side === 'Long') { lnN += v * t.entryPrice; lnD += v; } else { shN += v * t.entryPrice; shD += v; } });
    const avgL = lnD ? lnN / lnD : 0, avgS = shD ? shN / shD : 0;
    const uLw = this.sig ? ((this.sig.long || {}).users || 0) : 0;
    const uSw = this.sig ? ((this.sig.short || {}).users || 0) : 0;
    const profL = avgL ? m / avgL - 1 : 0;  // longs' open move from basis (+ = in profit)
    const profS = avgS ? 1 - m / avgS : 0;  // shorts' open move from basis (+ = in profit)
    const pcS = (v) => (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(1) + '%';
    const cohortNote = (prof, isLongC) => {
      const a = (Math.abs(prof) * 100).toFixed(1);
      if (prof >= 0.05) return 'seasoned — entered ' + a + '% ' + (isLongC ? 'below' : 'above') + ' price and riding open profit. Their ' + (isLongC ? 'bullishness' : 'bearishness') + ' is an old position, not a fresh bet: they defend their basis on a revisit rather than chase here.';
      if (prof <= -0.03) return 'trapped — basis is ' + a + '% offside. Their forced stops and liquidations are fuel for the other side, not conviction.';
      return 'fresh — basis is within ' + a + '% of the current price. This cohort chose THIS exact level ' + (isLongC ? 'to buy' : 'to fade') + '; their basis is the live battle line.';
    };
    const posRows = [];
    if (avgL > 0) posRows.push({ k: 'LONG COHORT · ' + uLw + ' TOP WALLETS', v: 'basis ' + P(avgL) + ' · ' + pcS(profL), c: profL >= 0 ? G : Rd, note: cohortNote(profL, true) });
    if (avgS > 0) posRows.push({ k: 'SHORT COHORT · ' + uSw + ' TOP WALLETS', v: 'basis ' + P(avgS) + ' · ' + pcS(profS), c: profS >= 0 ? G : Rd, note: cohortNote(profS, false) });
    let vHoldK = '', vHold = '';
    if (posRows.length) {
      // battle line = the fresher cohort's basis (closest to its entry). Holding the right side of it 24–48h breaks that cohort.
      const freshShort = avgS > 0 && (!avgL || Math.abs(profS) <= Math.abs(profL));
      const battle = freshShort ? avgS : avgL;
      const upPx = (bigShortB && bigShortB.shortU > 0) ? bigShortB.price : m * 1.05;
      const dnPx = (bigLongB && bigLongB.longU > 0) ? bigLongB.price : m * 0.95;
      const cls = (prof) => prof >= 0.05 ? 'seasoned' : prof <= -0.03 ? 'trapped' : 'fresh';
      vHoldK = 'BATTLE LINE ' + P(battle) + ' — THE 24–48H RULE';
      vHold = freshShort
        ? 'The ' + cls(profS) + ' shorts hold a ' + P(avgS) + ' basis. Every session price stays above it starves them of follow-through — 24–48h of holding typically forces covers toward the ' + P(upPx) + ' short-liq pocket ($' + this.fmtK(shortPool) + ' above). But if the level breaks and price holds below for more than a few hours, the ' + P(dnPx) + ' long-liq magnet opens ($' + this.fmtK(longPool) + ' below' + (avgL > 0 ? ' — landing at the ' + cls(profL) + ' longs\u2019 ' + P(avgL) + ' basis' : '') + ').'
        : 'The ' + cls(profL) + ' longs hold a ' + P(avgL) + ' basis. Every session price stays below it starves them — 24–48h of failure typically forces exits toward the ' + P(dnPx) + ' long-liq pocket ($' + this.fmtK(longPool) + ' below). But if the level is reclaimed and held for more than a few hours, the ' + P(upPx) + ' short-liq magnet opens ($' + this.fmtK(shortPool) + ' above' + (avgS > 0 ? ' — at the ' + cls(profS) + ' shorts\u2019 ' + P(avgS) + ' basis' : '') + ').';
    }

    return {
      vWord: sideWord, vArrow: neutral ? '·' : (isLong ? '↗' : '↘'),
      vColor: neutral ? Y : (isLong ? G : Rd), vTextOn: neutral ? '#0a1614' : (isLong ? '#0a1614' : '#fff'),
      vBorder: neutral ? 'rgba(247,201,72,.25)' : (isLong ? 'rgba(63,224,160,.28)' : 'rgba(255,107,122,.28)'),
      vConv: conv,
      vEntry: P(m * (isLong ? 0.997 : 1.003)) + ' – ' + P(m * (isLong ? 1.003 : 0.997)),
      vTarget: P(target), vTargetPct: pc(tPct),
      vStop: P(stop), vStopPct: pc(isLong ? -risk : risk),
      vLiq: P(liq) + ' (' + pc(isLong ? -liqDist : liqDist) + ')',
      vR: R.toFixed(1) + ' : 1',
      vLevX: L + 'X', vLevWord: L + 'x',
      vStopLev: '−' + Math.round(risk * 100 * L) + '%',
      vFactors: factors, vWhy: why,
      vPosHas: posRows.length > 0, vPosRows: posRows, vHoldK: vHoldK, vHold: vHold,
      _score: score, _m: m, _target: target, _stop: stop, _isLong: isLong, _neutral: neutral,
    };
  }

  manageRec(raw) {
    if (!raw) return;
    const key = 'hlg_rec_' + this.coin, hkey = 'hlg_hist_' + this.coin;
    let rec = null; try { rec = JSON.parse(localStorage.getItem(key)); } catch (e) {}
    const m = this.T.price;
    const push = (r, outcome, exit) => {
      let hist = []; try { hist = JSON.parse(localStorage.getItem(hkey)) || []; } catch (e) {}
      const dirn = r.side === 'LONG' ? 1 : -1;
      const riskAbs = Math.abs(r.entry - r.stop) || 1;
      const rr = ((exit - r.entry) * dirn) / riskAbs;
      hist.unshift({ side: r.side, entry: r.entry, exit, outcome, r: +rr.toFixed(2), t: Date.now() });
      localStorage.setItem(hkey, JSON.stringify(hist.slice(0, 50)));
    };
    if (rec && rec.side) {
      const dirn = rec.side === 'LONG' ? 1 : -1;
      if ((m - rec.target) * dirn >= 0) { push(rec, 'tp', rec.target); rec = null; }
      else if ((m - rec.stop) * dirn <= 0) { push(rec, 'sl', rec.stop); rec = null; }
      else if (!raw._neutral && (raw._isLong ? 1 : -1) !== dirn && Math.abs(raw._score) >= 12) { push(rec, 'flip', m); rec = null; }
    }
    if (!rec && !raw._neutral) rec = { side: raw._isLong ? 'LONG' : 'SHORT', entry: raw._m, target: raw._target, stop: raw._stop, t0: Date.now() };
    if (rec) localStorage.setItem(key, JSON.stringify(rec)); else localStorage.removeItem(key);
    this.setState({ rec });
  }

  lockVals(raw) {
    const rec = this.state.rec;
    if (!rec || !rec.side) return null;
    const isLong = rec.side === 'LONG', e = rec.entry;
    const P = (v) => '$' + this.fmtPrice(v);
    const pc = (v) => (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(1) + '%';
    const G = '#3FE0A0', Rd = '#FF6B7A';
    const R = Math.abs(rec.target / e - 1) / (Math.abs(rec.stop / e - 1) || 1);
    const mins = Math.round((Date.now() - rec.t0) / 60000);
    return {
      vWord: rec.side, vArrow: isLong ? '↗' : '↘',
      vColor: isLong ? G : Rd, vTextOn: isLong ? '#0a1614' : '#fff',
      vBorder: isLong ? 'rgba(63,224,160,.28)' : 'rgba(255,107,122,.28)',
      vEntry: P(e), vTarget: P(rec.target), vTargetPct: pc(rec.target / e - 1),
      vStop: P(rec.stop), vStopPct: pc(rec.stop / e - 1),
      vLiq: (() => { const d = 0.95 / this.levFor(this.coin); return P(e * (isLong ? 1 - d : 1 + d)) + ' (' + (isLong ? '−' : '+') + (d * 100).toFixed(1) + '%)'; })(),
      vR: R.toFixed(1) + ' : 1',
      vSince: mins < 1 ? 'just now' : mins < 60 ? mins + 'm ago' : Math.round(mins / 60) + 'h ago',
    };
  }

  // ---- background scanner: evaluates ALL tracked coins every 60s, trades without the page open ----
  async scan() {
    try {
      const now = Date.now();
      let last = 0; try { last = +localStorage.getItem('hlg_scan_lock') || 0; } catch (e) {}
      if (now - last < 55000) return; // another tab swept recently
      try { localStorage.setItem('hlg_scan_lock', String(now)); } catch (e) {}
      const [sg, meta] = await Promise.all([
        fetch('https://apihyperliquid.github.io/api/signalOpenScore.json').then((r) => r.json()),
        fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":"metaAndAssetCtxs"}' }).then((r) => r.json()),
      ]);
      const ctxByCoin = {};
      if (Array.isArray(meta) && meta[0] && Array.isArray(meta[0].universe) && Array.isArray(meta[1])) {
        meta[0].universe.forEach((u, i) => { ctxByCoin[u.name] = meta[1][i]; if (+u.maxLeverage > 0) this.maxLev[u.name] = +u.maxLeverage; });
      }
      this.ctxMap = ctxByCoin; // live funding + impact prices per coin, reused for cost modeling
      // ---- V3 self-tuning: every sweep re-derives its gates from the bot's own record ----
      const { w, open, hist } = this.paperLoad();
      const byT = hist.filter((h) => (h.src || 'scan') === 'scan').sort((a, b) => (b.t || 0) - (a.t || 0));
      const recNet = byT.slice(0, 12).reduce((a, h) => a + (h.pnl || 0), 0); // rolling net of last 12 closes
      const rec12 = byT.slice(0, 12);
      const winRate12 = rec12.length ? rec12.filter((h) => ((h.pnlNet != null ? h.pnlNet : h.pnl) || 0) > 0).length / rec12.length : 0.5;
      // learn from wins AND losses: press size on a hot streak, shrink it when cold
      const sizeF = rec12.length >= 8 ? (recNet > 0 && winRate12 >= 0.5 ? 0.15 : winRate12 < 0.35 ? 0.09 : 0.12) : 0.12;
      let lastT0 = 0;
      open.concat(hist).forEach((t) => { if ((t.src || 'scan') === 'scan' && (t.t0 || 0) > lastT0) lastT0 = t.t0; });
      const hungerH = lastT0 ? Math.max(0, (now - lastT0) / 3600e3) : 4;
      // start strict; tighten +2 conviction after a losing dozen; relax when starved (hard floors)
      const convMin = Math.max(74, Math.min(84, 78 + (recNet < 0 ? 2 : 0) - Math.floor(Math.max(0, hungerH - 3) / 2)));
      const rules = this.memRules(now); // lessons re-derived from the memory ledger every sweep
      let spCap = Math.min(0.002, 0.0008 + Math.max(0, hungerH - 3) * 0.0002); // widens 0.08%→0.20% after 3h dry
      if (rules.wideLoses) spCap = 0.0008; // learned: wide-spread entries lost money — the cap stays strict
      const smMin = hungerH > 6 ? 0.1 : 0.2;
      // learned mistake-avoidance: a direction losing ≥70% of its last 8+ closes is banned until it cools
      const sideStat = { LONG: { n: 0, w: 0 }, SHORT: { n: 0, w: 0 } };
      byT.slice(0, 24).forEach((h) => { const s = sideStat[h.side]; if (s) { s.n++; if (((h.pnlNet != null ? h.pnlNet : h.pnl) || 0) > 0) s.w++; } });
      const blockedSide = ['LONG', 'SHORT'].find((sd) => sideStat[sd].n >= 10 && sideStat[sd].w / sideStat[sd].n < 0.38) || null;
      const rows = [];
      let upN = 0, totN = 0, bookNote = ''; // market breadth counters + liquidity-book audit note
      (sg.signals || []).forEach((s) => {
        const c = ctxByCoin[s.coin]; if (!c) return;
        const mark = parseFloat(c.markPx || c.midPx), prev = parseFloat(c.prevDayPx);
        if (!(mark > 0) || !(prev > 0)) return;
        const sL = Math.max(0, (s.long || {}).score || 0), sS = Math.max(0, (s.short || {}).score || 0);
        if (sL + sS <= 0) return;
        const fSm = (sL - sS) / (sL + sS);
        const chg = mark / prev - 1;
        totN++; if (chg > 0) upN++;
        const fMom = Math.max(-1, Math.min(1, chg / 0.06));
        const fFund = Math.max(-1, Math.min(1, -(parseFloat(c.funding) || 0) / 0.0004));
        // V2: smart money leads (55) — momentum de-weighted to 25 (the 85%+ conviction trades it drove LOST most)
        const score = fSm * 55 + fMom * 25 + fFund * 20; // -100..100
        const side = score >= 0 ? 'LONG' : 'SHORT';
        const dir = side === 'LONG' ? 1 : -1;
        const conv = Math.min(95, Math.round(50 + Math.abs(score) * 0.45));
        const sp = this.spreadOf(c, mark);
        // V4 hard gates — every one must pass; most days most coins fail, and that is the point
        const banned = rules.bans[s.coin] != null; // memory: 2 losses on a coin in 7d = 3-day ban
        const crowded = rules.hotConv && conv >= rules.hotConv; // LEARNED: extreme conviction = crowded trade (worst bucket in the ledger)
        const chase = rules.momChase && fMom * dir >= 0.6; // LEARNED: momentum-led entries lose — don't chase extended moves
        const ok = !banned && !crowded && !chase
          && fSm * dir >= smMin                            // smart-money positioning agrees with the trade
          && chg * dir >= -0.01                            // never fight the daily trend
          && Math.abs(chg) <= 0.10                         // never chase a >10% day
          && sp <= spCap                                   // spread cap — self-tuned, widens when starved
          && (parseFloat(c.dayNtlVlm) || 0) >= 2e6;        // ≥ $2M daily volume
        const why = ok ? '' : (banned ? 'on 3-day ban (2 losses this week)' : crowded ? 'conv ≥' + rules.hotConv + '% = crowded (that bucket lost)' : chase ? 'momentum-chase (learned: those lose)' : fSm * dir < smMin ? 'smart-$ not aligned' : chg * dir < -0.01 ? 'fights daily trend' : Math.abs(chg) > 0.10 ? '>10% day, no chase' : sp > spCap ? 'spread ' + (sp * 100).toFixed(2) + '% > ' + (spCap * 100).toFixed(2) + '% cap' : 'volume < $2M');
        rows.push({ coin: s.coin, side, conv, mark, fund: parseFloat(c.funding) || 0, sp, ok, why, fSm: +fSm.toFixed(2), mom: +(fMom * dir).toFixed(2) });
      });
      rows.sort((a, b) => b.conv - a.conv);
      // market read: breadth across all swept coins decides the regime before any entry
      const breadth = totN ? upN / totN : 0.5;
      const regime = breadth >= 0.65 ? 'RISK-ON' : breadth <= 0.35 ? 'RISK-OFF' : 'MIXED';
      // verdict locks + trade opening
      const still = open.slice();
      let changed = false;
      // V2 circuit breaker: 2+ stop-outs inside 2h → stand down for 2h (loss clusters were the account killer)
      const recentSl = hist.filter((h) => (h.outcome === 'sl') && now - h.t < 7200e3).length;
      let pauseUntil = 0; try { pauseUntil = +localStorage.getItem('hlg_pause_until') || 0; } catch (e) {}
      if (recentSl >= 2 && now > pauseUntil) { pauseUntil = now + 7200e3; try { localStorage.setItem('hlg_pause_until', String(pauseUntil)); } catch (e) {} }
      const paused = now < pauseUntil;
      for (const r of rows) {
        let rec = null; try { rec = JSON.parse(localStorage.getItem('hlg_bgrec_' + r.coin)); } catch (e) {}
        if (!rec || rec.side !== r.side) { rec = { side: r.side, t0: now }; try { localStorage.setItem('hlg_bgrec_' + r.coin, JSON.stringify(rec)); } catch (e) {} }
        if (r.coin === this.coin) continue; // current coin is governed by the full on-page verdict
        if (r.conv < convMin) break; // sorted desc — bar self-tunes 74–84
        if (paused || !r.ok) continue;
        if (blockedSide && r.side === blockedSide) continue; // learned: this direction is on a losing streak
        if (breadth <= 0.42 && r.side === 'LONG') continue;  // red tape — no longs into a falling market (V4: was 35%, longs bled -$277 in RISK-OFF)
        if (breadth >= 0.62 && r.side === 'SHORT') continue; // green tape — no shorts into a rising market
        if (still.length >= 4 || still.filter((t) => t.src === 'scan').length >= 3) break; // fewer, better trades
        if (still.filter((t) => t.side === r.side).length >= 2) continue; // max 2 same-direction — no more six-longs-one-bet
        const dup = still.some((t) => t.coin === r.coin) || hist.some((h) => h.coin === r.coin && h.vT0 === rec.t0);
        const margin = Math.floor(w.bal * sizeF * 100) / 100; // size self-tunes 9–15% with rolling win rate
        if (dup || margin < 5) continue;
        const book = await this.bookCheck(r.coin, r.side); // read the L2 liquidity book before committing
        if (!book.ok) { bookNote = r.coin + ' skipped: ' + book.why; continue; }
        const dir = r.side === 'LONG' ? 1 : -1;
        // V2 brackets: stop = 1.3× the coin's real 4h ATR (outside noise), clamped 1.5–5%; target 1.8R
        const atr = await this.atrOf(r.coin);
        const stopD = Math.max(0.015, Math.min(0.05, atr * 1.3));
        const tgtD = stopD * 2.2; // V4: winners must also pay the ~$3/trade fee+slippage tax that ate half of V3's losses
        const lev = Math.min(5, this.levFor(r.coin)); // 5x cap — fees/funding scale with notional, and 10-40x paid the exchange first
        w.bal -= margin;
        still.push({ coin: r.coin, side: r.side, entry: r.mark, target: r.mark * (1 + tgtD * dir), stop: r.mark * (1 - stopD * dir), margin, lev, vT0: rec.t0, t0: now, src: 'scan', conv: r.conv, fr: r.fund, sp: r.sp, mom: r.mom, v: 4 });
        changed = true;
      }
      // ---- V5 parallel book: same sweep, band-pass filter + risk-based sizing on its own $2,000 wallet ----
      try {
        const g5 = this.paperLoad('5');
        const w5 = g5.w, hist5 = g5.hist;
        const still5 = g5.open.slice();
        let ch5 = false;
        for (const r of rows) {
          if (r.coin === this.coin) continue;        // page verdict governs this coin
          if (r.conv < 75 || r.conv > 84) continue;  // V5 band-pass: 75–84% only (V4's 47%-WR band; ≥85% = crowded)
          if (!r.ok) continue;                       // inherit every V4 hard gate (spread, volume, smart-$, trend, bans)
          if (breadth <= 0.42 && r.side === 'LONG') continue;
          if (breadth >= 0.62 && r.side === 'SHORT') continue;
          if (!this.v5Gate(still5, hist5, r.coin, r.side)) continue;
          let rec5 = null; try { rec5 = JSON.parse(localStorage.getItem('hlg_bgrec_' + r.coin)); } catch (e) {}
          const vT05 = rec5 && rec5.side === r.side ? rec5.t0 : now;
          if (hist5.some((h) => h.coin === r.coin && h.vT0 === vT05)) continue;
          const book5 = await this.bookCheck(r.coin, r.side);
          if (!book5.ok) continue;
          const atr5 = await this.atrOf(r.coin);
          const bk5 = this.v5Brackets(r.coin, r.mark, r.side, atr5);
          const margin5 = this.v5Margin(w5, still5, bk5.stopD, bk5.lev);
          if (margin5 < 5 || margin5 > w5.bal) continue;
          w5.bal -= margin5;
          still5.push({ coin: r.coin, side: r.side, entry: r.mark, target: bk5.target, stop: bk5.stop, risk0: bk5.risk0, margin: margin5, lev: bk5.lev, vT0: vT05, t0: now, src: 'scan', conv: r.conv, fr: r.fund, sp: r.sp, mom: r.mom, v: 5 });
          ch5 = true;
        }
        if (ch5) this.paperSave5(w5, still5, hist5);
      } catch (e) {}
      if (changed) {
        try {
          localStorage.setItem('hlg_paper_wallet', JSON.stringify({ bal: +w.bal.toFixed(2) }));
          localStorage.setItem('hlg_paper_open', JSON.stringify(still));
        } catch (e) {}
      }
      try { localStorage.setItem('hlg_scan_info', JSON.stringify({ t: now, n: rows.length, top: rows.slice(0, 3), gates: { convMin, spCap, smMin, hungerH: Math.round(hungerH * 10) / 10, blockedSide, recNet: Math.round(recNet * 100) / 100, bans: Object.keys(rules.bans), breadth: Math.round(breadth * 100), regime, sizeF, bookNote } })); } catch (e) {}
      this.forceUpdate();
    } catch (e) {}
  }

  // ---- real 4h ATR per coin (candleSnapshot), cached 30 min — sizes stops to each coin's actual noise ----
  async atrOf(coin) {
    this.atrCache = this.atrCache || {};
    const c = this.atrCache[coin];
    if (c && Date.now() - c.t < 1800e3) return c.v;
    let v = 0.02;
    try {
      const end = Date.now(), start = end - 15 * 4 * 3600e3;
      const ks = await fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'candleSnapshot', req: { coin, interval: '4h', startTime: start, endTime: end } }) }).then((r) => r.json());
      if (Array.isArray(ks) && ks.length > 3) {
        let s = 0, nn = 0, prevC = null;
        ks.forEach((k) => {
          const h = +k.h, l = +k.l, cl = +k.c; if (!(h > 0 && l > 0 && cl > 0)) return;
          const tr = prevC ? Math.max(h - l, Math.abs(h - prevC), Math.abs(l - prevC)) : h - l;
          s += tr / cl; nn++; prevC = cl;
        });
        if (nn > 0) v = s / nn;
      }
    } catch (e) {}
    v = Math.max(0.008, Math.min(0.08, v));
    this.atrCache[coin] = { t: Date.now(), v };
    return v;
  }

  // ---- realistic execution costs (Hyperliquid fee schedule) ----
  // taker fee 0.045%/side + real impact-price spread for slippage + funding on hold time
  spreadOf(ctx, mark) {
    try {
      const b = parseFloat(ctx.impactPxs[0]), a = parseFloat(ctx.impactPxs[1]);
      if (a > b && b > 0 && mark > 0) return Math.max(0.0002, Math.min(0.006, (a - b) / mark));
    } catch (e) {}
    return 0.0006;
  }
  estCosts(t, outcome, tEnd) {
    const lev = t.lev || 10, notional = (t.margin || 0) * lev;
    const fees = notional * 0.00045 * 2;
    const half = t.sp != null ? t.sp / 2 : 0.0003; // half-spread per market crossing (real impactPxs when stored)
    const slip = notional * (half + ((outcome && outcome !== 'tp') ? half : 0)); // any non-TP exit crosses the spread at market
    const t0 = t.t0 || t.ot || tEnd || Date.now();
    const hours = Math.max(0, Math.min(24 * 14, ((tEnd || Date.now()) - t0) / 3600e3));
    const fund = notional * (t.fr != null ? t.fr : 0.0000125) * hours * (t.side === 'LONG' ? 1 : -1);
    return { fees, slip, fund, total: fees + slip + fund };
  }

  // ---- cross-venue funding hedge scanner (real rates: HL predicted-funding feed covers HL/Binance/Bybit; + dYdX indexer + Paradex) ----
  // bps = base TAKER fee per fill. iv = funding interval. pay = how that venue settles funding.
  // Funding is peer-to-peer long↔short on all six — no venue takes a cut of the carry itself.
  hedgeVenueMeta(v) {
    return ({
      HYPERLIQUID: { bps: 4.5, mkr: 1.5, iv: '1h', pay: 'Hourly settlement. Feed quotes an 8h-style rate; we divide by fundingIntervalHours to get true hourly.', url: (s) => 'https://app.hyperliquid.xyz/trade/' + s },
      DYDX: { bps: 5.0, mkr: 2.0, iv: '1h', pay: 'Hourly settlement against the index. nextFundingRate is already per-hour — used as-is.', url: (s) => 'https://dydx.trade/trade/' + s },
      PARADEX: { bps: 3.0, mkr: 0.5, iv: '8h', pay: 'Accrues continuously, quoted on an 8h basis. We divide by 8 to normalise to hourly.', url: (s) => 'https://app.paradex.trade/trade/' + s },
      PACIFICA: { bps: 5.0, mkr: 1.5, iv: '1h', pay: 'Hourly settlement. Feed returns the hourly rate directly.', url: (s) => 'https://app.pacifica.fi/trade/' + s },
      ETHEREAL: { bps: 3.0, mkr: 0.5, iv: '1h', pay: 'Hourly settlement. fundingRate1h is already hourly; OI arrives in base units and is converted to USD.', url: (s) => 'https://app.ethereal.trade/trade/' + s },
      LIGHTER: { bps: 3.0, mkr: -0.5, iv: '1h', pay: 'Hourly settlement, maker side earns a rebate. Feed mirrors CEX rates too — we keep only exchange="lighter".', url: (s) => 'https://app.lighter.xyz/trade/' + s },
      ORDERLY: { bps: 3.0, mkr: 0.3, iv: '8h', pay: 'Settles on the 8h boundary. est_funding_rate is the 8h figure — divided by 8 for the hourly carry.', url: (s) => 'https://app.orderly.network/perp/' + s },
      HL_XYZ: { bps: 5.0, mkr: 1.5, iv: '1h', pay: 'HIP-3 builder dex on Hyperliquid: equities, metals, FX and indices. Hourly settlement, same funding mechanics as the main book.', url: (s) => 'https://app.hyperliquid.xyz/trade/' + s },
      // These three block cross-origin browser calls, so they arrive via /api/rates on our own server,
      // which faces no such restriction. It normalises to an hourly rate and USD open interest.
      ASTER: { bps: 3.5, mkr: 1.0, iv: '1h', proxied: true, pay: 'Hourly settlement. Blocks browser calls, so rates arrive through our own /api/rates relay.', url: (s) => 'https://www.asterdex.com/en/futures/' + s },
      BACKPACK: { bps: 4.0, mkr: 1.0, iv: '1h', proxied: true, pay: 'Hourly settlement. Blocks browser calls, so rates arrive through our own /api/rates relay.', url: (s) => 'https://backpack.exchange/trade/' + s },
      EXTENDED: { bps: 5.0, mkr: 1.5, iv: '1h', proxied: true, pay: 'Hourly settlement. Blocks browser calls, so rates arrive through our own /api/rates relay.', url: (s) => 'https://app.extended.exchange/trade/' + s },
    })[v] || { bps: 5, mkr: 2, iv: '1h', pay: 'unknown', url: () => '#' };
  }

  // ---- spread history: persisted so the chart survives reloads and builds real multi-hour context ----
  hzSerLoad() {
    if (this.hzSeries) return this.hzSeries;
    const s = {};
    try {
      const raw = JSON.parse(localStorage.getItem('hlg_hz_series'));
      const cut = Date.now() - 36 * 36e5;
      if (raw && typeof raw === 'object') Object.keys(raw).forEach((c) => {
        if (!Array.isArray(raw[c])) return;
        const a = raw[c].map((p) => ({ t: +p[0], apr: +p[1] })).filter((p) => p.t > cut && isFinite(p.apr));
        if (a.length) s[c] = a;
      });
    } catch (e) {}
    this.hzSeries = s;
    return s;
  }
  hzSerSave() {
    try {
      const s = this.hzSeries || {}; const out = {};
      Object.keys(s).slice(0, 44).forEach((c) => { out[c] = s[c].slice(-200).map((p) => [p.t, +p.apr.toFixed(2)]); });
      localStorage.setItem('hlg_hz_series', JSON.stringify(out));
    } catch (e) {}
  }
  HZ_RANGES = [['15M', 9e5], ['1H', 36e5], ['6H', 216e5], ['ALL', Infinity]];
  hzRange() { const r = this.state && this.state.hzRange; return r || '1H'; }
  hzCMove = (e) => {
    const w = this._hzWin, vb = this._hzVB;
    if (!w || w.length < 2 || !vb) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width) return;
    const frac = Math.max(0, Math.min(1, ((e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0)) - r.left) / r.width));
    const rel = (frac * vb.w - vb.pL) / vb.plotW;
    const i = Math.max(0, Math.min(w.length - 1, Math.round(rel * (w.length - 1))));
    if (this.state.hzHov !== i) this.setState({ hzHov: i });
  };
  hzKMove = (e) => {
    const cnt = this._hzCN, vb = this._hzCVB;
    if (!cnt || cnt < 2 || !vb) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width) return;
    const frac = Math.max(0, Math.min(1, ((e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0)) - r.left) / r.width));
    const rel = (frac * vb.w - vb.p) / Math.max(1, vb.w - vb.p * 2);
    const i = Math.max(0, Math.min(cnt - 1, Math.round(rel * (cnt - 1))));
    if (this.state.hzCH !== i) this.setState({ hzCH: i });
  };
  hzKLeave = () => { if (this.state && this.state.hzCH != null) this.setState({ hzCH: null }); };
  hzCLeave = () => { if (this.state && this.state.hzHov != null) this.setState({ hzHov: null }); };

  // ---- venue marks: pulled live from each DEX's own favicon, never redrawn ----
  // Art goes on as a background-image, never as <img src="{{ hole }}">: the streaming parser puts
  // the raw attribute into live DOM before values resolve and the browser eagerly fetches the
  // literal "{{ ... }}" text. An unresolved style attribute is just invalid CSS — no request.
  icoBg(url, o) {
    if (!url) return 'display:none;';
    o = o || {};
    return 'position:absolute; inset:' + (o.inset || '0') + '; background-image:url("' + url + '"); background-size:' + (o.fit || 'contain') + '; background-position:center; background-repeat:no-repeat;' + (o.round ? ' border-radius:50%;' : '');
  }
  venueIcon(v) {
    const d = ({ HYPERLIQUID: 'hyperliquid.xyz', DYDX: 'dydx.trade', PARADEX: 'paradex.trade', PACIFICA: 'pacifica.fi', ETHEREAL: 'ethereal.trade', LIGHTER: 'lighter.xyz', ORDERLY: 'orderly.network', HL_XYZ: 'hyperliquid.xyz', ASTER: 'asterdex.com', BACKPACK: 'backpack.exchange', EXTENDED: 'extended.exchange' })[v];
    return d ? 'https://www.google.com/s2/favicons?domain=' + d + '&sz=64' : '';
  }

  // ---- OI gate: a pair is only as liquid as its THINNER leg ----
  hedgeMinOi() { return this.hedgeModeMeta(this.hedgeMode()).gate; }

  // The whole DEX perp board. Eight feeds are browser-reachable; the rest are listed with an honest
  // FEED UNAVAILABLE rather than quietly dropped, so the venue count on screen matches reality.
  VENUES = ['HYPERLIQUID', 'HL_XYZ', 'DYDX', 'PARADEX', 'PACIFICA', 'ETHEREAL', 'LIGHTER', 'ORDERLY', 'ASTER', 'BACKPACK', 'EXTENDED'];
  // Dropped: VARIATIONAL (no public rate feed at all), GMX and GMX_AVAX (funding is computed on-chain,
  // there is no rate endpoint to read). Listing a venue that can never produce a number is just noise.

  // ---- asset class: not everything on a perp DEX is a coin ----
  // Tokenised equities, indices, metals and FX all trade as perps, but their fair value comes from a
  // cash market that CLOSES. Classifying them is what lets the basis rules stay honest.
  ASSET_CLASSES = ['CRYPTO', 'STOCK', 'INDEX', 'COMMOD', 'FX'];
  assetClassMeta(k) {
    return ({
      CRYPTO: { lbl: 'CRYPTO', short: 'CRYPTO', col: '#97FCE4', sens: false, desc: 'Native perps. Both legs quote 24/7 — funding is the only clock that matters.' },
      STOCK:  { lbl: 'SINGLE-NAME EQUITY', short: 'STOCK', col: '#8FC0F0', sens: true, desc: 'Tokenised stock perps. The basis is only honest while the US cash market is open; after the bell both legs mark off a stale reference.' },
      INDEX:  { lbl: 'INDEX', short: 'INDEX', col: '#B9A2F0', sens: true, desc: 'Index perps (SPX / NDX class). Tracks a cash index that stops printing at the close.' },
      COMMOD: { lbl: 'METALS & ENERGY', short: 'COMMOD', col: '#F2B33D', sens: true, desc: 'Gold, silver, crude. Nearly 24/5, but real depth follows the London and New York sessions.' },
      FX:     { lbl: 'CURRENCY', short: 'FX', col: '#7FD8C0', sens: true, desc: 'Currency perps. Deep 24/5 and thin over the weekend — spreads gap at the Sunday open.' },
    })[k] || { lbl: 'CRYPTO', short: 'CRYPTO', col: '#97FCE4', sens: false, desc: '' };
  }
  assetClassOf(coin) {
    const c = String(coin || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(PERP|USDT|USDC|USD)$/, '');
    if (!this._acMap) {
      const m = {}; const put = (k, list) => list.forEach((s) => { m[s] = k; });
      put('STOCK', ['AAPL','TSLA','NVDA','MSFT','AMZN','GOOGL','GOOG','META','MSTR','COIN','HOOD','PLTR','AMD','NFLX','GME','AMC','BABA','INTC','SMCI','ORCL','CRCL','RDDT','MCD','DIS','JPM','WMT','XOM','LLY','AVGO','ASML','TSM','UBER','ABNB','SHOP','PYPL','RIVN','LCID','NIO','MARA','RIOT','CLSK','BMNR','SBET','DJT','BRKB','COST','KO','PEP','CRM','ADBE','QCOM','MU','ARM','DELL','GS','MS','BAC']);
      put('INDEX', ['SPX','SPX500','US500','SP500','SPY','QQQ','NDX','NAS100','US100','XYZ100','DJI','US30','RUT','RUSSELL','IWM','VIX','VOL','DAX','GER40','NIKKEI','JP225','FTSE','UK100','HSI','KR200','KOSPI','NIFTY','IBOV','EWY','EWJ','EWZ','EWT','XLE','XLF','XLK','SMH','SOXL','TQQQ']);
      put('COMMOD', ['XAU','GOLD','XAG','SILVER','XPT','PLATINUM','XPD','PALLADIUM','COPPER','XCU','ALUMINIUM','ALUMINUM','URANIUM','URNM','WTI','OIL','CRUDE','CL','BRENT','BRENTOIL','NGAS','NATGAS','TTF','WHEAT','CORN','COCOA','COFFEE','SUGAR','PAXG']);
      put('FX', ['EUR','EURUSD','GBP','GBPUSD','JPY','USDJPY','AUD','AUDUSD','NZD','NZDUSD','CHF','USDCHF','CAD','USDCAD','MXN','USDMXN','CNH','USDCNH','KRW','SEK','NOK','TRY','BRL','INR','DXY']);
      this._acMap = m;
    }
    if (this._acMap[c]) return this._acMap[c];
    // Venue as evidence: anything the RWA dex lists is session-sensitive even when the ticker is one we
    // have never seen (SNDK, CXMT, IBIDEN, GIGADEV…). The lists above only refine the sub-class; they are
    // not what decides whether the cash-session gate applies. Default to STOCK — the strictest RWA class.
    const raw = String(coin || '').toUpperCase();
    if (this.rwaSyms && (this.rwaSyms.has(c) || this.rwaSyms.has(raw))) return 'STOCK';
    return 'CRYPTO';
  }

  // ---- the US cash session, in real Eastern time (DST handled by the platform, not by hand) ----
  usSession() {
    const now = Date.now();
    if (this._usS && now - this._usS.at < 20000) return this._usS.v;
    let v;
    try {
      const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date(now));
      const g = (t) => (p.find((x) => x.type === t) || {}).value;
      const wd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday'));
      const mins = (+g('hour') % 24) * 60 + (+g('minute'));
      const weekday = wd >= 1 && wd <= 5;
      const open = weekday && mins >= 570 && mins < 960;   // 09:30 → 16:00 ET
      const pre = weekday && mins >= 240 && mins < 570;
      const post = weekday && mins >= 960 && mins < 1200;
      v = { open, pre, post, weekend: !weekday, mins,
        state: open ? 'OPEN' : pre ? 'PRE' : post ? 'AFTER' : !weekday ? 'WEEKEND' : 'CLOSED',
        left: open ? 960 - mins : pre ? 570 - mins : null };
    } catch (e) { v = { open: true, state: 'OPEN', left: null, weekend: false }; }
    this._usS = { at: now, v };
    return v;
  }

  // ---- liquidity tiers: leverage and allocation scale with the depth of the THINNER leg ----
  TIER_ORDER = ['CORE', 'MAJOR', 'ALT', 'THIN'];
  TIER_BASIS = { CORE: 0.003, MAJOR: 0.008, ALT: 0.02, THIN: 0.08 };
  hedgeTier(oiMin, basis) {
    let t = 'THIN';
    if (oiMin != null) t = oiMin >= 25e6 ? 'CORE' : oiMin >= 5e6 ? 'MAJOR' : oiMin >= 250e3 ? 'ALT' : 'THIN';
    // cross-venue price disagreement is UNHEDGED delta that eats margin directly.
    // 8% basis is survivable at 3x and lethal at 8x — so demote until the tier's leverage can take it.
    if (basis != null && isFinite(basis)) {
      let i = this.TIER_ORDER.indexOf(t);
      while (i < this.TIER_ORDER.length - 1 && basis > this.TIER_BASIS[this.TIER_ORDER[i]]) i++;
      t = this.TIER_ORDER[i];
    }
    return t;
  }
  hedgeTierFor(o) {
    let t = this.hedgeTier(o.oiMin, o.basis);
    // mismatched settlement cadence: one leg has already paid this interval, the other has not.
    // Noise at 3x, real money at 8x — CORE leverage is not earned on a mismatched pair.
    if (t === 'CORE' && o.long && o.short && this.hedgeVenueMeta(o.long.v).iv !== this.hedgeVenueMeta(o.short.v).iv) t = 'MAJOR';
    // RWA with the bell shut: the underlying has no live print, so both legs mark off a stale reference
    // and the spread on screen is not the spread you fill. Never a CORE/MAJOR-leverage trade after hours.
    if (this.assetClassMeta(this.assetClassOf(o.coin)).sens && !this.usSession().open && this.TIER_ORDER.indexOf(t) < 2) t = 'ALT';
    return t;
  }
  hedgeTierMeta(t) {
    return ({
      CORE:  { lev: 8, alloc: 0.20, col: '#3FE0A0', floor: '$25M+', desc: 'BTC / ETH / SOL class — deep on both legs, tight basis, exits instantly' },
      MAJOR: { lev: 6, alloc: 0.15, col: '#97FCE4', floor: '$5M+',  desc: 'HYPE / AAVE / LINK / LTC class — real book, spreads persist for hours' },
      ALT:   { lev: 4, alloc: 0.10, col: '#8FC0F0', floor: '$250K+', desc: 'Liquid alts — tradeable size, wider basis, watch the exit' },
      THIN:  { lev: 3, alloc: 0.06, col: '#F2B33D', floor: '<$250K', desc: 'Memecoins and micro-books — huge APR, you are the market, satellite size only' },
    })[t] || { lev: 3, alloc: 0.06, col: '#F2B33D', floor: '—', desc: '' };
  }

  // ---- risk modes: one pick sets depth gate, leverage cap, sizing and how slots are filled ----
  hedgeMode() { try { const v = localStorage.getItem('hlg_hedge_mode'); return (v === 'DEGEN' || v === 'SAFE' || v === 'BALANCED') ? v : 'BALANCED'; } catch (e) { return 'BALANCED'; } }
  hedgeSetMode(m) { try { localStorage.setItem('hlg_hedge_mode', m); } catch (e) {} this.forceUpdate(); }
  hedgeModeMeta(m) {
    return ({
      DEGEN: {
        lbl: 'DEGEN', tag: 'MAX APR · ANY DEPTH', col: '#FF6B7A', bg: 'rgba(255,107,122,.09)', bd: 'rgba(255,107,122,.34)',
        minApr: 400, maxSlots: 4, levCap: 4, gate: 0, tiers: ['THIN', 'ALT', 'MAJOR', 'CORE'], basket: null,
        desc: 'Takes the fattest spread on the board no matter how thin the book. Leverage is still capped at 4× — thin book plus high leverage is how accounts actually die.',
        risk: 'HIGH', riskCol: '#FF6B7A',
      },
      BALANCED: {
        lbl: 'BALANCED', tag: 'REAL BOOKS · SOLID APR', col: '#97FCE4', bg: 'rgba(151,252,228,.08)', bd: 'rgba(151,252,228,.34)',
        minApr: 120, maxSlots: 3, levCap: 6, gate: 250000, tiers: ['ALT', 'MAJOR', 'CORE'], basket: null,
        desc: 'Both legs must have a book you can exit into. Lower headline APR than degen, but the spreads persist long enough to actually clear the fee drag.',
        risk: 'MEDIUM', riskCol: '#F2B33D',
      },
      SAFE: {
        lbl: 'SAFE BASKET', tag: 'DIVERSIFIED · TIERED', col: '#3FE0A0', bg: 'rgba(63,224,160,.08)', bd: 'rgba(63,224,160,.34)',
        minApr: 25, maxSlots: 4, levCap: 8, gate: 0, tiers: ['CORE', 'MAJOR', 'ALT', 'THIN'], basket: { CORE: 2, MAJOR: 1, THIN: 1 },
        desc: 'Builds a portfolio instead of chasing one number: two deep majors carrying most of the capital at higher leverage, one liquid alt, and one small thin satellite for upside. Each slot sized to its own tier.',
        risk: 'LOW', riskCol: '#3FE0A0',
      },
    })[m] || this.hedgeModeMeta('BALANCED');
  }

  hedgeLoad() {
    const g = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
    return { hOpen: g('hlg_hedge_open', []) || [], hHist: g('hlg_hedge_hist', []) || [] };
  }
  hedgeThr() { try { const v = +localStorage.getItem('hlg_hedge_min'); return v > 0 ? v : 1600; } catch (e) { return 1600; } }
  hedgeSave(open, hist) {
    try {
      localStorage.setItem('hlg_hedge_open', JSON.stringify(open));
      if (hist) localStorage.setItem('hlg_hedge_hist', JSON.stringify(hist.slice(0, 300)));
    } catch (e) {}
  }

  // ---- hedge bank: hedging runs on its OWN $2,000 — never touches the trading balance ----
  hedgeWallet() {
    let hw = null; try { hw = JSON.parse(localStorage.getItem('hlg_hedge_wallet')); } catch (e) {}
    if (!hw || !(hw.bal >= 0)) {
      const { hOpen } = this.hedgeLoad();
      const locked = hOpen.reduce((s, x) => s + (x.legMargin || 0) * 2, 0);
      hw = { bal: Math.max(0, +(2000 - locked).toFixed(2)) };
      if (locked > 0) { // one-time migration: refund margin the old hedges took from the trading wallet
        try { const w = JSON.parse(localStorage.getItem('hlg_paper_wallet')) || { bal: 2000 }; w.bal = +(w.bal + locked).toFixed(2); localStorage.setItem('hlg_paper_wallet', JSON.stringify(w)); } catch (e) {}
      }
      try { localStorage.setItem('hlg_hedge_wallet', JSON.stringify(hw)); } catch (e) {}
    }
    return hw;
  }
  hedgeWalletSave(hw) { try { localStorage.setItem('hlg_hedge_wallet', JSON.stringify({ bal: +hw.bal.toFixed(2) })); } catch (e) {} }

  // ---- bot memory: every close is written down; failures become rules the scanner obeys ----
  memLesson(outcome, pnl, hrs) {
    if (pnl >= 0) return outcome === 'tp' ? 'worked — pattern reinforced' : outcome === 'tp1' ? 'ladder banked half at +1.2R — trade paid for itself' : outcome === 'rat' ? 'ratchet stop locked the move in as profit' : 'saved by exit management';
    return outcome === 'sl' ? 'stopped out in ' + (hrs != null ? hrs + 'h' : 'hours') + ' → 2 stop-outs on a coin in 7d = 3-day coin ban'
      : outcome === 'flip' ? 'signal flipped against entry — the conviction was fragile'
      : outcome === 'time' ? 'went nowhere for 36h — tied up a slot for nothing'
      : outcome === 'be' ? 'gave back +1R to costs after the breakeven stop'
      : 'closed at a loss';
  }
  memLoad() {
    try {
      let m = JSON.parse(localStorage.getItem('hlg_memory'));
      if (!Array.isArray(m)) { // seed once from existing history so past mistakes count from day one
        const hist = JSON.parse(localStorage.getItem('hlg_paper_hist')) || [];
        m = hist.map((h) => { const hrs = h.ot ? Math.round((h.t - h.ot) / 36e5 * 10) / 10 : null; const p = h.pnlNet != null ? h.pnlNet : (h.pnl || 0); return { t: h.t, coin: h.coin, side: h.side, outcome: h.outcome, pnl: p, conv: h.conv || null, sp: h.sp || null, src: h.src || 'page', hrs, bad: p < 0, lesson: this.memLesson(h.outcome, p, hrs) }; });
        localStorage.setItem('hlg_memory', JSON.stringify(m.slice(0, 120)));
      }
      return m;
    } catch (e) { return []; }
  }
  memAdd(t, outcome, pnlNet) {
    try {
      const mem = this.memLoad();
      const hrs = Math.round((Date.now() - (t.t0 || Date.now())) / 36e5 * 10) / 10;
      mem.unshift({ t: Date.now(), coin: t.coin, side: t.side, outcome, pnl: +pnlNet.toFixed(2), conv: t.conv || null, sp: t.sp || null, mom: t.mom != null ? t.mom : null, src: t.src || 'page', hrs, bad: pnlNet < 0, lesson: this.memLesson(outcome, pnlNet, hrs) });
      localStorage.setItem('hlg_memory', JSON.stringify(mem.slice(0, 120)));
    } catch (e) {}
  }
  memRules(now) {
    const mem = this.memLoad();
    const bans = {}; const bySl = {};
    mem.forEach((m) => { if ((m.pnl || 0) < 0 && now - m.t < 7 * 864e5) (bySl[m.coin] = bySl[m.coin] || []).push(m.t); }); // V4: ANY 2 losses ban (sl-only never fired — scanner rarely repeats a coin)
    Object.keys(bySl).forEach((c) => { if (bySl[c].length >= 2) { const until = Math.max.apply(null, bySl[c]) + 3 * 864e5; if (until > now) bans[c] = until; } });
    const wide = mem.filter((m) => m.sp > 0.0008);
    const wideLoses = wide.length >= 5 && wide.reduce((s, m) => s + (m.pnl || 0), 0) < 0;
    // V4 conviction-band attribution: find the LOWEST conviction level ≥80 whose bucket (n≥8) lost money
    // at a sub-40% win rate — everything at or above it is a crowded trade the ledger says to skip.
    let hotConv = 0; const convStats = [];
    [[86, '86+'], [82, '82-85'], [78, '78-81'], [70, '70-77']].forEach(([lo, label]) => {
      const hi = lo === 86 ? 200 : lo + 4;
      const b = mem.filter((m) => m.conv >= lo && m.conv < hi);
      const w2 = b.filter((m) => (m.pnl || 0) > 0).length;
      const net = b.reduce((s, m) => s + (m.pnl || 0), 0);
      convStats.push({ label, n: b.length, w: w2, net: +net.toFixed(0) });
      if (lo >= 80 && b.length >= 8 && net < 0 && w2 / b.length < 0.4) hotConv = lo;
    });
    // V4 momentum attribution: entries that chased an aligned extended move (mom ≥ 0.6)
    const chased = mem.filter((m) => m.mom != null && m.mom >= 0.6);
    const momChase = chased.length >= 8 && chased.reduce((s, m) => s + (m.pnl || 0), 0) < 0;
    return { bans, wideLoses, hotConv, momChase, convStats };
  }

  // ---- L2 liquidity book read before every entry: depth + wall imbalance (real order book) ----
  async bookCheck(coin, side) {
    try {
      const b = await fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'l2Book', coin }) }).then((r) => r.json());
      const lv = b && b.levels; if (!Array.isArray(lv) || !Array.isArray(lv[0]) || !lv[0].length || !lv[1].length) return { ok: true, why: 'book unavailable' };
      const mid = (parseFloat(lv[0][0].px) + parseFloat(lv[1][0].px)) / 2;
      const depth = (arr) => arr.filter((x) => Math.abs(parseFloat(x.px) / mid - 1) <= 0.005).reduce((s, x) => s + parseFloat(x.px) * parseFloat(x.sz), 0);
      const bid = depth(lv[0]), ask = depth(lv[1]);
      if (bid + ask < 30000) return { ok: false, why: 'book too thin (<$30k within ±0.5%)' };
      const ratio = side === 'LONG' ? ask / Math.max(1, bid) : bid / Math.max(1, ask);
      if (ratio > 2.5) return { ok: false, why: (ratio).toFixed(1) + '× wall stacked against entry' };
      return { ok: true };
    } catch (e) { return { ok: true, why: 'book fetch failed' }; }
  }

  async hedgeScan() {
    try {
      const now = Date.now();
      const nextHr = (Math.floor(now / 3600e3) + 1) * 3600e3;
      const out = await Promise.allSettled([
        fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":"predictedFundings"}' }).then((r) => r.json()),
        fetch('https://indexer.dydx.trade/v4/perpetualMarkets').then((r) => r.json()),
        fetch('https://api.prod.paradex.trade/v1/markets/summary?market=ALL').then((r) => r.json()),
        fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":"allMids"}' }).then((r) => r.json()),
        fetch('https://api.pacifica.fi/api/v1/info/prices').then((r) => r.json()),
        fetch('https://api.ethereal.trade/v1/product').then((r) => r.json()),
        fetch('https://mainnet.zklighter.elliot.ai/api/v1/orderBookDetails').then((r) => r.json()),
        fetch('https://mainnet.zklighter.elliot.ai/api/v1/funding-rates').then((r) => r.json()),
        fetch('https://api.orderly.org/v1/public/futures').then((r) => r.json()),
        // HL_XYZ: a HIP-3 builder-deployed dex on Hyperliquid — 100+ equity, metal, FX and index perps.
        // Same info endpoint, different `dex`. This is where the RWA side of the board actually lives.
        fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":"metaAndAssetCtxs","dex":"xyz"}' }).then((r) => r.json()),
        // Our own relay for the venues that refuse browser origins. Same-origin, so it only answers on the
        // deployed site; in a bare preview it 404s and those three simply stay dark. Never a hard failure.
        fetch('/api/rates').then((r) => r.json()),
      ]);
      const map = {}; // coin -> [{v, r: rate per HOUR, nft, px, oi(USD), sym}]
      const add = (coin, v, r, nft, px, oi, sym, oiB) => {
        if (!isFinite(r) || !coin || Math.abs(r) > 0.1) return; // |10%/hr|+ = data glitch
        (map[coin] = map[coin] || []).push({ v, r, nft, px: isFinite(px) ? px : null, oi: isFinite(oi) ? oi : null, oiB: isFinite(oiB) ? oiB : null, sym: sym || coin });
      };
      const hlSet = new Set();
      const mids = out[3].status === 'fulfilled' && out[3].value ? out[3].value : {};
      if (out[0].status === 'fulfilled' && Array.isArray(out[0].value)) {
        out[0].value.forEach((e) => { if (Array.isArray(e) && e[0]) hlSet.add(e[0]); });
        out[0].value.forEach((e) => {
          (e[1] || []).forEach((pv) => {
            if (pv[0] !== 'HlPerp' || !pv[1]) return; // DEX only — CEX feeds ignored
            const iv = +pv[1].fundingIntervalHours || 1;
            add(e[0], 'HYPERLIQUID', parseFloat(pv[1].fundingRate) / iv, +pv[1].nextFundingTime || null, parseFloat(mids[e[0]]), null, e[0]);
          });
        });
      }
      const norm = (c) => {
        if (hlSet.has(c)) return c;
        if (hlSet.has('k' + c)) return 'k' + c;
        const m = c.match(/^10{2,8}(.+)$/);
        if (m && hlSet.has('k' + m[1])) return 'k' + m[1];
        return c;
      };
      if (out[1].status === 'fulfilled' && out[1].value && out[1].value.markets) {
        Object.values(out[1].value.markets).forEach((mk) => {
          if (mk.status && mk.status !== 'ACTIVE') return;
          const px = parseFloat(mk.oraclePrice);
          add(norm(String(mk.ticker || '').replace(/-USD$/, '')), 'DYDX', parseFloat(mk.nextFundingRate), nextHr, px, parseFloat(mk.openInterest) * px, mk.ticker);
        });
      }
      if (out[2].status === 'fulfilled' && out[2].value && Array.isArray(out[2].value.results)) {
        out[2].value.results.forEach((mk) => {
          if (!/-USD-PERP$/.test(mk.symbol || '')) return;
          const px = parseFloat(mk.mark_price);
          add(norm(mk.symbol.replace(/-USD-PERP$/, '')), 'PARADEX', parseFloat(mk.funding_rate) / 8, null, px, parseFloat(mk.open_interest) * px, mk.symbol); // 8h basis, paid continuously
        });
      }
      if (out[4].status === 'fulfilled' && out[4].value && Array.isArray(out[4].value.data)) {
        out[4].value.data.forEach((d) => { // Pacifica settles hourly
          const px = parseFloat(d.mark);
          add(norm(String(d.symbol || '')), 'PACIFICA', parseFloat(d.funding), nextHr, px, parseFloat(d.open_interest) * px, d.symbol);
        });
      }
      if (out[5].status === 'fulfilled' && out[5].value && Array.isArray(out[5].value.data)) {
        out[5].value.data.forEach((d) => { // Ethereal: hourly rate, no mark px in feed
          if (d.status && d.status !== 'ACTIVE') return;
          add(norm(String(d.displayTicker || '').replace(/-USD$/, '')), 'ETHEREAL', parseFloat(d.fundingRate1h), nextHr, null, null, d.ticker, parseFloat(d.openInterest));
        });
      }
      if (out[6].status === 'fulfilled' && out[7].status === 'fulfilled' && out[6].value && out[7].value) {
        const obd = {};
        (out[6].value.order_book_details || []).forEach((d) => { obd[d.market_id] = d; });
        (out[7].value.funding_rates || []).forEach((f) => {
          if (f.exchange !== 'lighter') return; // feed also mirrors CEX rates — skip those
          const d = obd[f.market_id]; if (!d || (d.status && d.status !== 'active')) return;
          const px = parseFloat(d.last_trade_price);
          add(norm(String(f.symbol || '')), 'LIGHTER', parseFloat(f.rate), nextHr, px, parseFloat(d.open_interest) * px, f.symbol);
        });
      }
      if (out[8].status === 'fulfilled' && out[8].value && out[8].value.data && Array.isArray(out[8].value.data.rows)) {
        out[8].value.data.rows.forEach((d) => { // Orderly: 8h basis (est_funding_rate), settled on the 8h boundary
          if (d.status && d.status !== 'ACTIVE') return;
          const px = parseFloat(d.mark_price);
          const sym = d.display_symbol_name || String(d.symbol || '').replace(/^PERP_/, '').replace(/_USDC?$/, '');
          add(norm(String(sym)), 'ORDERLY', parseFloat(d.est_funding_rate) / 8, +d.next_funding_time || null, px, parseFloat(d.open_interest) * px, d.symbol);
        });
      }
      if (out[9].status === 'fulfilled' && Array.isArray(out[9].value) && out[9].value[0] && Array.isArray(out[9].value[1])) {
        const uni = out[9].value[0].universe || [], ctxs = out[9].value[1];
        // This dex is ENTIRELY real-world assets, so listing on it is proof of session-sensitivity —
        // stronger and more durable evidence than any hardcoded ticker list, which cannot keep up with
        // a venue that lists new equities weekly. The classifier reads this set.
        const rwa = new Set();
        uni.forEach((u, i) => {
          const c = ctxs[i]; if (!c) return;
          const px = parseFloat(c.markPx);
          const sym = String(u.name || '').replace(/^xyz:/, ''); // feed prefixes every market with the dex id
          const coin = norm(sym);
          // …unless the main Hyperliquid book lists the same symbol, which makes it a coin, not an RWA.
          if (!hlSet.has(coin)) { rwa.add(coin.toUpperCase()); rwa.add(sym.toUpperCase()); }
          add(coin, 'HL_XYZ', parseFloat(c.funding), nextHr, px, parseFloat(c.openInterest) * px, u.name);
        });
        if (rwa.size) this.rwaSyms = rwa;
      }
      if (out[10].status === 'fulfilled' && out[10].value && typeof out[10].value === 'object') {
        // Relay contract: { aster|backpack|extended: [{ sym, rate (per HOUR), px, oi (USD, null if unknown), nft }] }
        const P = out[10].value;
        [['ASTER', 'aster'], ['BACKPACK', 'backpack'], ['EXTENDED', 'extended']].forEach((pair) => {
          const rows = P[pair[1]];
          if (!Array.isArray(rows)) return;
          rows.forEach((d) => {
            const px = parseFloat(d.px);
            const oi = d.oi == null ? null : parseFloat(d.oi);
            add(norm(String(d.sym || '').toUpperCase()), pair[0], parseFloat(d.rate), +d.nft || nextHr, px, oi, d.sym);
          });
        });
      }
      Object.keys(map).forEach((coin) => { // fill missing px from siblings; base-unit OI → USD
        const pxv = (map[coin].find((x) => x.px != null) || {}).px;
        map[coin].forEach((x) => { if (x.px == null && pxv != null) x.px = pxv; if (x.oi == null && x.oiB != null && x.px != null) x.oi = x.oiB * x.px; });
      });
      // which venues actually returned usable rates this scan — the UI reports THIS, not a hardcoded count
      const vSeen = new Set(); Object.keys(map).forEach((c) => map[c].forEach((x) => vSeen.add(x.v)));
      this.venueUp = vSeen;
      const opps = [];
      Object.keys(map).forEach((coin) => {
        let vs = map[coin];
        const pxs = vs.filter((x) => x.px != null).map((x) => x.px).sort((a, b) => a - b);
        if (pxs.length > 1) { // same ticker ≠ same asset: drop venues whose price disagrees >8% with the median
          const med = pxs[Math.floor(pxs.length / 2)];
          vs = vs.filter((x) => x.px == null || Math.abs(x.px - med) / med < 0.08);
          map[coin] = vs;
        }
        if (vs.length < 2) return;
        let lo = vs[0], hi = vs[0];
        vs.forEach((x) => { if (x.r < lo.r) lo = x; if (x.r > hi.r) hi = x; });
        const spr = hi.r - lo.r;
        if (!(spr > 0)) return;
        const apr = spr * 24 * 365 * 100;
        if (apr < 15) return;
        // a hedge is only as deep as its THINNER leg — null OI counts as unknown, never as deep
        const oiL = lo.oi, oiS = hi.oi;
        const oiMin = (oiL == null || oiS == null) ? null : Math.min(oiL, oiS);
        const basis = (lo.px > 0 && hi.px > 0) ? Math.abs(hi.px - lo.px) / ((hi.px + lo.px) / 2) : null;
        opps.push({ coin, long: lo, short: hi, spr, apr, nV: vs.length, oiMin, oiL, oiS, basis });
      });
      opps.sort((a, b) => b.apr - a.apr);
      this.hedgeOpps = opps;
      this.hedgeMap = map;

      // ---- paper hedge bot: accrue carry, unwind flipped spreads, place new hedges ----
      const thr = this.hedgeModeMeta(this.hedgeMode()).minApr;
      const mm = this.hedgeModeMeta(this.hedgeMode()); // hoisted: the exit ladder below needs it inside the loop
      const hw = this.hedgeWallet(); // hedges run on their own $2,000 bank — never the trading balance
      const { hOpen, hHist } = this.hedgeLoad();
      let dirty = false;
      const still = [];
      hOpen.forEach((hd) => {
        const vs = map[hd.coin] || [];
        const lv = vs.find((x) => x.v === hd.lv), sv = vs.find((x) => x.v === hd.sv);
        const sprNow = (lv && sv) ? sv.r - lv.r : null;
        const dtH = Math.max(0, Math.min(24, (now - (hd.lastT || hd.t0)) / 3600e3));
        if (sprNow != null) {
          hd.accrued = +((hd.accrued || 0) + hd.notional * sprNow * dtH).toFixed(4);
          hd.sprApr = sprNow * 24 * 365 * 100;
        }
        hd.lastT = now;
        dirty = true;
        // ---- per-leg liquidation watch ----
        // The legs sit in SEPARATE margin accounts on separate venues. A losing leg can be
        // liquidated while its hedge holds an exactly offsetting profit in the other account —
        // there is no cross-margin to save it. Only added margin does.
        const advL = (lv && lv.px > 0 && hd.pxL > 0) ? Math.max(0, 1 - lv.px / hd.pxL) : 0; // long leg dies on the way down
        const advS = (sv && sv.px > 0 && hd.pxS > 0) ? Math.max(0, sv.px / hd.pxS - 1) : 0; // short leg dies on the way up
        const worst = Math.max(advL, advS);
        const eqM = hd.legMargin + (hd.topUp || 0);
        const liqD = eqM / Math.max(1e-6, hd.notional); // fractional adverse move that kills the at-risk leg
        hd.worst = +worst.toFixed(5);
        hd.liqD = +liqD.toFixed(5);
        hd.health = +Math.max(0, Math.min(1, 1 - worst / Math.max(1e-6, liqD))).toFixed(3);
        if (worst >= liqD) { // a leg is gone: its margin is lost, the surviving leg's comes back
          const pnl = +(hd.accrued - hd.fee - eqM).toFixed(2);
          hw.bal = +(hw.bal + hd.legMargin).toFixed(2);
          hHist.unshift({ ...hd, closed: now, pnl, why: 'LIQ' });
          return;
        }
        if (worst >= liqD * 0.5 && (hd.topUps || 0) < 3) { // halfway to liquidation → draw on the buffer
          const add = Math.min(hw.bal, +(hd.legMargin * 0.5).toFixed(2));
          if (add >= 1) {
            hw.bal = +(hw.bal - add).toFixed(2);
            hd.topUp = +((hd.topUp || 0) + add).toFixed(2);
            hd.topUps = (hd.topUps || 0) + 1;
            hd.topUpT = now;
          }
        }
        // ---- exit ladder: every way a hedge can stop being worth holding ends in the ledger ----
        // Before this, only a flip or a liquidation ever closed a position. A spread that decayed to
        // noise, blew its basis, or lost both feeds sat open forever — holding margin, earning nothing,
        // and never appearing in the closed ledger. Silent dead weight is worse than a logged small loss.
        const closeOut = (why) => {
          const pnl = +(hd.accrued - hd.fee).toFixed(2);
          hw.bal = +(hw.bal + hd.legMargin * 2 + (hd.topUp || 0) + pnl).toFixed(2);
          hHist.unshift({ ...hd, closed: now, pnl, why, cls: this.assetClassOf(hd.coin), aprEnd: hd.sprApr != null ? +hd.sprApr.toFixed(1) : null });
        };
        if (sprNow != null && sprNow <= 0) { closeOut('FLIPPED'); return; } // carry inverted — unwind both legs

        // Carry decayed to noise: still positive, but too small to ever repay the round trip.
        // Must HOLD for 30m — one thin print is not worth paying the exit fee twice.
        const deadApr = Math.max(8, mm.minApr * 0.15);
        if (sprNow != null) hd.lowT = hd.sprApr < deadApr ? (hd.lowT || now) : null;
        if (hd.lowT && now - hd.lowT >= 18e5) { closeOut('DECAYED'); return; }

        // Both feeds dark: no quotes means no accrual AND no liquidation watch. Flat is the only safe state.
        hd.dark = sprNow == null ? (hd.dark || now) : null;
        if (hd.dark && now - hd.dark >= 27e5) { closeOut('STALE'); return; }

        // The pair no longer earns this mode's leverage. A MISSING OI reading is NOT evidence of a thin
        // book: hedgeTier() defaults to THIN without one, which would unwind a healthy hedge over an
        // absent field and pay two exit fees for nothing. No depth reading → leave the position alone.
        if (lv && sv && lv.px > 0 && sv.px > 0 && hd.oiMin != null) {
          const basisNow = Math.abs(sv.px / lv.px - 1);
          const tierNow = this.hedgeTierFor({ coin: hd.coin, oiMin: hd.oiMin, basis: basisNow, long: { v: hd.lv }, short: { v: hd.sv } });
          if (mm.tiers.indexOf(tierNow) < 0) {
            // Name the ACTUAL trigger. Isolate each rule: depth alone, then basis alone against a deep
            // book. Assuming "basis blew out" was wrong in every real case — they were depth or a mode switch.
            const tDepth = this.hedgeTier(hd.oiMin, 0);
            const tBasis = this.hedgeTier(25e6, basisNow);
            const shut = this.assetClassMeta(this.assetClassOf(hd.coin)).sens && !this.usSession().open;
            const cadence = this.hedgeVenueMeta(hd.lv).iv !== this.hedgeVenueMeta(hd.sv).iv;
            const unchanged = hd.tier && tierNow === hd.tier;
            hd.tierNow = tierNow;
            hd.basisEnd = +(basisNow * 100).toFixed(2);
            hd.oiEnd = hd.oiMin;
            hd.modeEnd = mm.lbl;
            hd.trigger = unchanged ? 'MODE' : tBasis !== 'CORE' ? 'BASIS' : shut ? 'SESSION' : tDepth === tierNow ? 'DEPTH' : cadence ? 'CADENCE' : 'TIER';
            // A mode switch is the operator changing the rules, not the pair decaying — log it as its own reason.
            closeOut(hd.trigger === 'MODE' ? 'OFF-MODE' : 'DEMOTED');
            return;
          }
        }
        still.push(hd);
      });
      const tierCount = {}; still.forEach((h) => { const t = h.tier || 'THIN'; tierCount[t] = (tierCount[t] || 0) + 1; });
      for (const o of opps) { // sorted by APR desc — basket mode needs to keep scanning down, so never break on APR
        if (still.length >= mm.maxSlots) break;
        if (o.apr < mm.minApr) continue;
        const tier = this.hedgeTierFor(o);
        if (mm.tiers.indexOf(tier) < 0) continue;
        if (mm.basket) { if ((tierCount[tier] || 0) >= (mm.basket[tier] || 0)) continue; } // basket: fill the tier quota, not the leaderboard
        else if (mm.gate > 0 && (o.oiMin == null || o.oiMin < mm.gate)) continue; // depth gate
        if (still.some((x) => x.coin === o.coin)) continue;
        if (hHist.some((x) => x.coin === o.coin && now - (x.closed || 0) < 3600e3)) continue; // 1h re-entry cooldown
        const tmeta = this.hedgeTierMeta(tier);
        const lev = Math.min(tmeta.lev, mm.levCap);
        const legMargin = Math.floor(hw.bal * tmeta.alloc * 100) / 100;
        if (legMargin < 5) continue;
        const notional = +(legMargin * lev).toFixed(2);
        hw.bal = +(hw.bal - legMargin * 2).toFixed(2);
        still.push({ coin: o.coin, lv: o.long.v, sv: o.short.v, legMargin, lev, tier, mode: mm.lbl, notional, fee: +(notional * ((this.hedgeVenueMeta(o.long.v).bps + this.hedgeVenueMeta(o.short.v).bps) * 2 + 12) / 10000).toFixed(2), t0: now, lastT: now, accrued: 0, sprApr: o.apr, apr0: o.apr, auto: true, oiMin: o.oiMin || null, pxL: o.long.px || null, pxS: o.short.px || null });
        tierCount[tier] = (tierCount[tier] || 0) + 1;
        dirty = true;
      }
      if (dirty) {
        this.hedgeWalletSave(hw);
        this.hedgeSave(still, hHist);
      }
      const ser = this.hzSerLoad();
      const om = {}; opps.forEach((x) => { om[x.coin] = x; });
      const wantSer = new Set(opps.slice(0, 30).map((x) => x.coin));
      still.forEach((h) => wantSer.add(h.coin));
      if (this.state && this.state.hzDetail) wantSer.add(this.state.hzDetail);
      wantSer.forEach((c) => { const oo = om[c]; if (!oo) return; const a = ser[c] = ser[c] || []; a.push({ t: now, apr: oo.apr }); if (a.length > 400) a.splice(0, a.length - 400); });
      this.hzSerSave();
      this.hedgeInfo = { t: now, coins: Object.keys(map).length, above: opps.filter((x) => x.apr >= thr).length, venues: vSeen.size }; // same set that drives venueUp, so the header and this line cannot drift apart
      this.forceUpdate();
    } catch (e) { this.hedgeInfo = { t: Date.now(), coins: 0, above: 0, venues: 0, err: true }; }
  }

  hedgePlace(o) {
    const now = Date.now();
    const hw = this.hedgeWallet();
    const { hOpen } = this.hedgeLoad();
    const mm = this.hedgeModeMeta(this.hedgeMode());
    if (hOpen.length >= mm.maxSlots || hOpen.some((x) => x.coin === o.coin)) return;
    const tier = this.hedgeTierFor(o);
    const tmeta = this.hedgeTierMeta(tier);
    const lev = Math.min(tmeta.lev, mm.levCap);
    const legMargin = Math.floor(hw.bal * tmeta.alloc * 100) / 100;
    if (legMargin < 5) return;
    const notional = +(legMargin * lev).toFixed(2);
    hw.bal = +(hw.bal - legMargin * 2).toFixed(2);
    hOpen.push({ coin: o.coin, lv: o.long.v, sv: o.short.v, legMargin, lev, tier, mode: mm.lbl, notional, fee: +(notional * ((this.hedgeVenueMeta(o.long.v).bps + this.hedgeVenueMeta(o.short.v).bps) * 2 + 12) / 10000).toFixed(2), t0: now, lastT: now, accrued: 0, sprApr: o.apr, apr0: o.apr, auto: false, oiMin: o.oiMin || null, pxL: o.long.px || null, pxS: o.short.px || null });
    this.hedgeWalletSave(hw);
    this.hedgeSave(hOpen, null);
    this.forceUpdate();
  }

  hedgeClose(t0) {
    const now = Date.now();
    const hw = this.hedgeWallet();
    const { hOpen, hHist } = this.hedgeLoad();
    const hd = hOpen.find((x) => x.t0 === t0); if (!hd) return;
    const sprHr = hd.sprApr != null ? hd.sprApr / (24 * 365 * 100) : 0;
    hd.accrued = +((hd.accrued || 0) + hd.notional * sprHr * Math.max(0, Math.min(24, (now - (hd.lastT || hd.t0)) / 3600e3))).toFixed(4);
    const pnl = +(hd.accrued - hd.fee).toFixed(2);
    hw.bal = +(hw.bal + hd.legMargin * 2 + (hd.topUp || 0) + pnl).toFixed(2);
    hHist.unshift({ ...hd, closed: now, pnl, why: 'MANUAL', cls: this.assetClassOf(hd.coin), aprEnd: hd.sprApr != null ? +hd.sprApr.toFixed(1) : null });
    this.hedgeWalletSave(hw);
    this.hedgeSave(hOpen.filter((x) => x.t0 !== t0), hHist);
    this.forceUpdate();
  }

  hedgeVals() {
    const G = '#3FE0A0', Rd = '#FF6B7A';
    const mm = this.hedgeModeMeta(this.hedgeMode());
    const thr = mm.minApr;
    const { hOpen, hHist } = this.hedgeLoad();
    // ---- FORMATTERS: all declared here, at the top, before ANY consumer ----
    // Three separate crashes this session came from a formatter being declared below its first use
    // (const has no hoisted value) or being swallowed by an edit to the block above it. Keeping the
    // whole set in one place at the top makes that failure mode structurally impossible.
    const money = (v) => (v < 0 ? '−$' : '+$') + Math.abs(v).toFixed(2);
    const aprS = (v) => (v >= 0 ? '+' : '−') + (Math.abs(v) >= 100 ? Math.abs(v).toFixed(0) : Math.abs(v).toFixed(1)) + '%';
    const fmtM = (v) => (v < 0 ? '−$' : '+$') + Math.abs(v).toFixed(2);
    const oiS = (v) => v == null ? 'NO OI' : v >= 1e9 ? '$' + (v / 1e9).toFixed(1) + 'B' : v >= 1e6 ? '$' + (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? '$' + Math.round(v / 1e3) + 'K' : '$' + Math.round(v);
    const oiLbl = (v) => v >= 1e6 ? '$' + (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + 'M' : v >= 1e3 ? '$' + Math.round(v / 1e3) + 'K' : '$' + v;
    const cd = (t) => { if (!t) return 'CONTINUOUS'; const s = Math.max(0, Math.round((t - Date.now()) / 1000)); const h = Math.floor(s / 3600), mn = Math.floor((s % 3600) / 60); return h > 0 ? h + 'H ' + mn + 'M' : mn + 'M ' + (s % 60) + 'S'; };
    const tmS = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const oppsAll = this.hedgeOpps || [];
    const minOi = mm.gate;
    const showThin = !!(this.state && this.state.hzShowThin);
    const tierOf = (o) => this.hedgeTierFor(o);
    const eligible = (o) => mm.tiers.indexOf(tierOf(o)) >= 0 && (mm.basket || minOi === 0 || (o.oiMin != null && o.oiMin >= minOi));
    const deepOf = (o) => eligible(o);
    const tierF = (this.state && this.state.hzTierF) || null;
    const sortK = (this.state && this.state.hzSort) || 'apr';
    const classF = (this.state && this.state.hzClassF) || null;
    const classOf = (o) => this.assetClassOf(o.coin);
    let opps = showThin ? oppsAll.slice() : oppsAll.filter(eligible);
    if (tierF) opps = opps.filter((o) => tierOf(o) === tierF);
    if (classF) opps = opps.filter((o) => classOf(o) === classF);
    if (sortK === 'oi') opps.sort((a, b) => (b.oiMin || 0) - (a.oiMin || 0));
    else if (sortK === 'tier') opps.sort((a, b) => (this.TIER_ORDER.indexOf(tierOf(a)) - this.TIER_ORDER.indexOf(tierOf(b))) || (b.apr - a.apr));
    else opps.sort((a, b) => b.apr - a.apr);
    const hzThinN = oppsAll.length - oppsAll.filter(eligible).length;

    // ---- risk-mode selector ----
    const curMode = this.hedgeMode();
    const hzModes = ['DEGEN', 'BALANCED', 'SAFE'].map((k) => {
      const m = this.hedgeModeMeta(k);
      const on = curMode === k;
      return {
        k, lbl: m.lbl, tag: m.tag, desc: m.desc, risk: m.risk, riskCol: m.riskCol,
        col: on ? m.col : '#7C9A91',
        bg: on ? m.bg : 'rgba(255,255,255,.02)',
        bd: on ? m.bd : 'rgba(151,252,228,.09)',
        dot: on ? m.col : 'transparent',
        dotBd: on ? m.col : 'rgba(151,252,228,.3)',
        minApr: '≥' + m.minApr + '%',
        lev: 'up to ' + m.levCap + '×',
        slots: m.maxSlots + ' slots',
        gate: m.basket ? 'tiered basket' : m.gate > 0 ? oiLbl(m.gate) + ' min OI' : 'no depth floor',
        set: () => this.hedgeSetMode(k),
      };
    });
    const hzMode = { lbl: mm.lbl, col: mm.col, desc: mm.desc, risk: mm.risk, riskCol: mm.riskCol, tag: mm.tag };

    // ---- liquidity tiers in play under this mode ----
    const tierCounts = {}; oppsAll.forEach((o) => { const t = tierOf(o); (tierCounts[t] = tierCounts[t] || []).push(o.apr); });
    const maxTierN = Math.max(1, ...['CORE', 'MAJOR', 'ALT', 'THIN'].map((t) => (tierCounts[t] || []).length));
    const hzTiers = ['CORE', 'MAJOR', 'ALT', 'THIN'].map((t) => {
      const tm = this.hedgeTierMeta(t);
      const list = (tierCounts[t] || []).slice().sort((a, b) => a - b);
      const med = list.length ? list[Math.floor(list.length / 2)] : 0;
      const active = mm.tiers.indexOf(t) >= 0;
      const quota = mm.basket ? (mm.basket[t] || 0) : null;
      return {
        t, col: active ? tm.col : '#44544f', floor: tm.floor, desc: tm.desc,
        lev: Math.min(tm.lev, mm.levCap) + '×',
        alloc: Math.round(tm.alloc * 100) + '%',
        n: list.length,
        med: med >= 100 ? med.toFixed(0) + '%' : med.toFixed(1) + '%',
        barW: Math.round((list.length / maxTierN) * 100) + '%',
        barBg: active ? tm.col : '#33403c',
        quota: quota == null ? (active ? 'eligible' : 'excluded') : quota > 0 ? quota + ' slot' + (quota > 1 ? 's' : '') : 'excluded',
        quotaCol: active && (quota == null || quota > 0) ? tm.col : '#5f7a72',
        op: active ? '1' : '.45',
      };
    });

    // ---- APR vs depth: the whole tradeoff in one picture, and every dot is live ----
    // Axis labels are HTML overlays positioned by percentage, not SVG <text>: this runtime does not
    // render text nodes inside a scaled viewBox reliably, and real text also stays crisp at any width.
    const sW = 900, sH = 300, pL = 10, pR = 10, pT = 12, pB = 10;
    const plW = sW - pL - pR, plH = sH - pT - pB;
    const sxF = (v) => (Math.log10(Math.max(1e3, Math.min(1e9, v))) - 3) / 6;
    const syF = (v) => 1 - Math.min(1, Math.log10(1 + Math.max(0, v)) / 3);
    const sx = (v) => pL + sxF(v) * plW;
    const sy = (v) => pT + syF(v) * plH;
    const pctX = (v) => (sx(v) / sW * 100).toFixed(2) + '%';
    const pctY = (v) => (sy(v) / sH * 100).toFixed(2) + '%';
    const openCoins = new Set(hOpen.map((h) => h.coin));
    const sdCoin = (this.state && this.state.hzSD) || null;
    const hzScatter = oppsAll.filter((o) => o.oiMin != null).slice(0, 260).map((o) => {
      const t = tierOf(o), tm = this.hedgeTierMeta(t), held = openCoins.has(o.coin), on = sdCoin === o.coin;
      return {
        cx: sx(o.oiMin).toFixed(1), cy: sy(o.apr).toFixed(1),
        r: on ? 8.5 : held ? 6.5 : eligible(o) ? 4.2 : 2.6,
        fill: held ? '#FFFFFF' : tm.col,
        op: (on || held) ? 1 : eligible(o) ? 0.85 : 0.22,
        enter: () => this.setState({ hzSD: o.coin }),
        pick: () => this.setState({ hzDetail: o.coin }),
      };
    });
    const hzSY = [1000, 300, 100, 30, 10].map((v) => ({ top: pctY(v), y: sy(v).toFixed(1), lbl: v + '%' }));
    const hzSXa = [4, 5, 6, 7, 8].map((e) => { const v = Math.pow(10, e); return { left: pctX(v), x: sx(v).toFixed(1), lbl: e >= 6 ? Math.pow(10, e - 6) + 'M' : Math.pow(10, e - 3) + 'K' }; });
    const hzScatterMeta = {
      w: sW, h: sH, x0: pL, x1: (sW - pR).toFixed(1), y0: pT, y1: (sH - pB).toFixed(1),
      n: hzScatter.length, held: openCoins.size,
      hasGate: minOi > 0, gateX: minOi > 0 ? sx(minOi).toFixed(1) : '0',
      gateLeft: minOi > 0 ? pctX(minOi) : '0%', gateLbl: minOi > 0 ? oiLbl(minOi) + ' GATE' : '',
      clear: () => { if (sdCoin) this.setState({ hzSD: null }); },
    };
    const sdO = sdCoin ? oppsAll.find((x) => x.coin === sdCoin) : null;
    const sdTm = sdO ? this.hedgeTierMeta(tierOf(sdO)) : null;
    const hzSD = sdO ? {
      show: true, coin: sdO.coin, apr: aprS(sdO.apr), oi: oiS(sdO.oiMin),
      tier: tierOf(sdO), tierCol: sdTm.col,
      legs: sdO.long.v + ' → ' + sdO.short.v,
      basis: sdO.basis != null ? (sdO.basis * 100).toFixed(2) + '%' : '—',
      lev: Math.min(sdTm.lev, mm.levCap) + '×',
      state: openCoins.has(sdO.coin) ? 'HEDGED' : eligible(sdO) ? 'TRADEABLE IN ' + mm.lbl : 'OFF-MODE',
      stateCol: openCoins.has(sdO.coin) ? G : eligible(sdO) ? '#97FCE4' : '#7C9A91',
      left: pctX(sdO.oiMin), top: pctY(sdO.apr),
      side: sxF(sdO.oiMin) > 0.6 ? 'translate(-104%, -50%)' : 'translate(4%, -50%)',
      open: () => this.setState({ hzDetail: sdO.coin }),
    } : { show: false, left: '0%', top: '0%', side: 'none' };
    const hzLegend = ['CORE', 'MAJOR', 'ALT', 'THIN'].map((t) => {
      const tm = this.hedgeTierMeta(t), on = tierF === t;
      return { t, col: on ? '#08130f' : tm.col, dot: tm.col,
        bg: on ? tm.col : 'rgba(255,255,255,.03)', bd: on ? tm.col : 'rgba(151,252,228,.1)',
        n: (tierCounts[t] || []).length,
        pick: () => this.setState((st) => ({ hzTierF: st.hzTierF === t ? null : t })) };
    });
    // ---- cumulative carry: every closed hedge is a hoverable step on the curve ----
    const cW = 320, cH = 152, cP = 11;
    const chron = hHist.slice().reverse();
    let run = 0;
    const cPts = chron.map((h) => { run += (h.pnl || 0); return { v: run, h }; });
    const liveNet = hOpen.reduce((s2, h) => s2 + ((h.accrued || 0) - (h.fee || 0)), 0);
    const cAll = cPts.concat((cPts.length || liveNet) ? [{ v: run + liveNet, h: null }] : []);
    const cLo = Math.min(0, ...cAll.map((p) => p.v)), cHi = Math.max(0.01, ...cAll.map((p) => p.v));
    const cyOf = (v) => cP + (1 - (v - cLo) / Math.max(1e-6, cHi - cLo)) * (cH - cP * 2);
    const cxOf = (i) => cAll.length < 2 ? cW / 2 : cP + (i / (cAll.length - 1)) * (cW - cP * 2);
    this._hzCN = cAll.length;
    this._hzCVB = { w: cW, p: cP };
    const cHov = (this.state && this.state.hzCH != null && this.state.hzCH < cAll.length) ? this.state.hzCH : null;
    const cSel = cHov != null ? cAll[cHov] : null;
    const cTot = run + liveNet;
    const cLine = cAll.map((p, i) => cxOf(i).toFixed(1) + ',' + cyOf(p.v).toFixed(1)).join(' ');
    const hzCarve = {
      w: cW, h: cH, has: cAll.length > 1, zeroY: cyOf(0).toFixed(1),
      line: cLine,
      area: cAll.length > 1 ? 'M' + cxOf(0).toFixed(1) + ',' + cyOf(0).toFixed(1) + ' L' + cLine.split(' ').join(' L') + ' L' + cxOf(cAll.length - 1).toFixed(1) + ',' + cyOf(0).toFixed(1) + ' Z' : '',
      col: cTot >= 0 ? G : Rd,
      endX: cxOf(cAll.length - 1).toFixed(1), endY: cyOf(cTot).toFixed(1),
      tot: fmtM(+cTot.toFixed(2)), totCol: cTot >= 0 ? G : Rd,
      realised: fmtM(+run.toFixed(2)), live: fmtM(+liveNet.toFixed(2)), liveCol: liveNet >= 0 ? G : Rd,
      n: chron.length,
      move: this.hzKMove, leave: this.hzKLeave,
      hovShow: cSel != null,
      hovX: cSel != null ? cxOf(cHov).toFixed(1) : '0', hovY: cSel != null ? cyOf(cSel.v).toFixed(1) : '0',
      hovLeft: cSel != null ? (cxOf(cHov) / cW * 100).toFixed(2) + '%' : '0%',
      hovTot: cSel != null ? fmtM(+cSel.v.toFixed(2)) : '',
      hovCoin: cSel != null ? (cSel.h ? cSel.h.coin : 'OPEN NOW') : '',
      hovStep: cSel != null ? (cSel.h ? fmtM(+(cSel.h.pnl || 0).toFixed(2)) : fmtM(+liveNet.toFixed(2))) : '',
      hovStepCol: cSel != null ? ((cSel.h ? (cSel.h.pnl || 0) : liveNet) >= 0 ? G : Rd) : G,
      hovWhy: cSel != null ? (cSel.h ? (cSel.h.why || 'CLOSED') : 'ACCRUING') : '',
    };
    // ---- asset-class split + the cash-session clock the RWA pairs actually answer to ----
    const clsN = {}; oppsAll.forEach((o) => { const k = classOf(o); clsN[k] = (clsN[k] || 0) + 1; });
    const hzClasses = this.ASSET_CLASSES.filter((k) => clsN[k]).map((k) => {
      const cm = this.assetClassMeta(k), on = classF === k;
      return {
        k, lbl: cm.short, n: clsN[k], desc: cm.desc,
        col: on ? '#08130f' : cm.col,
        bg: on ? cm.col : 'rgba(255,255,255,.03)',
        bd: on ? cm.col : 'rgba(151,252,228,.1)',
        pick: () => this.setState((s) => ({ hzClassF: s.hzClassF === k ? null : k })),
      };
    });
    const sess = this.usSession();
    const rwaN = oppsAll.filter((o) => this.assetClassMeta(classOf(o)).sens).length;
    const hzSess = {
      has: rwaN > 0, hasClasses: hzClasses.length > 1, open: sess.open,
      col: sess.open ? '#3FE0A0' : '#F2B33D',
      lbl: sess.open ? 'US CASH OPEN' : sess.state === 'WEEKEND' ? 'US CASH · WEEKEND' : sess.state === 'PRE' ? 'US CASH · PRE-MARKET' : sess.state === 'AFTER' ? 'US CASH · AFTER HOURS' : 'US CASH CLOSED',
      note: sess.open
        ? rwaN + ' RWA pair' + (rwaN === 1 ? '' : 's') + ' marking against a live underlying'
        : rwaN + ' RWA pair' + (rwaN === 1 ? '' : 's') + ' capped at ALT — underlying shut, basis is stale',
    };
    const hzGate = {
      min: minOi >= 1e6 ? '$' + (minOi / 1e6).toFixed(1) + 'M' : minOi >= 1e3 ? '$' + Math.round(minOi / 1e3) + 'K' : minOi > 0 ? '$' + minOi : 'NONE',
      hidden: hzThinN,
      thinLbl: showThin ? 'HIDE OFF-MODE' : 'SHOW ' + hzThinN + ' OFF-MODE',
      thinCol: showThin ? '#F2B33D' : '#7C9A91',
      hasThin: hzThinN > 0,
      toggleThin: () => this.setState((s) => ({ hzShowThin: !s.hzShowThin })),
    };
    // ---- how each venue pays out: taker fee + funding cadence, straight from the fee table ----
    const hzVenues = this.VENUES.map((v) => {
      const m = this.hedgeVenueMeta(v);
      const up = (this.venueUp || new Set()).has(v);
      return { v: v === 'HL_XYZ' ? 'HL·XYZ' : v === 'GMX_AVAX' ? 'GMX·AVAX' : v, ico: this.venueIcon(v), icoStyle: this.icoBg(this.venueIcon(v)), mono: String(v).slice(0, 2), up,
        pay: up ? m.pay
          : m.proxied ? 'WAITING ON THE RELAY — /api/rates is not answering from this origin, so no rates arrive. The venue blocks browser calls; deploy the relay and this row goes live.'
          : 'FEED UNAVAILABLE — the browser cannot reach this venue directly (CORS), so it contributes no rates to the scan.',
        payCol: up ? '#7C9A91' : '#FF6B7A', vCol: up ? '#E9FBF5' : '#6b7f79', taker: m.bps.toFixed(1) + ' bps', maker: (m.mkr < 0 ? '−' : '') + Math.abs(m.mkr).toFixed(1) + ' bps', mkrCol: m.mkr < 0 ? '#3FE0A0' : '#9CB8AF', iv: m.iv, rt: ((m.bps * 2) / 100).toFixed(2) + '%' };
    });
    // Why a PLACE HEDGE click would do nothing. hedgePlace() bails on these three conditions and used to
    // return in silence, so the button looked broken. Now the button says which one is stopping it.
    const hwNow = this.hedgeWallet();
    const blockedBy = (o) => {
      const tm = this.hedgeTierMeta(this.hedgeTierFor(o));
      if (hOpen.length >= mm.maxSlots) return { btn: 'ALL ' + mm.maxSlots + ' SLOTS IN USE', why: mm.lbl + ' runs at most ' + mm.maxSlots + ' hedges at once. Close one from LIVE HEDGES to free a slot, or switch mode.' };
      const legM = Math.floor(hwNow.bal * tm.alloc * 100) / 100;
      if (legM < 5) return { btn: 'BANK TOO LOW · $' + hwNow.bal.toFixed(0), why: 'This tier sizes at ' + Math.round(tm.alloc * 100) + '% of the hedge bank per leg, which is under the $5 minimum with $' + hwNow.bal.toFixed(2) + ' free. Close a hedge to return its margin.' };
      return null;
    };
    const hzCards = opps.slice(0, 9).map((o) => {
      const isOpen = hOpen.some((x) => x.coin === o.coin);
      const armed = o.apr >= thr && eligible(o);
      const tier = tierOf(o); const tmeta = this.hedgeTierMeta(tier);
      const ser = ((this.hzSeries || {})[o.coin] || []).slice(-40);
      let spark = '';
      if (ser.length > 1) {
        const vs = ser.map((x) => x.apr); const mn = Math.min.apply(null, vs), mx = Math.max.apply(null, vs);
        const rg = Math.max(1e-6, mx - mn);
        spark = vs.map((v, i) => ((i / (vs.length - 1)) * 100).toFixed(1) + ',' + (22 - ((v - mn) / rg) * 20).toFixed(1)).join(' ');
      }
      const beH = o.spr > 0 ? 0.002 / o.spr : null;
      const nfts = [o.long.nft, o.short.nft].filter(Boolean);
      return {
        coin: o.coin, apr: aprS(o.apr),
        aprColor: armed ? G : '#97FCE4',
        lv: o.long.v, sv: o.short.v,
        lApr: aprS(o.long.r * 24 * 365 * 100) + ' /yr', sApr: aprS(o.short.r * 24 * 365 * 100) + ' /yr',
        be: beH ? (beH < 1 ? Math.round(beH * 60) + 'm of carry' : beH.toFixed(1) + 'h of carry') : '—',
        nft: nfts.length ? cd(Math.min.apply(null, nfts)) : 'CONTINUOUS',
        iconStyle: this.icoBg(this.icon(o.coin), { fit: 'cover', round: true }), mono: String(o.coin).replace(/^k/, '').slice(0, 2).toUpperCase(),
        oi: oiS(o.oiMin), oiCol: tmeta.col,
        tier, tierCol: tmeta.col, tierBg: eligible(o) ? tmeta.col + '22' : 'rgba(255,255,255,.04)',
        cls: this.assetClassMeta(classOf(o)).short,
        clsCol: this.assetClassMeta(classOf(o)).col,
        clsBg: this.assetClassMeta(classOf(o)).col + '1e',
        clsShow: classOf(o) !== 'CRYPTO',
        shut: this.assetClassMeta(classOf(o)).sens && !sess.open,
        lev: Math.min(tmeta.lev, mm.levCap) + '× · ' + Math.round(tmeta.alloc * 100) + '% bank',
        spark, hasSpark: !!spark, sparkCol: tmeta.col,
        offMode: !eligible(o),
        badgeShow: !isOpen, // an open hedge already reads as one: green border, OPEN button, LIVE HEDGES row
        badge: !eligible(o) ? 'OFF-MODE' : armed ? 'AUTO ARMED' : o.nV + ' VENUES',
        badgeCol: isOpen ? G : !eligible(o) ? '#7C9A91' : armed ? '#97FCE4' : '#7C9A91',
        badgeBg: isOpen ? 'rgba(63,224,160,.12)' : !eligible(o) ? 'rgba(255,255,255,.05)' : armed ? 'rgba(151,252,228,.12)' : 'rgba(255,255,255,.05)',
        border: isOpen ? 'rgba(63,224,160,.28)' : !eligible(o) ? 'rgba(151,252,228,.06)' : armed ? 'rgba(151,252,228,.28)' : 'rgba(151,252,228,.08)',
        cardOp: eligible(o) ? '1' : '.55',
        btn: isOpen ? 'OPEN' : blockedBy(o) ? blockedBy(o).btn : 'PLACE HEDGE',
        btnCol: isOpen || blockedBy(o) ? '#5f7a72' : '#97FCE4',
        btnCur: isOpen || blockedBy(o) ? 'not-allowed' : 'pointer',
        btnTitle: isOpen ? 'Already hedged — manage it from the LIVE HEDGES row above.' : blockedBy(o) ? blockedBy(o).why : 'Open both legs at ' + Math.min(tmeta.lev, mm.levCap) + '× using ' + Math.round(tmeta.alloc * 100) + '% of the hedge bank per leg.',
        place: isOpen || blockedBy(o) ? null : (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.hedgePlace(o); },
        open: () => this.setState({ hzDetail: o.coin }),
      };
    });
    const hzOpen = hOpen.map((hd) => {
      const net = (hd.accrued || 0) - hd.fee;
      const hrs = (Date.now() - hd.t0) / 3600e3;
      return {
        coin: hd.coin, legs: 'LONG ' + hd.lv + ' ↔ SHORT ' + hd.sv,
        notional: '$' + hd.notional.toFixed(0) + ' ×2', carry: money(hd.accrued || 0),
        margin: '$' + ((hd.legMargin || 0) * 2).toFixed(2), lev: (hd.lev || 3) + '×',
        gross: '$' + (hd.notional * 2).toFixed(0),
        tier: hd.tier || 'THIN', tierCol: this.hedgeTierMeta(hd.tier || 'THIN').col,
        toLiq: (hd.liqD != null ? Math.max(0, hd.liqD - (hd.worst || 0)) * 100 : 100 / (hd.lev || 3)).toFixed(1) + '%',
        toLiqCol: (hd.health != null && hd.health < 0.5) ? '#FF6B7A' : (hd.health != null && hd.health < 0.75) ? '#F2B33D' : '#B8D2C9',
        healthW: Math.round((hd.health != null ? hd.health : 1) * 100) + '%',
        healthBg: (hd.health != null && hd.health < 0.5) ? '#FF6B7A' : (hd.health != null && hd.health < 0.75) ? '#F2B33D' : '#3FE0A0',
        topUp: hd.topUps ? 'TOPPED UP +$' + (hd.topUp || 0).toFixed(2) + ' ×' + hd.topUps : '',
        hasTopUp: !!hd.topUps,
        net: money(net), netColor: net >= 0 ? G : Rd,
        spr: hd.sprApr != null ? aprS(hd.sprApr) + ' APR' : 'STALE', sprColor: hd.sprApr > 0 ? G : Rd,
        held: hrs < 1 ? Math.round(hrs * 60) + 'm' : hrs.toFixed(1) + 'h',
        mode: hd.auto ? 'AUTO' : 'MANUAL',
        close: () => this.hedgeClose(hd.t0),
      };
    });
    const hzHist = hHist.slice(0, 300).map((hd) => ({
      coin: hd.coin, legs: 'L ' + hd.lv + ' / S ' + hd.sv,
      pnl: money(hd.pnl || 0), pnlColor: (hd.pnl || 0) >= 0 ? G : Rd,
      held: (() => { const h = ((hd.closed || 0) - hd.t0) / 3600e3; return h < 1 ? Math.round(h * 60) + 'm' : h.toFixed(1) + 'h'; })(),
      why: hd.why || 'CLOSED',
      whyCol: ({ LIQ: '#FF6B7A', DEMOTED: '#FF9AA6', FLIPPED: '#F2B33D', DECAYED: '#F2B33D', STALE: '#8FA8A0', MANUAL: '#97FCE4', 'OFF-MODE': '#8FC0F0' })[hd.why] || '#7C9A91',
      note: ({
        LIQ: 'A leg was liquidated on its own venue — its margin is gone, the surviving leg came back.',
        FLIPPED: 'Funding inverted: the spread turned negative and the carry started costing money.',
        DECAYED: 'Spread held under ' + Math.max(8, Math.round(thr * 0.15)) + '% APR for 30 minutes — too thin to ever repay the round trip.',
        STALE: 'Both venue feeds went dark for 45 minutes. No quotes means no accrual and no liquidation watch.',
        DEMOTED: 'Fell to ' + (hd.tierNow || 'a lower tier') + ' — ' + (({
          BASIS: 'cross-venue basis widened to ' + (hd.basisEnd != null ? hd.basisEnd + '%' : 'beyond tolerance') + ', which is unhedged delta eating margin',
          DEPTH: 'thinner-leg depth fell to ' + oiS(hd.oiEnd) + ', too little book to exit into',
          SESSION: 'the underlying cash market shut, so the basis was marked off a stale reference',
          CADENCE: 'the two legs settle funding on different cadences',
          TIER: 'depth ' + oiS(hd.oiEnd) + ' and basis ' + (hd.basisEnd != null ? hd.basisEnd + '%' : '—') + ' together',
        })[hd.trigger] || ('depth ' + oiS(hd.oiEnd) + ', basis ' + (hd.basisEnd != null ? hd.basisEnd + '%' : '—'))) + ' — outside ' + (hd.modeEnd || 'this mode') + '.',
        'OFF-MODE': 'Risk mode changed to ' + (hd.modeEnd || 'a stricter mode') + ', where ' + (hd.tierNow || hd.tier || 'this') + ' pairs are not eligible. The pair itself did not decay — basis was ' + (hd.basisEnd != null ? hd.basisEnd + '%' : 'still tight') + ' at unwind.',
        MANUAL: 'Closed by hand from the dashboard.',
      })[hd.why] || 'Closed.',
      tier: hd.tier || '—', tierCol: this.hedgeTierMeta(hd.tier || 'THIN').col,
      cls: this.assetClassMeta(hd.cls || this.assetClassOf(hd.coin)).short,
      clsShow: (hd.cls || this.assetClassOf(hd.coin)) !== 'CRYPTO',
      clsCol: this.assetClassMeta(hd.cls || this.assetClassOf(hd.coin)).col,
      size: '$' + Math.round(hd.notional || 0),
      when: (() => { const d = new Date(hd.closed || hd.t0); return ('0' + d.getDate()).slice(-2) + ' ' + ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()] + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); })(),
    }));
    // ---- cumulative ledger across the WHOLE retained history, not just the visible rows ----
    const hzLedN = hHist.length;
    const hzLedWins = hHist.filter((h) => (h.pnl || 0) > 0).length;
    const hzLedNet = hHist.reduce((s, h) => s + (h.pnl || 0), 0);
    const hzLedHrs = hzLedN ? hHist.reduce((s, h) => s + Math.max(0, ((h.closed || 0) - h.t0) / 3600e3), 0) / hzLedN : 0;
    // how hedges actually die, counted — the ledger's most useful column in aggregate
    const whyN = {}; hHist.forEach((h) => { const k = h.why || 'CLOSED'; whyN[k] = (whyN[k] || 0) + 1; });
    const whyCols = { LIQ: '#FF6B7A', DEMOTED: '#FF9AA6', FLIPPED: '#F2B33D', DECAYED: '#F2B33D', STALE: '#8FA8A0', MANUAL: '#97FCE4', 'OFF-MODE': '#8FC0F0' };
    const hzLedWhy = Object.keys(whyN).sort((a, b) => whyN[b] - whyN[a]).map((k) => ({
      k, n: whyN[k], col: whyCols[k] || '#7C9A91',
      pct: Math.round((whyN[k] / Math.max(1, hzLedN)) * 100) + '%',
    }));
    const hzLed = {
      why: hzLedWhy, hasWhy: hzLedWhy.length > 0,
      n: hzLedN,
      wr: hzLedN ? Math.round((hzLedWins / hzLedN) * 100) + '%' : '—',
      net: money(+hzLedNet.toFixed(2)),
      netCol: hzLedNet >= 0 ? G : Rd,
      hold: hzLedHrs < 1 ? Math.round(hzLedHrs * 60) + 'm' : hzLedHrs.toFixed(1) + 'h',
      oldest: hzLedN ? (() => { const d = new Date(hHist[hzLedN - 1].closed || hHist[hzLedN - 1].t0); return ('0' + d.getDate()).slice(-2) + ' ' + ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]; })() : '—',
    };
    // ---- capital & leverage: what the hedge bot actually risks per hedge ----
    const _hw = this.hedgeWallet();
    const _locked = hOpen.reduce((s, x) => s + (x.legMargin || 0) * 2, 0);
    const _grossOpen = hOpen.reduce((s, x) => s + (x.notional || 0) * 2, 0);
    const _bankTot = _hw.bal + _locked;
    const hzCap = {
      bank: '$' + _bankTot.toFixed(2),
      free: '$' + _hw.bal.toFixed(2),
      lockd: '$' + _locked.toFixed(2),
      gross: '$' + _grossOpen.toFixed(0),
      slots: hOpen.length + ' / ' + mm.maxSlots,
      lev: 'up to ' + mm.levCap + '×',
      deployPct: Math.round((_locked / Math.max(1, _bankTot)) * 100) + '%',
      deployW: Math.min(100, Math.round((_locked / Math.max(1, _bankTot)) * 100)) + '%',
      acctLev: (_grossOpen / Math.max(1, _bankTot)).toFixed(2) + '×',
      rule: mm.lbl + ' · sizing and leverage follow the tier of each pair',
    };

    // ---- deep-dive modal ----
    const det = this.state && this.state.hzDetail;
    let dv = { hzDOpen: false };
    if (det && this.hedgeMap && this.hedgeMap[det] && this.hedgeMap[det].length >= 2) {
      const vsAll = this.hedgeMap[det].slice().sort((a, b) => a.r - b.r);
      const lo = vsAll[0], hi = vsAll[vsAll.length - 1];
      const spr = hi.r - lo.r, gross = spr * 24 * 365 * 100;
      const bps = (v) => this.hedgeVenueMeta(v).bps;
      const am = (b) => b * 2 / 10000 * 365 / 7 * 100; // 2 fills, amortized over 7 days → APR pts
      const slipAm = am(3);
      const costL = am(bps(lo.v)), costS = am(bps(hi.v));
      const net = gross - costL - costS - slipAm * 2;
      const totFrac = ((bps(lo.v) + bps(hi.v)) * 2 + 12) / 10000;
      const beD = gross > 0 ? totFrac / (gross / 100 / 365) : null;
      const ser = this.hzSerLoad()[det] || [];
      const aprs = ser.map((x) => x.apr);
      const mx = aprs.length ? Math.max.apply(null, aprs) : gross;
      const mn = aprs.length ? Math.min.apply(null, aprs) : gross;
      const avg = aprs.length ? aprs.reduce((s, x) => s + x, 0) / aprs.length : gross;

      // ================= SPREAD APR CHART =================
      // break-even APR = the spread you need for 24h of carry to cover the round trip
      const beApr = totFrac * 36500;
      const rKey = this.hzRange();
      const rMs = (this.HZ_RANGES.find((r) => r[0] === rKey) || ['1H', 36e5])[1];
      const nowT = Date.now();
      let win = rMs === Infinity ? ser.slice() : ser.filter((p) => nowT - p.t <= rMs);
      if (win.length < 2 && ser.length >= 2) win = ser.slice(-2); // never show an empty frame when data exists
      const wv = win.map((p) => p.apr);
      const CW = 940, CH = 240, cpL = 54, cpR = 14, cpT = 16, cpB = 26;
      const cplW = CW - cpL - cpR, cplH = CH - cpT - cpB;
      const hiV = wv.length ? Math.max.apply(null, wv) : gross;
      const loV = wv.length ? Math.min.apply(null, wv) : gross;
      const yHi = Math.max(hiV, beApr, thr > 0 && thr < hiV * 3 ? thr : 0, 1) * 1.1;
      const yLo = loV < 0 ? loV * 1.12 : 0;
      const yOf = (v) => (cpT + (1 - (v - yLo) / Math.max(1e-6, yHi - yLo)) * cplH);
      const xOf = (i) => (cpL + (win.length < 2 ? cplW : (i / (win.length - 1)) * cplW));
      this._hzWin = win;
      this._hzVB = { w: CW, pL: cpL, plotW: cplW };
      const sparse = win.length < 4;
      const linePts = win.map((p, i) => xOf(i).toFixed(1) + ',' + yOf(p.apr).toFixed(1)).join(' ');
      const zeroY = yOf(Math.max(yLo, 0));
      const hovI = this.state && this.state.hzHov != null && this.state.hzHov < win.length ? this.state.hzHov : null;
      const shown = hovI != null ? win[hovI] : (win.length ? win[win.length - 1] : null);
      const shownApr = shown ? shown.apr : gross;
      const firstApr = wv.length ? wv[0] : gross;
      const dlt = shownApr - firstApr;
      const nTicks = 4;
      const spanMs = win.length > 1 ? win[win.length - 1].t - win[0].t : 0;
      const durS = (ms) => ms < 6e4 ? Math.round(ms / 1000) + 's' : ms < 36e5 ? Math.round(ms / 6e4) + 'm' : (ms / 36e5).toFixed(1) + 'h';
      const aboveN = wv.filter((v) => v >= beApr).length;
      const hzC = {
        w: CW, h: CH, has: win.length > 1, sparse, n: win.length,
        line: linePts,
        area: win.length > 1 ? 'M' + xOf(0).toFixed(1) + ',' + zeroY.toFixed(1) + ' L' + linePts.split(' ').join(' L') + ' L' + xOf(win.length - 1).toFixed(1) + ',' + zeroY.toFixed(1) + ' Z' : '',
        dots: sparse ? win.map((p, i) => ({ cx: xOf(i).toFixed(1), cy: yOf(p.apr).toFixed(1) })) : [],
        yTicks: Array.from({ length: nTicks + 1 }, (_, k) => { const v = yLo + (k / nTicks) * (yHi - yLo); return { y: yOf(v).toFixed(1), lbl: (v >= 0 ? '' : '−') + Math.abs(Math.round(v)) + '%' }; }),
        xTicks: win.length > 1 ? [0, Math.floor((win.length - 1) / 2), win.length - 1].map((i) => ({ x: xOf(i).toFixed(1), lbl: tmS(win[i].t) })) : [],
        zeroY: zeroY.toFixed(1), hasZero: yLo < 0,
        beY: yOf(beApr).toFixed(1), beLbl: 'BREAK EVEN 24H · ' + Math.round(beApr) + '%', hasBe: beApr <= yHi && beApr >= yLo,
        thrY: yOf(thr).toFixed(1), thrLbl: 'AUTO-PLACE · ' + thr + '%', hasThr: thr > 0 && thr <= yHi && thr >= yLo,
        lastX: win.length ? xOf(win.length - 1).toFixed(1) : '0', lastY: win.length ? yOf(win[win.length - 1].apr).toFixed(1) : '0',
        baseY: (CH - cpB).toFixed(1), topY: cpT, plotL: cpL, plotR: (CW - cpR).toFixed(1),
        hovShow: hovI != null, hovX: hovI != null ? xOf(hovI).toFixed(1) : '0', hovY: hovI != null ? yOf(win[hovI].apr).toFixed(1) : '0',
        hovLeft: hovI != null ? ((xOf(hovI) / CW) * 100).toFixed(2) + '%' : '0%',
        hovApr: shown ? aprS(shown.apr) : '—', hovTime: shown ? new Date(shown.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
        hovCol: shownApr >= beApr ? G : '#F2B33D',
        hovNote: shownApr >= beApr ? 'clears fees' : 'below break-even',
        move: this.hzCMove, leave: this.hzCLeave,
      };
      const hzCHead = {
        big: aprS(shownApr), bigCol: shownApr >= beApr ? G : shownApr > 0 ? '#F2B33D' : Rd,
        mode: hovI != null ? 'AT ' + hzC.hovTime : 'LIVE',
        dlt: (dlt >= 0 ? '▲ ' : '▼ ') + Math.abs(dlt).toFixed(dlt >= 100 ? 0 : 1) + '%',
        dltCol: dlt >= 0 ? G : Rd,
        dltNote: 'over ' + (spanMs ? durS(spanMs) : '—'),
      };
      const hzCStats = [
        { l: 'HIGH', v: aprS(hiV), c: G },
        { l: 'LOW', v: aprS(loV), c: loV >= beApr ? G : '#F2B33D' },
        { l: 'MEAN', v: aprS(wv.length ? wv.reduce((s, v) => s + v, 0) / wv.length : gross), c: '#B8D2C9' },
        { l: 'ABOVE BE', v: wv.length ? Math.round((aboveN / wv.length) * 100) + '%' : '—', c: aboveN === wv.length && wv.length ? G : '#F2B33D' },
        { l: 'SAMPLES', v: String(win.length), c: '#B8D2C9' },
        { l: 'WINDOW', v: spanMs ? durS(spanMs) : '—', c: '#B8D2C9' },
      ];
      const hzCRanges = this.HZ_RANGES.map(([k]) => ({
        k, lbl: k, on: rKey === k,
        col: rKey === k ? '#08130f' : '#7C9A91',
        bg: rKey === k ? '#97FCE4' : 'transparent',
        set: () => this.setState({ hzRange: k, hzHov: null }),
      }));
      const sizeRaw = this.hzSizeRaw != null ? this.hzSizeRaw : '1000';
      const size = Math.max(0, parseFloat(sizeRaw) || 0);
      const days = this.hzDays || 30;
      const pnl = size * (net / 100 / 365) * days;
      const fmtP = (v) => v == null ? '—' : '$' + (v >= 1000 ? v.toLocaleString('en-US', { maximumFractionDigits: 2 }) : v >= 1.5 ? v.toFixed(3) : v.toFixed(5));
      const fmtOi = (v) => v == null || !isFinite(v) ? '—' : '$' + (v >= 1e6 ? (v / 1e6).toFixed(2) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(1) + 'K' : v.toFixed(0));
      const fhr = (r) => (r >= 0 ? '' : '−') + Math.abs(r * 100).toFixed(4) + '%';
      const tmL = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const legCard = (x) => ({ v: x.v, icoStyle: this.icoBg(this.venueIcon(x.v)), mono: String(x.v).slice(0, 2), px: fmtP(x.px), fhr: fhr(x.r), apr: aprS(x.r * 24 * 365 * 100), aprCol: x.r >= 0 ? G : Rd, oi: fmtOi(x.oi), sym: x.sym, fee: bps(x.v) === 0 ? '0 FEE' : bps(x.v).toFixed(1) + ' BPS', nft: x.nft ? cd(x.nft) : 'CONTINUOUS', url: this.hedgeVenueMeta(x.v).url(x.sym) });
      const isHedged = hOpen.some((x) => x.coin === det);
      // live hedge on this coin → per-leg live view below the chart
      const liveHd = hOpen.find((x) => x.coin === det);
      let lvv = null;
      if (liveHd) {
        const legOf = (vName) => vsAll.find((x) => x.v === vName);
        const lgL = legOf(liveHd.lv), lgS = legOf(liveHd.sv);
        const uOf = (e, cur, dirn) => (e > 0 && cur > 0) ? liveHd.notional * (cur / e - 1) * dirn : null;
        const uL = uOf(liveHd.pxL, lgL && lgL.px, 1), uS = uOf(liveHd.pxS, lgS && lgS.px, -1);
        const priceNet = (uL != null && uS != null) ? uL + uS : null;
        const carry = liveHd.accrued || 0;
        const tot = carry - liveHd.fee + (priceNet || 0);
        const hrs = (Date.now() - liveHd.t0) / 3600e3;
        const uStr = (v) => v == null ? '—' : money(v);
        const uCol = (v) => v == null ? '#7C9A91' : v >= 0 ? G : Rd;
        lvv = {
          hzDHasLive: true,
          hzDLvMode: (liveHd.auto ? 'AUTO-PLACED' : 'MANUAL') + ' · ' + (hrs < 1 ? Math.round(hrs * 60) + 'M' : hrs.toFixed(1) + 'H') + ' AGO · $' + liveHd.notional.toFixed(0) + ' PER LEG',
          hzDLvLV: liveHd.lv, hzDLvLEntry: fmtP(liveHd.pxL), hzDLvLMark: fmtP(lgL && lgL.px), hzDLvLU: uStr(uL), hzDLvLUCol: uCol(uL),
          hzDLvLApr: lgL ? aprS(lgL.r * 24 * 365 * 100) : '—',
          hzDLvSV: liveHd.sv, hzDLvSEntry: fmtP(liveHd.pxS), hzDLvSMark: fmtP(lgS && lgS.px), hzDLvSU: uStr(uS), hzDLvSUCol: uCol(uS),
          hzDLvSApr: lgS ? aprS(lgS.r * 24 * 365 * 100) : '—',
          hzDLvPriceNet: uStr(priceNet), hzDLvPriceNetCol: uCol(priceNet),
          hzDLvCarry: money(carry), hzDLvFees: '−$' + liveHd.fee.toFixed(2),
          hzDLvSpr: liveHd.sprApr != null ? aprS(liveHd.sprApr) + ' APR' : '—', hzDLvSprCol: liveHd.sprApr > 0 ? G : Rd,
          hzDLvNet: money(tot), hzDLvNetCol: tot >= 0 ? G : Rd,
          hzDLvClose: () => this.hedgeClose(liveHd.t0),
        };
      }
      dv = {
        ...(lvv || { hzDHasLive: false }),
        hzDOpen: true, hzDCoin: det, hzDIconStyle: this.icoBg(this.icon(det), { fit: 'cover', round: true, inset: '5px' }),
        hzDSub: 'STRATEGY DEEP-DIVE · ' + vsAll.length + ' VENUES TRACKED · SESSION DATA · ' + ser.length + ' SCAN' + (ser.length === 1 ? '' : 'S'),
        hzDMono: String(det).replace(/^k/, '').slice(0, 2).toUpperCase(),
        hzDGross: aprS(gross), hzDGrossCol: gross >= 0 ? G : Rd,
        hzDCostTot: '−' + (costL + costS + slipAm * 2).toFixed(2) + '%',
        hzC, hzCHead, hzCStats, hzCRanges,
        hzDLongLbl: 'EXECUTE — LONG ON ' + lo.v + ' ↗', hzDLongUrl: this.hedgeVenueMeta(lo.v).url(lo.sym),
        hzDShortLbl: 'EXECUTE — SHORT ON ' + hi.v + ' ↗', hzDShortUrl: this.hedgeVenueMeta(hi.v).url(hi.sym),
        hzDCur: aprS(gross), hzDCurCol: gross >= thr ? G : '#F2B33D',
        hzDAvg: aprS(avg), hzDMax: aprS(mx), hzDMin: aprS(mn), hzDMinCol: mn >= 0 ? G : Rd,
        hzDHasChart: win.length > 1, hzDChartNote: win.length > 1 ? '' : 'history starts on the first scan — one sample per 60s, kept across reloads',
        hzDSparseNote: sparse && win.length > 1 ? 'only ' + win.length + ' samples so far — a flat line here means thin history, not a stable spread' : '',
        hzDVenues: vsAll.map((x) => ({
          v: x.v, icoStyle: this.icoBg(this.venueIcon(x.v)), mono: String(x.v).slice(0, 2), tagShow: x === lo || x === hi, tag: x === lo ? 'LONG' : 'SHORT',
          tagCol: x === lo ? G : Rd, tagBg: x === lo ? 'rgba(63,224,160,.12)' : 'rgba(255,107,122,.12)',
          fhr: fhr(x.r), apr: aprS(x.r * 24 * 365 * 100), aprCol: x.r >= 0 ? G : Rd,
          px: fmtP(x.px), oi: fmtOi(x.oi), fee: bps(x.v) === 0 ? '0 FEE' : bps(x.v).toFixed(1) + ' BPS',
        })),
        hzDLong: legCard(lo), hzDShort: legCard(hi),
        hzDCost: [
          { l: 'GROSS', val: aprS(gross), w: 100, c: gross >= 0 ? G : Rd },
          { l: 'LONG TAKER × 2 · ' + lo.v, val: '−' + costL.toFixed(2) + '%', w: Math.min(100, costL / Math.max(Math.abs(gross), 1) * 100), c: Rd },
          { l: 'LONG SLIPPAGE · ' + lo.v, val: '−' + slipAm.toFixed(2) + '%', w: Math.min(100, slipAm / Math.max(Math.abs(gross), 1) * 100), c: Rd },
          { l: 'SHORT TAKER × 2 · ' + hi.v, val: costS === 0 ? '+0.00%' : '−' + costS.toFixed(2) + '%', w: Math.min(100, costS / Math.max(Math.abs(gross), 1) * 100), c: costS === 0 ? '#7C9A91' : Rd },
          { l: 'SHORT SLIPPAGE · ' + hi.v, val: '−' + slipAm.toFixed(2) + '%', w: Math.min(100, slipAm / Math.max(Math.abs(gross), 1) * 100), c: Rd },
        ],
        hzDNet: aprS(net), hzDNetCol: net >= 0 ? G : Rd, hzDNetW: Math.min(100, Math.abs(net) / Math.max(Math.abs(gross), 1) * 100),
        hzDBe: beD == null ? '—' : beD < 1 ? '< 1D' : beD.toFixed(1) + 'D',
        hzDSize: sizeRaw, hzDSetSize: (e) => { this.hzSizeRaw = e.target.value; this.forceUpdate(); },
        hzDChips: [7, 30, 90].map((d) => ({ label: d + 'D', bg: days === d ? 'rgba(151,252,228,.14)' : 'transparent', col: days === d ? '#97FCE4' : '#7C9A91', set: () => { this.hzDays = d; this.forceUpdate(); } })),
        hzDPos: '$' + size.toLocaleString('en-US'), hzDFinal: '$' + (size + pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        hzDPnl: (pnl >= 0 ? '+$' : '−$') + Math.abs(pnl).toFixed(2) + ' (' + (size > 0 ? (pnl / size * 100).toFixed(2) : '0.00') + '%)', hzDPnlCol: pnl >= 0 ? G : Rd,
        hzDFormula: '> Uses current net APR (' + net.toFixed(2) + '%). Formula: position × (netAPR / 365) × days. Assumes the spread persists — rich spreads usually decay within hours.',
        hzDPlaceLbl: isHedged ? 'ALREADY HEDGED' : 'PLACE PAPER HEDGE — BOTH LEGS',
        hzDPlaceCur: isHedged ? 'default' : 'pointer', hzDPlaceCol: isHedged ? '#5f7a72' : '#97FCE4',
        hzDPlace: isHedged ? null : () => { this.hedgePlace({ coin: det, long: lo, short: hi, apr: gross }); },
        hzDClose: () => this.setState({ hzDetail: null }),
        hzDStop: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      };
    }
    const info = this.hedgeInfo;
    return {
      ...dv,
      hzThrChips: [400, 800, 1600].map((v) => ({
        label: '≥' + v + '%',
        bg: thr === v ? 'rgba(151,252,228,.14)' : 'transparent', col: thr === v ? '#97FCE4' : '#7C9A91',
        set: () => { try { localStorage.setItem('hlg_hedge_min', String(v)); } catch (e) {} this.forceUpdate(); },
      })),
      hzStatus: info
        ? (info.err ? 'scan failed — retrying in 60s' : 'scanned ' + info.coins + ' coins across ' + info.venues + ' venues · ' + Math.max(0, Math.round((Date.now() - info.t) / 1000)) + 's ago · ' + info.above + (info.above === 1 ? ' opportunity' : ' opportunities') + ' above ' + thr + '% APR' + (info.above === 0 ? ' — bot is waiting, spreads that rich are rare' : ''))
        : 'first sweep in progress — pulling live funding from 5 venues…',
      hzCards, hzHasCards: hzCards.length > 0,
      hzOpen, hzHasOpen: hzOpen.length > 0,
      hzVenueLine: 'DEX-ONLY · ' + (this.venueUp ? this.venueUp.size : 0) + ' OF ' + this.VENUES.length + ' VENUE FEEDS LIVE · CLICK ANY CARD OR DOT FOR THE DEEP-DIVE',
      hzHist, hzHasHist: hzHist.length > 0, hzLed, hzCap, hzGate, hzVenues, hzModes, hzMode, hzTiers, hzScatter, hzSXa, hzSY, hzScatterMeta, hzCarve, hzSD, hzLegend, hzClasses, hzSess,
      hzHasTierF: !!tierF, hzTierFLbl: tierF ? 'TIER ' + tierF : '',
      hzClearTierF: () => this.setState({ hzTierF: null }),
      hzSortChips: [['apr', 'APR'], ['oi', 'DEPTH'], ['tier', 'TIER']].map(([k, lbl]) => ({
        lbl, on: sortK === k,
        col: sortK === k ? '#08130f' : '#7C9A91',
        bg: sortK === k ? '#97FCE4' : 'transparent',
        set: () => this.setState({ hzSort: k }),
      })),
    };
  }

  // ---- paper trading engine ----
  paperLoad(sfx) {
    const s = sfx || '';
    const g = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
    const w = g('hlg_paper_wallet' + s, null) || { bal: 2000 }; // V5 book seeds fresh at $2,000
    return { w, open: g('hlg_paper_open' + s, []) || [], hist: g('hlg_paper_hist' + s, []) || [] };
  }
  paperSave5(w, open, hist) {
    try {
      localStorage.setItem('hlg_paper_wallet5', JSON.stringify({ bal: +w.bal.toFixed(2) }));
      localStorage.setItem('hlg_paper_open5', JSON.stringify(open));
      localStorage.setItem('hlg_paper_hist5', JSON.stringify(hist.slice(0, 400)));
    } catch (e) {}
  }
  // V5 entry discipline — every loss counts toward bans (V4's flips didn't, HYPE got churned 4x)
  v5Gate(open, hist, coin, side) {
    const now = Date.now();
    if (open.length >= 3) return false;
    if (open.filter((t) => t.side === side).length >= 2) return false;
    if (open.some((t) => t.coin === coin)) return false;
    if (hist.some((h) => h.coin === coin && now - h.t < 24 * 3600e3)) return false; // one attempt per coin per day
    const L7 = hist.filter((h) => h.coin === coin && now - h.t < 7 * 86400e3 && ((h.pnlNet != null ? h.pnlNet : h.pnl) || 0) < 0);
    if (L7.length >= 2 && now - L7[0].t < 3 * 86400e3) return false; // 2 losses (ANY outcome) in 7d = 3-day ban
    const opened24 = open.filter((t) => now - (t.t0 || 0) < 86400e3).length + hist.filter((h) => (h.ot || 0) > now - 86400e3).length;
    if (opened24 >= 4) return false; // max 4 entries/day — selectivity is the cheapest edge
    return true;
  }
  v5Brackets(coin, mark, side, atr) {
    const dir = side === 'LONG' ? 1 : -1;
    const stopD = Math.max(0.025, Math.min(0.07, atr * 1.8)); // wide: survives the 2–12h noise window where V4's trades died
    const lev = Math.min(5, this.levFor(coin)); // V4's 10x bucket lost −$497 of −$517; ≤5x broke even
    return { dir, stopD, lev, target: mark * (1 + stopD * 2.5 * dir), stop: mark * (1 - stopD * dir), risk0: mark * stopD };
  }
  v5Margin(w, open, stopD, lev) {
    const eq = w.bal + open.reduce((s, t) => s + t.margin, 0);
    let margin = Math.floor((eq * 0.015) / (stopD * lev) * 100) / 100; // fixed 1.5%-of-equity risk per stop-out — leverage derived, never maxed
    margin = Math.min(margin, +(eq * 0.25).toFixed(2), +(w.bal * 0.5).toFixed(2));
    return margin;
  }
  managePaper5(raw) {
    const m = this.T.price;
    const { w, open, hist } = this.paperLoad('5');
    let changed = false;
    const still = [];
    open.forEach((t) => {
      const mine = t.coin === this.coin && m > 0;
      const mk = mine ? m : (this.mids && this.mids[t.coin]);
      if (!(mk > 0)) { still.push(t); return; }
      const dir = t.side === 'LONG' ? 1 : -1;
      if (!t.risk0) t.risk0 = Math.abs(t.entry - t.stop) || 1;
      const rNow = ((mk - t.entry) * dir) / t.risk0;
      const hiNow = Math.max(t.hiR || 0, rNow);
      if (hiNow > (t.hiR || 0) + 0.05) { t.hiR = hiNow; changed = true; }
      // V5 exits: BE later (+1.5R), NO half-banking — winners run to 2.5R (V4's >24h holds were its only green bucket)
      if (!t.be && rNow >= 1.5) { t.be = true; t.stop = t.entry * (1 + 0.002 * dir); changed = true; }
      if (hiNow >= 2 && t.risk0 > 0) { // past +2R the stop trails 1R behind high-water
        const ns = t.entry + Math.min(hiNow - 1, 2.3) * t.risk0 * dir;
        if ((ns - t.stop) * dir > 0) { t.stop = ns; changed = true; }
      }
      let exit = null, outcome = null;
      if ((mk - t.target) * dir >= 0) { exit = t.target; outcome = 'tp'; }
      else if ((mk - t.stop) * dir <= 0) { exit = t.stop; outcome = (t.stop - t.entry) * dir > t.entry * 0.004 ? 'rat' : t.be ? 'be' : 'sl'; }
      else if (Date.now() - (t.t0 || 0) > 60 * 3600e3 && (mk - t.entry) * dir < t.risk0 * 0.25) { exit = mk; outcome = 'time'; } // 60h — no flip exits (all 8 of V4's lost)
      if (exit == null) { still.push(t); return; }
      let pnl = t.margin * (t.lev || 5) * ((exit / t.entry - 1) * dir);
      if (pnl < -t.margin) pnl = -t.margin;
      const cst = this.estCosts(t, outcome, Date.now());
      let pnlNet = pnl - cst.total; if (pnlNet < -t.margin) pnlNet = -t.margin;
      w.bal += t.margin + pnlNet;
      hist.unshift({ coin: t.coin, side: t.side, entry: t.entry, exit, outcome, margin: t.margin, pnl: +pnl.toFixed(2), pnlNet: +pnlNet.toFixed(2), fees: +cst.fees.toFixed(2), slip: +cst.slip.toFixed(2), fund: +cst.fund.toFixed(2), fr: t.fr, r: +(((exit - t.entry) * dir) / (t.risk0 || 1)).toFixed(2), vT0: t.vT0, target: t.target, stop: t.stop, lev: t.lev || 5, ot: t.t0, src: t.src, conv: t.conv, v: 5, t: Date.now() });
      changed = true;
    });
    // V5 on-page entry: ONLY the 75–84% band (the sole profitable band in V4's ledger; ≥85% = crowded, skipped)
    let rec = null; try { rec = JSON.parse(localStorage.getItem('hlg_rec_' + this.coin)); } catch (e) {}
    if (raw && rec && rec.side && !raw._neutral && raw.vConv >= 75 && raw.vConv <= 84 && m > 0 && this.v5Gate(still, hist, this.coin, rec.side)) {
      const ac = (this.atrCache || {})[this.coin];
      const atr = ac && Date.now() - ac.t < 1800e3 ? ac.v : 0;
      if (!atr) this.atrOf(this.coin); // warm the cache — entry can happen on the next sweep
      const dup = hist.some((h) => h.coin === this.coin && h.vT0 === rec.t0);
      if (atr && !dup) {
        const bk = this.v5Brackets(this.coin, m, rec.side, atr);
        const margin = this.v5Margin(w, still, bk.stopD, bk.lev);
        if (margin >= 5 && margin <= w.bal) {
          w.bal -= margin;
          still.push({ coin: this.coin, side: rec.side, entry: m, target: bk.target, stop: bk.stop, risk0: bk.risk0, margin, lev: bk.lev, vT0: rec.t0, t0: Date.now(), conv: raw.vConv, fr: (this.T.funding || 0) / 100, sp: this.spreadOf((this.ctxMap || {})[this.coin], m), src: 'page', v: 5 });
          changed = true;
        }
      }
    }
    if (changed) { this.paperSave5(w, still, hist); this.forceUpdate(); }
  }

  managePaper(raw) {
    const m = this.T.price; // no early-out: scan trades close from mids even if this coin's price is missing
    const { w, open, hist } = this.paperLoad();
    const LEV = this.levFor(this.coin);
    let changed = false;
    const still = [];
    open.forEach((t) => {
      const mine = t.coin === this.coin && m > 0;
      const mk = mine ? m : (this.mids && this.mids[t.coin]);
      if (!(mk > 0)) { still.push(t); return; }
      const dir = t.side === 'LONG' ? 1 : -1;
      const riskD = Math.abs(t.entry - t.stop);
      // V4.1 exit ladder — R is measured from the ORIGINAL stop distance, saved once per trade
      if (!t.risk0) t.risk0 = (t.be || t.tp1) ? Math.abs(t.target - t.entry) / 2.2 : riskD;
      const rNow = t.risk0 > 0 ? ((mk - t.entry) * dir) / t.risk0 : 0;
      const hiNow = Math.max(t.hiR || 0, rNow);
      if (hiNow > (t.hiR || 0) + 0.05) { t.hiR = hiNow; changed = true; }
      // step 1 — at +1R the stop moves to entry+costs (a winner can no longer become a full loser)
      if (!t.be && t.risk0 > 0 && rNow >= 1) { t.be = true; t.stop = t.entry * (1 + 0.002 * dir); changed = true; }
      // step 2 — LADDER: at +1.2R half the margin is cashed out at market; the trade is paid whatever follows
      if (!t.tp1 && rNow >= 1.2 && t.margin >= 10) {
        const half = +(t.margin / 2).toFixed(2);
        const pPnl = half * (t.lev || LEV) * ((mk / t.entry - 1) * dir);
        const pCst = this.estCosts({ ...t, margin: half }, 'tp', Date.now());
        let pNet = pPnl - pCst.total; if (pNet < -half) pNet = -half;
        w.bal += half + pNet;
        hist.unshift({ coin: t.coin, side: t.side, entry: t.entry, exit: mk, outcome: 'tp1', margin: half, pnl: +pPnl.toFixed(2), pnlNet: +pNet.toFixed(2), fees: +pCst.fees.toFixed(2), slip: +pCst.slip.toFixed(2), fund: +pCst.fund.toFixed(2), fr: t.fr, r: +rNow.toFixed(2), vT0: t.vT0, target: t.target, stop: t.stop, lev: t.lev || LEV, ot: t.t0, src: t.src, conv: t.conv, t: Date.now() });
        t.margin = +(t.margin - half).toFixed(2); t.tp1 = true; changed = true;
      }
      // step 3 — RATCHET: past +1.6R the stop trails 0.8R behind the high-water mark; a trade that
      // nears TP mathematically cannot close red anymore (locks up to +1.9R just under the 2.2R target)
      if (hiNow >= 1.6 && t.risk0 > 0) {
        const ns = t.entry + Math.min(hiNow - 0.8, 1.9) * t.risk0 * dir;
        if ((ns - t.stop) * dir > 0) { t.stop = ns; changed = true; }
      }
      let exit = null, outcome = null;
      if ((mk - t.target) * dir >= 0) { exit = t.target; outcome = 'tp'; }
      else if ((mk - t.stop) * dir <= 0) { exit = t.stop; outcome = (t.stop - t.entry) * dir > t.entry * 0.004 ? 'rat' : t.be ? 'be' : 'sl'; }
      else if (mine && raw && !raw._neutral && (raw._isLong ? 1 : -1) !== dir && Math.abs(raw._score) >= 12) { exit = mk; outcome = 'flip'; }
      else if (Date.now() - (t.t0 || 0) > 36 * 3600e3 && (mk - t.entry) * dir < riskD * 0.25) { exit = mk; outcome = 'time'; } // dead >36h → free the slot, stop paying funding
      if (exit == null) { still.push(t); return; }
      let pnl = t.margin * (t.lev || LEV) * ((exit / t.entry - 1) * dir);
      if (pnl < -t.margin) pnl = -t.margin; // liquidation floor: can't lose more than margin
      const cst = this.estCosts(t, outcome, Date.now());
      let pnlNet = pnl - cst.total; if (pnlNet < -t.margin) pnlNet = -t.margin;
      w.bal += t.margin + pnlNet; // the wallet ledger is net of real-world costs
      const riskAbs = Math.abs(t.entry - t.stop) || 1;
      hist.unshift({ coin: t.coin, side: t.side, entry: t.entry, exit, outcome, margin: t.margin, pnl: +pnl.toFixed(2), pnlNet: +pnlNet.toFixed(2), fees: +cst.fees.toFixed(2), slip: +cst.slip.toFixed(2), fund: +cst.fund.toFixed(2), fr: t.fr, r: +(((exit - t.entry) * dir) / riskAbs).toFixed(2), vT0: t.vT0, target: t.target, stop: t.stop, lev: t.lev || 10, ot: t.t0, src: t.src, conv: t.conv, t: Date.now() });
      this.memAdd(t, outcome, pnlNet); // write the close to bot memory — losses become lessons
      changed = true;
    });
    // open a new paper trade: conviction > 70, < 6 open, one trade per coin & per locked verdict
    let rec = null; try { rec = JSON.parse(localStorage.getItem('hlg_rec_' + this.coin)); } catch (e) {}
    let pzU = 0; try { pzU = +localStorage.getItem('hlg_pause_until') || 0; } catch (e) {}
    if (raw && rec && rec.side && !raw._neutral && raw.vConv > 70 && still.length < 4 && Date.now() >= pzU && still.filter((x) => x.side === rec.side).length < 2) {
      const dup = still.some((t) => t.coin === this.coin) || hist.some((h) => h.coin === this.coin && h.vT0 === rec.t0);
      const margin = Math.floor(w.bal * 0.12 * 100) / 100; // 12% of available funds
      if (!dup && margin >= 5) {
        w.bal -= margin;
        still.push({ coin: this.coin, side: rec.side, entry: m, target: rec.target, stop: rec.stop, margin, lev: LEV, vT0: rec.t0, t0: Date.now(), conv: raw.vConv, fr: (this.T.funding || 0) / 100, sp: this.spreadOf((this.ctxMap || {})[this.coin], m) });
        changed = true;
      }
    }
    try {
      localStorage.setItem('hlg_paper_wallet', JSON.stringify({ bal: +w.bal.toFixed(2) }));
      localStorage.setItem('hlg_paper_open', JSON.stringify(still));
      localStorage.setItem('hlg_paper_hist', JSON.stringify(hist.slice(0, 400)));
    } catch (e) {}
    if (changed) this.forceUpdate();
  }

  trackVals() {
    const st = this.state.trStrat === 'v4' ? 'v4' : this.state.trStrat === 'v5' ? 'v5' : 'all';
    const b4 = this.paperLoad(), b5 = this.paperLoad('5');
    const w = { bal: (st === 'v5' ? 0 : b4.w.bal) + (st === 'v4' ? 0 : b5.w.bal) };
    const open = (st === 'v5' ? [] : b4.open.map((t) => ({ ...t, _st: 'V4' }))).concat(st === 'v4' ? [] : b5.open.map((t) => ({ ...t, _st: 'V5' }))).sort((a, b) => (b.t0 || 0) - (a.t0 || 0));
    const hist = (st === 'v5' ? [] : b4.hist.map((h) => ({ ...h, _st: 'V4' }))).concat(st === 'v4' ? [] : b5.hist.map((h) => ({ ...h, _st: 'V5' }))).sort((a, b) => (b.t || 0) - (a.t || 0));
    const start = st === 'all' ? 4000 : 2000;
    const m = this.T.price;
    const P = (v) => '$' + this.fmtPrice(v);
    const G = '#3FE0A0', Rd = '#FF6B7A', Y = '#F2B33D', B = '#8FC0F0';
    const money = (v) => (v < 0 ? '−$' : '+$') + Math.abs(v).toFixed(2);
    const ago = (t) => { const mn = Math.round((Date.now() - t) / 60000); return mn < 1 ? 'now' : mn < 60 ? mn + 'm' : mn < 1440 ? Math.round(mn / 60) + 'h' : Math.round(mn / 1440) + 'd'; };
    const pctRoi = (pnl, margin) => (pnl >= 0 ? '▲ +' : '▼ −') + (margin ? Math.abs(pnl / margin * 100) : 0).toFixed(1) + '%';
    const cm = this.state.costMode !== 'gross';
    const pv = (h) => {
      if (!cm) return h.pnl || 0;
      if (h.pnlNet != null) return h.pnlNet;
      const c = this.estCosts({ margin: h.margin, lev: h.lev, side: h.side, fr: h.fr, t0: h.ot || h.t }, h.outcome, h.t);
      let n = (h.pnl || 0) - c.total; if (n < -(h.margin || 0)) n = -(h.margin || 0); return n;
    };
    const storedGap = hist.reduce((s, h) => s + (h.pnlNet != null ? (h.pnl || 0) - h.pnlNet : 0), 0);
    let lockedMargin = 0, upnlTot = 0;
    const lockedBy = { V4: 0, V5: 0 }, upnlBy = { V4: 0, V5: 0 };
    const openUpnls = [];
    const openRows = open.map((t) => {
      lockedMargin += t.margin; lockedBy[t._st] += t.margin;
      const dir = t.side === 'LONG' ? 1 : -1;
      const mk = (t.coin === this.coin && m > 0) ? m : (this.mids && this.mids[t.coin] > 0 ? this.mids[t.coin] : 0);
      const mine = mk > 0;
      let upnl = mine ? t.margin * (t.lev || 10) * ((mk / t.entry - 1) * dir) : 0;
      if (upnl < -t.margin) upnl = -t.margin;
      if (cm && mine) { upnl -= this.estCosts(t, null, Date.now()).total; if (upnl < -t.margin) upnl = -t.margin; }
      if (mine) { upnlTot += upnl; upnlBy[t._st] += upnl; openUpnls.push({ u: upnl, t }); }
      const tp1H = t.tp1 ? hist.find((h2) => h2.outcome === 'tp1' && h2.coin === t.coin && (h2.vT0 === t.vT0 || h2.ot === t.t0)) : null;
      return {
        bankHas: !!tp1H, bankStr: tp1H ? 'BANKED +$' + Math.abs((tp1H.pnlNet != null ? tp1H.pnlNet : tp1H.pnl) || 0).toFixed(0) + '!' : '',
        badge: (t.src === 'scan' ? 'SCAN · ' : 'OPEN · ') + t.coin, badgeColor: B, badgeBg: 'rgba(143,192,240,.1)',
        goCoin: (e) => { e.stopPropagation(); this.goCoin(t.coin); },
        side: t.side, sideColor: t.side === 'LONG' ? G : Rd,
        entryStr: P(t.entry), nowLbl: 'MARK', nowStr: mine ? P(mk) : '…',
        tpStr: P(t.target), slStr: P(t.stop),
        marginStr: '$' + t.margin.toFixed(0) + ' @' + (t.lev || 10) + 'x',
        time: (ago(t.t0) === 'now' ? 'just now' : ago(t.t0) + ' ago') + (t.conv ? ' · ' + t.conv + '%' : ''),
        pnlStr: mine ? (this.state.pnlDisp === 'pct' ? pctRoi(upnl, t.margin) : money(upnl)) : '—', pnlColor: !mine ? '#7C9A91' : upnl >= 0 ? G : Rd,
        pnlPctStr: '',
        wmDisplay: 'none', wmText: '', rowOpacity: 1,
        strat: t._st, stratCol: t._st === 'V5' ? '#0a1614' : '#8FC0F0', stratBg: t._st === 'V5' ? '#97FCE4' : 'rgba(143,192,240,.18)',
        show: () => this.setState({ modal: { kind: 'open', coin: t.coin, side: t.side, entry: t.entry, target: t.target, stop: t.stop, margin: t.margin, lev: t.lev || 10, t0: t.t0, src: t.src, conv: t.conv, v: t.v } }),
      };
    });
    const histRows = hist.slice(0, 40).map((h) => ({
      wmDisplay: 'flex', wmText: 'closed', rowOpacity: 0.82, bankHas: false, bankStr: '',
      strat: h._st, stratCol: h._st === 'V5' ? '#0a1614' : '#8FC0F0', stratBg: h._st === 'V5' ? '#97FCE4' : 'rgba(143,192,240,.18)',
      badge: (h.outcome === 'tp' ? 'TP HIT' : h.outcome === 'tp1' ? 'TP1 · HALF BANKED' : h.outcome === 'rat' ? 'RATCHET WIN' : h.outcome === 'sl' ? 'SL HIT' : h.outcome === 'be' ? 'BE STOP' : h.outcome === 'time' ? 'TIME STOP' : 'REVERSAL') + ' · ' + h.coin,
      badgeColor: (h.outcome === 'tp' || h.outcome === 'tp1' || h.outcome === 'rat') ? G : h.outcome === 'sl' ? Rd : (h.outcome === 'be' || h.outcome === 'time') ? B : Y,
      badgeBg: (h.outcome === 'tp' || h.outcome === 'tp1' || h.outcome === 'rat') ? 'rgba(63,224,160,.1)' : h.outcome === 'sl' ? 'rgba(255,107,122,.1)' : (h.outcome === 'be' || h.outcome === 'time') ? 'rgba(143,192,240,.1)' : 'rgba(242,179,61,.1)',
      goCoin: (e) => { e.stopPropagation(); this.goCoin(h.coin); },
      side: h.side, sideColor: h.side === 'LONG' ? G : Rd,
      entryStr: P(h.entry), nowLbl: 'EXIT', nowStr: P(h.exit),
      tpStr: h.target ? P(h.target) : '—', slStr: h.stop ? P(h.stop) : '—',
      marginStr: '$' + (h.margin || 0).toFixed(0) + ' @' + (h.lev || 10) + 'x',
      time: (ago(h.t) === 'now' ? 'just now' : ago(h.t) + ' ago') + (h.conv ? ' · ' + h.conv + '%' : ''),
      pnlStr: this.state.pnlDisp === 'pct' ? pctRoi(pv(h), h.margin) : money(pv(h)), pnlColor: pv(h) >= 0 ? G : Rd,
      pnlPctStr: ((h.r || 0) >= 0 ? '+' : '') + (h.r || 0).toFixed(1) + 'R',
      show: () => this.setState({ modal: { kind: 'closed', ...h } }),
    }));
    const tab = this.state.trTab === 'hist' ? 'hist' : this.state.trTab === 'an' ? 'an' : 'open';
    const rows = tab === 'open' ? openRows : tab === 'hist' ? histRows : [];
    const wins = hist.filter((h) => pv(h) > 0).length;
    const net = hist.reduce((s, h) => s + pv(h), 0);
    const equity = w.bal + (cm ? 0 : storedGap) + lockedMargin + upnlTot; // trading book only — hedges run on their own separate bank
    const gapOf = (hh) => cm ? 0 : hh.reduce((s, h) => s + (h.pnlNet != null ? (h.pnl || 0) - h.pnlNet : 0), 0);
    const eq4 = b4.w.bal + gapOf(b4.hist) + lockedBy.V4 + upnlBy.V4;
    const eq5 = b5.w.bal + gapOf(b5.hist) + lockedBy.V5 + upnlBy.V5;
    const memAll = this.memLoad();
    const memRows = memAll.filter((mm) => mm.bad).slice(0, 4).map((mm) => ({
      h: mm.coin + ' ' + mm.side + ' ' + (mm.pnl < 0 ? '−$' + Math.abs(mm.pnl).toFixed(2) : '+$' + (mm.pnl || 0).toFixed(2)),
      c: mm.pnl < 0 ? Rd : G,
      txt: '· ' + String(mm.outcome || '').toUpperCase() + ' · ' + mm.lesson + (mm.conv ? ' · conv ' + mm.conv + '%' : '') + (mm.sp ? ' · spread ' + (mm.sp * 100).toFixed(2) + '%' : ''),
    }));
    const memRl = this.memRules(Date.now());
    const memBans = Object.keys(memRl.bans);
    const memRuleBits = [];
    if (memRl.hotConv) { const hb = (memRl.convStats || []).filter((b) => b.label === '86+' || parseInt(b.label) >= memRl.hotConv); const hn = hb.reduce((s, b) => s + b.n, 0), hw = hb.reduce((s, b) => s + b.w, 0), hnet = hb.reduce((s, b) => s + b.net, 0); memRuleBits.push('conv ≥' + memRl.hotConv + '% SKIPPED as crowded (' + hw + '/' + hn + ' won, ' + (hnet < 0 ? '−$' + Math.abs(hnet) : '+$' + hnet) + ')'); }
    if (memRl.momChase) memRuleBits.push('momentum-chase entries blocked (net negative in ledger)');
    if (memRl.wideLoses) memRuleBits.push('wide-spread entries blocked');
    const memRulesStr = memRuleBits.length ? 'LEARNED RULES NOW ENFORCED: ' + memRuleBits.join(' · ') : '';
    const setTab = (v) => { try { localStorage.setItem('hlg_tr_tab', v); } catch (e) {} if (v === 'an' && this.state.trTab !== 'an') this.startAnAnim(); this.setState({ trTab: v }); };
    const setStrat = (v) => { try { localStorage.setItem('hlg_tr_strat', v); } catch (e) {} if (tab === 'an') this.startAnAnim(); this.setState({ trStrat: v }); };

    // ---- analytics ----
    const closedAsc = hist.slice().reverse();
    const cmpMode = st === 'all';
    const mkPts = (hh, oo, endEq) => {
      let eq0 = 2000;
      const arr = [{ t: hh.length ? (hh[0].ot || hh[0].t) : (oo.length ? Math.min(...oo.map((o) => o.t0)) : Date.now() - 3600e3), v: 2000 }];
      hh.forEach((h) => { eq0 += pv(h); arr.push({ t: h.t, v: eq0 }); });
      arr.push({ t: Date.now(), v: endEq });
      return arr;
    };
    const pts = cmpMode ? mkPts(b4.hist.slice().reverse(), b4.open, eq4) : mkPts(closedAsc, open, equity);
    const pts5 = cmpMode ? mkPts(b5.hist.slice().reverse(), b5.open, eq5) : null;
    const allPts = pts5 ? pts.concat(pts5) : pts;
    const tMin = Math.min(...allPts.map((p) => p.t)), tMax = Math.max(...allPts.map((p) => p.t));
    let vMin = Math.min(2000, ...allPts.map((p) => p.v)), vMax = Math.max(2000, ...allPts.map((p) => p.v));
    const vPad = Math.max((vMax - vMin) * 0.15, 8); vMin -= vPad; vMax += vPad;
    const AX = (t) => ((t - tMin) / Math.max(1, tMax - tMin)) * 980 + 10;
    const AY = (v) => 210 - ((v - vMin) / (vMax - vMin)) * 195;
    const pathOf = (ar) => ar.map((p, i) => (i ? 'L' : 'M') + AX(p.t).toFixed(1) + ' ' + AY(p.v).toFixed(1)).join(' ');
    const anPath = pathOf(pts);
    const anPath5 = pts5 ? pathOf(pts5) : '';
    const retPct = (equity / start - 1) * 100;
    const up = equity >= start;
    const ezP = this.anT0 ? Math.min(1, (Date.now() - this.anT0) / 950) : 1;
    const ez = 1 - Math.pow(1 - ezP, 3);
    const barsData = closedAsc.map((h) => ({
      v: pv(h), f: pv(h) >= 0 ? G : Rd, o: 1,
      title: h.coin + ' ' + h.side + ' · closed', val: money(pv(h)) + ' · ' + pctRoi(pv(h), h.margin),
      click: () => this.setState({ modal: { kind: 'closed', ...h } }),
    })).concat(openUpnls.map((om) => ({
      v: om.u, f: B, o: 0.9,
      title: om.t.coin + ' ' + om.t.side + ' · live', val: money(om.u) + ' upnl · ' + pctRoi(om.u, om.t.margin),
      click: () => this.setState({ modal: { kind: 'open', coin: om.t.coin, side: om.t.side, entry: om.t.entry, target: om.t.target, stop: om.t.stop, margin: om.t.margin, lev: om.t.lev || 10, t0: om.t.t0, src: om.t.src, conv: om.t.conv, v: om.t.v } }),
    })));
    const mxB = Math.max(1, ...barsData.map((b) => Math.abs(b.v)));
    const zeroY = 110;
    const bwA = Math.min(70, 980 / Math.max(barsData.length, 1) * 0.62);
    const anBars = barsData.map((b, i) => {
      const cx = (i + 0.5) / barsData.length * 980 + 10;
      const hh = Math.max(3, Math.abs(b.v) / mxB * 96);
      return {
        x: +(cx - bwA / 2).toFixed(1), y: +(b.v >= 0 ? zeroY - hh : zeroY).toFixed(1), w: +bwA.toFixed(1), h: +hh.toFixed(1), f: b.f, o: b.o,
        org: b.v >= 0 ? '50% 100%' : '50% 0%', d: Math.min(700, i * 40) + 'ms',
        click: b.click, enter: () => this.setState({ anTip: i }),
      };
    });
    const tipI = this.state.anTip;
    const tipB = (tipI != null && barsData[tipI]) ? barsData[tipI] : null;
    const tipLeft = tipB ? Math.max(10, Math.min(90, ((tipI + 0.5) / barsData.length * 980 + 10) / 10)) + '%' : '50%';
    const xf = this.state.anCurXf;
    let anCurX = 0, anCurY = 0, anCurLbl = '', anCurDisp = 'none', anCurLeft = '50%';
    if (xf != null && pts.length) {
      const tx = 10 + xf * 980;
      let bp = pts[0], bd = 1e18;
      pts.forEach((p) => { const d = Math.abs(AX(p.t) - tx); if (d < bd) { bd = d; bp = p; } });
      anCurX = +AX(bp.t).toFixed(1); anCurY = +AY(bp.v).toFixed(1);
      anCurLbl = (cmpMode ? 'V4 $' : '$') + bp.v.toFixed(2) + ' · ' + new Date(bp.t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      anCurDisp = 'block'; anCurLeft = Math.max(10, Math.min(88, anCurX / 10)) + '%';
    }
    const retA = retPct * ez, netA = net * ez, upA = upnlTot * ez;
    const rate = hist.length ? wins / hist.length * 100 : 0;
    const grossW = hist.reduce((s, h) => s + Math.max(0, pv(h)), 0);
    const grossL = hist.reduce((s, h) => s + Math.max(0, -pv(h)), 0);
    const best = hist.length ? hist.reduce((a, b) => (pv(a) >= pv(b) ? a : b)) : null;
    const worst = hist.length ? hist.reduce((a, b) => (pv(a) <= pv(b) ? a : b)) : null;
    const holds = hist.filter((h) => h.ot);
    const avgHoldMs = holds.length ? holds.reduce((s, h) => s + (h.t - h.ot), 0) / holds.length : 0;
    const fmtDur = (ms) => { const mn = Math.round(ms / 60000); return mn < 60 ? mn + 'm' : mn < 1440 ? (mn / 60).toFixed(1) + 'h' : (mn / 1440).toFixed(1) + 'd'; };
    const W = '#E9FBF5';
    const anCmpRows = cmpMode ? [['V4', b4, eq4], ['V5', b5, eq5]].map(([tg, bk, eqX]) => {
      const n = bk.hist.length, wn = bk.hist.filter((h) => pv(h) > 0).length;
      const nt = bk.hist.reduce((s, h) => s + pv(h), 0);
      const gw = bk.hist.reduce((s, h) => s + Math.max(0, pv(h)), 0), gl = bk.hist.reduce((s, h) => s + Math.max(0, -pv(h)), 0);
      const rp = (eqX / 2000 - 1) * 100;
      return {
        tag: tg, tagCol: tg === 'V5' ? '#0a1614' : '#8FC0F0', tagBg: tg === 'V5' ? '#97FCE4' : 'rgba(143,192,240,.18)',
        eq: '$' + eqX.toFixed(2), ret: (rp >= 0 ? '+' : '−') + Math.abs(rp).toFixed(2) + '%', retCol: rp >= 0 ? G : Rd,
        trades: n + ' closed · ' + bk.open.length + ' live', wr: n ? Math.round(wn / n * 100) + '% (' + wn + 'W/' + (n - wn) + 'L)' : '— no closes yet',
        net: money(nt), netCol: nt >= 0 ? G : Rd, pf: gl > 0 ? (gw / gl).toFixed(2) : (gw > 0 ? '∞' : '—'),
      };
    }) : [];

    return {
      trRows: rows, trHas: rows.length > 0, trEmpty: tab !== 'an' && rows.length === 0, trAn: tab === 'an',
      anRetBig: (retA >= 0 ? '+' : '−') + Math.abs(retA).toFixed(2) + '%', anRetColor: up ? G : Rd,
      anEquityStr: '$' + (start + (equity - start) * ez).toFixed(2),
      anStartStr: cmpMode ? '$4,000 combined (2 books)' : '$2,000',
      anCmpHas: cmpMode, anCmpRows,
      anRealStr: money(netA), anRealColor: net >= 0 ? G : Rd,
      anUnrealStr: money(upA), anUnrealColor: upnlTot >= 0 ? G : Rd,
      anDonutDash: (rate * ez).toFixed(1) + ' 100', anRateStr: Math.round(rate * ez) + '%',
      anWL: wins + 'W / ' + (hist.length - wins) + 'L',
      anPFStr: grossL > 0 ? (grossW / grossL).toFixed(2) : (grossW > 0 ? '∞' : '—'),
      anPFSub: '+$' + grossW.toFixed(2) + ' wins ÷ −$' + grossL.toFixed(2) + ' losses',
      anHoldStr: avgHoldMs ? fmtDur(avgHoldMs) : '—',
      anChips: [
        { k: 'BEST TRADE', v: best ? money(pv(best)) : '—', c: best ? G : W, sub: best ? best.coin + ' ' + best.side + ' · click to view' : 'no closed trades yet', d: '.32s', cur: best ? 'pointer' : 'default', click: best ? (() => this.setState({ modal: { kind: 'closed', ...best } })) : null },
        { k: 'WORST TRADE', v: worst ? money(pv(worst)) : '—', c: worst && pv(worst) < 0 ? Rd : W, sub: worst ? worst.coin + ' ' + worst.side + ' · click to view' : 'no closed trades yet', d: '.38s', cur: worst ? 'pointer' : 'default', click: worst ? (() => this.setState({ modal: { kind: 'closed', ...worst } })) : null },
        { k: 'MARGIN IN USE', v: '$' + lockedMargin.toFixed(2), c: W, sub: open.length + ' live trades locked', d: '.44s', cur: 'default', click: null },
        { k: 'TRADES CLOSED', v: String(hist.length), c: W, sub: wins + ' wins · ' + (hist.length - wins) + ' losses', d: '.5s', cur: 'default', click: null },
      ],
      anMove: (ev) => { const r = ev.currentTarget.getBoundingClientRect(); this.setState({ anCurXf: Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) }); },
      anCurLeave: () => this.setState({ anCurXf: null }),
      anTipHide: () => this.setState({ anTip: null }),
      anCurX, anCurY, anCurLbl, anCurDisp, anCurLeft,
      anTipDisp: tipB ? 'flex' : 'none', anTipLeft: tipLeft, anTipTitle: tipB ? tipB.title : '', anTipVal: tipB ? tipB.val : '', anTipColor: tipB ? tipB.f : W,
      anPath, anPath5, anP5Disp: cmpMode ? 'block' : 'none',
      anArea: cmpMode ? '' : anPath + ' L 990 220 L 10 220 Z',
      anStroke: cmpMode ? '#8FC0F0' : (up ? G : Rd), anFill: cmpMode ? 'none' : (up ? 'rgba(63,224,160,.08)' : 'rgba(255,107,122,.08)'),
      anBaseY: +AY(2000).toFixed(1),
      anDotX: +AX(pts[pts.length - 1].t).toFixed(1), anDotY: +AY(pts[pts.length - 1].v).toFixed(1),
      anDot5X: pts5 ? +AX(pts5[pts5.length - 1].t).toFixed(1) : 0, anDot5Y: pts5 ? +AY(pts5[pts5.length - 1].v).toFixed(1) : 0,
      anCurveLegend: cmpMode ? 'blue = V4 · dashed mint = V5 · each starts $2,000' : 'hover to inspect · dashed = $2,000 start',
      anRetStr: cmpMode
        ? 'V4 ' + ((eq4 >= 2000 ? '+' : '−') + Math.abs((eq4 / 2000 - 1) * 100).toFixed(1) + '%') + ' · V5 ' + ((eq5 >= 2000 ? '+' : '−') + Math.abs((eq5 / 2000 - 1) * 100).toFixed(1) + '%')
        : (retPct >= 0 ? '+' : '−') + Math.abs(retPct).toFixed(2) + '% all-time',
      anT0: new Date(tMin).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
      anZeroY: zeroY, anBars,
      trEmptyMsg: tab === 'open'
        ? 'No live trades — V4 opens at ≥70% conviction (12% sizing, coin\'s max leverage); V5 waits for the 75–84% band and risks a fixed 1.5% of its own $2,000 book at ≤5x with ATR-wide stops. Each strategy trades its own separate wallet.'
        : 'No closed trades yet — when a live trade hits its target, its stop, or a confirmed reversal, it moves here with its final P&L.',
      trOpenN: openRows.length, trHistN: hist.length,
      trLastClose: hist.length ? (() => { const mn = Math.round((Date.now() - hist[0].t) / 60000); return 'LAST ' + (mn < 1 ? 'NOW' : mn < 60 ? mn + 'M' : mn < 1440 ? Math.round(mn / 60) + 'H' : Math.round(mn / 1440) + 'D'); })() : 'NONE YET',
      setTrOpen: () => setTab('open'), setTrHist: () => setTab('hist'),
      trTabOBg: tab === 'open' ? 'rgba(151,252,228,.14)' : 'transparent', trTabOCol: tab === 'open' ? '#97FCE4' : '#7C9A91',
      trTabHBg: tab === 'hist' ? 'rgba(151,252,228,.14)' : 'transparent', trTabHCol: tab === 'hist' ? '#97FCE4' : '#7C9A91',
      trTabABg: tab === 'an' ? 'rgba(151,252,228,.14)' : 'transparent', trTabACol: tab === 'an' ? '#97FCE4' : '#7C9A91',
      setTrAn: () => setTab('an'),
      setStV4: () => setStrat('v4'), setStV5: () => setStrat('v5'), setStAll: () => setStrat('all'),
      trStV4Bg: st === 'v4' ? 'rgba(143,192,240,.18)' : 'transparent', trStV4Col: st === 'v4' ? '#8FC0F0' : '#7C9A91',
      trStV5Bg: st === 'v5' ? 'rgba(151,252,228,.14)' : 'transparent', trStV5Col: st === 'v5' ? '#97FCE4' : '#7C9A91',
      trStABg: st === 'all' ? 'rgba(151,252,228,.14)' : 'transparent', trStACol: st === 'all' ? '#97FCE4' : '#7C9A91',
      trCostRBg: cm ? 'rgba(151,252,228,.14)' : 'transparent', trCostRCol: cm ? '#97FCE4' : '#7C9A91',
      trCostGBg: cm ? 'transparent' : 'rgba(151,252,228,.14)', trCostGCol: cm ? '#7C9A91' : '#97FCE4',
      setCostReal: () => { try { localStorage.setItem('hlg_cost_mode', 'net'); } catch (e) {} this.setState({ costMode: 'net' }); },
      setCostGross: () => { try { localStorage.setItem('hlg_cost_mode', 'gross'); } catch (e) {} this.setState({ costMode: 'gross' }); },
      trWins: wins, trLosses: hist.length - wins,
      trRate: (hist.length ? Math.round(wins / hist.length * 100) : 0) + '%',
      trNetR: 'P&L ' + money(net), trNetColor: net >= 0 ? G : Rd,
      trEquity: '$' + equity.toFixed(2), trAvail: '$' + w.bal.toFixed(2),
      trOpenCt: open.length + (st === 'all' ? '/7' : st === 'v5' ? '/3' : '/4'),
      trEquityColor: equity >= start ? G : Rd,
      scanStatus: this.scanStatusStr(),
      memHas: memRows.length > 0 || memRuleBits.length > 0, memRows,
      memBanStr: memBans.length ? 'ACTIVE COIN BANS: ' + memBans.join(', ') : '',
      memRulesStr, memRulesHas: memRuleBits.length > 0,
      peekShow: !!(hist[0] && ((hist[0].pnlNet != null ? hist[0].pnlNet : hist[0].pnl) || 0) > 0),
      peekTxt: hist[0] ? 'banked +$' + Math.abs((hist[0].pnlNet != null ? hist[0].pnlNet : hist[0].pnl) || 0).toFixed(0) + '!' : '',
      bootShow: !this.state.bootDone,
      petCat: this.petCat,
      catHeadRef: this.catHeadRef,
      catBubbleShow: !!this.state.pet || !!(this.state.catMood && this.state.catMood.say),
      catBubbleTxt: this.state.pet ? 'purr purr~' : (this.state.catMood ? this.state.catMood.say : ''),
      catActA: this.state.pet ? 'catPet .55s ease-in-out 3' : ((this.state.catMood && this.state.catMood.wrap) || 'none'),
      catPawA: (this.state.catMood && this.state.catMood.paw) || 'none',
      catHeadA: (this.state.catMood && this.state.catMood.head) || 'none',
      tongueShow: !!(this.state.catMood && this.state.catMood.tongue),
      memExp: !!this.state.memExp,
      memArrow: this.state.memExp ? '▾' : '▸',
      memToggle: () => this.setState({ memExp: !this.state.memExp }),
      posExp: !!this.state.posExp,
      posToggle: () => this.setState({ posExp: !this.state.posExp }),
      stratExp: !!this.state.stratExp,
      stratArrow: this.state.stratExp ? '− COLLAPSE' : '+ EXPAND',
      stratToggle: () => this.setState({ stratExp: !this.state.stratExp }),
      hzBank: '$' + this.hedgeWallet().bal.toFixed(2) + ' AVAIL',
    };
  }

  startAnAnim() {
    this.anT0 = Date.now();
    cancelAnimationFrame(this.anRaf2);
    const loop = () => { this.forceUpdate(); if (this.anT0 && Date.now() - this.anT0 < 1050) this.anRaf2 = requestAnimationFrame(loop); };
    this.anRaf2 = requestAnimationFrame(loop);
  }

  scanStatusStr() {
    let si = null; try { si = JSON.parse(localStorage.getItem('hlg_scan_info')); } catch (e) {}
    if (!si) return 'SCANNER · warming up — first sweep of all tracked coins in <60s';
    const mn = Math.round((Date.now() - si.t) / 60000);
    const agoS = mn < 1 ? 'just now' : mn + 'm ago';
    const top = (si.top || []).map((r) => r.coin + ' ' + r.side + ' ' + r.conv + '%' + (r.ok ? '' : ' ✕ ' + (r.why || 'gated'))).join(' · ');
    const allBlocked = (si.top || []).length > 0 && (si.top || []).every((r) => !r.ok);
    const g = si.gates;
    const gStr = g ? ' · gates now: conv≥' + g.convMin + ' spread≤' + (g.spCap * 100).toFixed(2) + '%' + (g.blockedSide ? ' · ' + g.blockedSide + 'S banned (lost ≥70% recently)' : '') + (g.bans && g.bans.length ? ' · coin bans: ' + g.bans.join(', ') : '') + (g.regime ? ' · market: ' + g.regime + ' (' + g.breadth + '% of coins up)' : '') + (g.sizeF && g.sizeF !== 0.12 ? ' · sizing ' + Math.round(g.sizeF * 100) + '%' + (g.sizeF > 0.12 ? ' — pressing a hot streak' : ' — cold streak, protecting capital') : '') + (g.bookNote ? ' · book: ' + g.bookNote : '') + (g.hungerH > 3 ? ' · relaxed after ' + Math.round(g.hungerH) + 'h without a trade' : '') : '';
    return 'SCANNER · ' + si.n + ' coins swept ' + agoS + (top ? ' · top: ' + top : '') + gStr + (allBlocked ? ' — nothing passed, standing aside' : '');
  }

  // ---- live liquidation streams (Binance + Bybit, free public data) ----
  loadLiq() {
    if (!this.liqEvents) {
      try { this.liqEvents = JSON.parse(localStorage.getItem('hlg_liqev_' + this.coin)) || []; } catch (e) { this.liqEvents = []; }
      const cut = Date.now() - 48 * 3600e3; this.liqEvents = this.liqEvents.filter((e) => e.t > cut);
    }
    return this.liqEvents;
  }
  addLiq(ex, sideLiq, px, usd, t) {
    if (!(px > 0) || !(usd > 0)) return;
    const ev = this.loadLiq();
    ev.unshift({ ex, s: sideLiq, px, usd: +usd.toFixed(2), t: t || Date.now() });
    const cut = Date.now() - 48 * 3600e3;
    this.liqEvents = ev.filter((e) => e.t > cut).slice(0, 500);
    try { localStorage.setItem('hlg_liqev_' + this.coin, JSON.stringify(this.liqEvents)); } catch (e) {}
    this.setState({ lvTick: Date.now() });
  }
  loadAllLiq() {
    if (!this.allLiq) {
      try { this.allLiq = JSON.parse(localStorage.getItem('hlg_liqev_ALL')) || []; } catch (e) { this.allLiq = []; }
      const cut = Date.now() - 48 * 3600e3; this.allLiq = this.allLiq.filter((e) => e.t > cut);
    }
    return this.allLiq;
  }
  addLiqAll(ex, sym, sideLiq, px, usd, t) {
    if (!(px > 0) || !(usd > 0)) return;
    this.loadAllLiq().unshift({ ex, sym, s: sideLiq, px, usd: +usd.toFixed(2), t: t || Date.now() });
    const cut = Date.now() - 48 * 3600e3;
    this.allLiq = this.allLiq.filter((e) => e.t > cut).slice(0, 400);
    try { localStorage.setItem('hlg_liqev_ALL', JSON.stringify(this.allLiq)); } catch (e) {}
    if (!this.lvT) this.lvT = setTimeout(() => { this.lvT = null; if (!this.paused()) this.setState({ lvTick: Date.now() }); }, 1200);
  }
  startLiqStreams() {
    const sym = this.coin.toUpperCase() + 'USDT';
    const mk = (url, subMsg, onMsg, slot) => {
      const conn = () => {
        if (this.deadWS) return;
        try {
          const ws = new WebSocket(url);
          this[slot] = ws;
          ws.onopen = () => { if (subMsg) (Array.isArray(subMsg) ? subMsg : [subMsg]).forEach((m) => { try { ws.send(m); } catch (e) {} }); this.setState({ lvTick: Date.now() }); };
          ws.onmessage = (msg) => { try { onMsg(JSON.parse(msg.data)); } catch (e) {} };
          ws.onclose = () => { this[slot] = null; this.setState({ lvTick: Date.now() }); if (!this.deadWS) this['rt' + slot] = setTimeout(conn, 6000); };
          ws.onerror = () => { try { ws.close(); } catch (e) {} };
        } catch (e) {}
      };
      conn();
    };
    // all-market force-order stream: every liquidation on every Binance perp
    mk('wss://fstream.binance.com/ws/!forceOrder@arr', null, (j) => {
      const o = j && j.o; if (!o) return;
      const px = parseFloat(o.ap || o.p), q = parseFloat(o.q);
      const side = o.S === 'SELL' ? 'long' : 'short';
      if (o.s === sym) this.addLiq('BIN', side, px, px * q, o.T);
      this.addLiqAll('BIN', String(o.s || '').replace(/USDT$/, '').replace(/^1000/, ''), side, px, px * q, o.T);
    }, 'wsB');
    // Bybit is the primary all-markets source (Binance data can be silently blocked):
    // subscribe allLiquidation for a basket of top perps, ≤10 topics per subscribe frame
    const basket = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'BNB', 'ADA', 'LINK', 'AVAX', 'LTC', '1000PEPE', 'OP', 'ARB', 'NEAR', 'APT', 'TIA', 'SEI', 'ENA', 'ZEC', 'HYPE', 'WIF', 'ONDO', 'TAO', 'AAVE'];
    if (!basket.includes(this.coin.toUpperCase())) basket.push(this.coin.toUpperCase());
    const args = basket.map((c) => 'allLiquidation.' + c + 'USDT');
    const frames = []; for (let i = 0; i < args.length; i += 10) frames.push(JSON.stringify({ op: 'subscribe', args: args.slice(i, i + 10) }));
    mk('wss://stream.bybit.com/v5/public/linear', frames, (j) => {
      if (!j || !Array.isArray(j.data)) return;
      j.data.forEach((d) => {
        const px = parseFloat(d.p), v = parseFloat(d.v);
        const side = d.S === 'Buy' ? 'short' : 'long';
        const s = String(d.s || (j.topic || '').split('.')[1] || '');
        if (s === sym) this.addLiq('BYB', side, px, px * v, d.T);
        this.addLiqAll('BYB', s.replace(/USDT$/, '').replace(/^1000/, ''), side, px, px * v, d.T);
      });
    }, 'wsY');
    this.pingY = setInterval(() => { try { if (this.wsY && this.wsY.readyState === 1) this.wsY.send('{"op":"ping"}'); } catch (e) {} }, 20000);
  }
  stopLiqStreams() {
    this.deadWS = true;
    ['wsB', 'wsY'].forEach((s) => { try { if (this[s]) this[s].close(); } catch (e) {} });
    clearTimeout(this.rtwsB); clearTimeout(this.rtwsY); clearInterval(this.pingY);
  }

  liveVals() {
    const all = this.loadAllLiq();
    // coin view = own per-coin stream + matching events from the all-markets store (deduped)
    const ev = (() => {
      const base = this.loadLiq();
      const fromAll = all.filter((e) => e.sym === this.coin.toUpperCase());
      if (!fromAll.length) return base;
      const seen = new Set(base.map((e) => Math.round(e.t / 1000) + '|' + e.usd));
      return base.concat(fromAll.filter((e) => !seen.has(Math.round(e.t / 1000) + '|' + e.usd))).sort((a, b) => b.t - a.t);
    })();
    let scope = this.state.liqScope;
    if (!scope) { try { scope = localStorage.getItem('hlg_liqscope') || 'all'; } catch (e) { scope = 'all'; } }
    const tape = scope === 'coin' ? ev : all;
    const CN = this.coin.toUpperCase();
    const G = '#3FE0A0', Rd = '#FF6B7A';
    const yOn = this.wsY && this.wsY.readyState === 1, bOn = this.wsB && this.wsB.readyState === 1;
    const ago = (t) => { const mn = Math.round((Date.now() - t) / 60000); return mn < 1 ? 'now' : mn < 60 ? mn + 'm' : mn < 1440 ? Math.round(mn / 60) + 'h' : Math.round(mn / 1440) + 'd'; };
    const setScope = (s) => { try { localStorage.setItem('hlg_liqscope', s); } catch (e) {} this.setState({ liqScope: s }); };
    const on = { bg: 'rgba(151,252,228,.12)', fg: '#97FCE4', bd: 'rgba(151,252,228,.28)' };
    const off = { bg: 'transparent', fg: '#7C9A91', bd: 'rgba(151,252,228,.1)' };
    const A = scope === 'all' ? on : off, K = scope === 'coin' ? on : off;
    const out = {
      lvDot: yOn ? '#3FE0A0' : '#F7C948',
      lvStatus: yOn ? 'LIVE · Bybit all-markets liquidation stream' + (bOn ? ' + Binance' : '') : 'CONNECTING · liquidation streams',
      lvHas: ev.length + tape.length > 0, lvEmpty: ev.length + tape.length === 0,
      lvNoCoin: ev.length === 0 && tape.length > 0,
      lvCount: tape.length, lvScopeLabel: scope === 'coin' ? CN : 'ALL MKTS', lvCoinName: CN,
      lvSetAll: () => setScope('all'), lvSetCoin: () => setScope('coin'),
      lvAllBg: A.bg, lvAllFg: A.fg, lvAllBd: A.bd, lvCoinBg: K.bg, lvCoinFg: K.fg, lvCoinBd: K.bd,
      lvLong: this.fmtK(tape.filter((e) => e.s === 'long').reduce((s, e) => s + e.usd, 0)),
      lvShort: this.fmtK(tape.filter((e) => e.s === 'short').reduce((s, e) => s + e.usd, 0)),
      lvTape: tape.slice(0, 40).map((e) => ({
        ex: e.ex, symTxt: e.sym || CN, sideTxt: e.s === 'long' ? 'LONG' : 'SHORT', sideColor: e.s === 'long' ? Rd : G,
        usdStr: '$' + this.fmtK(e.usd), pxStr: '$' + this.fmtPrice(e.px), ago: ago(e.t),
      })),
      lvBars: [], lvXLabels: [], lvCurX: 500,
    };
    if (ev.length) {
      const m = this.T.price;
      let lo = Math.min(...ev.map((e) => e.px), m), hi = Math.max(...ev.map((e) => e.px), m);
      const pad = (hi - lo) * 0.08 || m * 0.005; lo -= pad; hi += pad;
      const n = 40, span = hi - lo, W = 1000, Hh = 240;
      const B = []; for (let i = 0; i < n; i++) B.push({ l: 0, s: 0 });
      ev.forEach((e) => { const i = Math.max(0, Math.min(n - 1, Math.floor((e.px - lo) / span * n))); B[i][e.s === 'long' ? 'l' : 's'] += e.usd; });
      const mx = Math.max(...B.map((b) => b.l + b.s), 1);
      const bw = W / n * 0.72;
      B.forEach((b, i) => {
        const cx = (i + 0.5) / n * W; let y = Hh;
        if (b.l > 0) { const h = b.l / mx * (Hh - 10); y -= h; out.lvBars.push({ x: +(cx - bw / 2).toFixed(1), y: +y.toFixed(1), w: +bw.toFixed(1), h: +h.toFixed(1), fill: Rd }); }
        if (b.s > 0) { const h = b.s / mx * (Hh - 10); y -= h; out.lvBars.push({ x: +(cx - bw / 2).toFixed(1), y: +y.toFixed(1), w: +bw.toFixed(1), h: +h.toFixed(1), fill: G }); }
      });
      out.lvXLabels = [0, 1, 2, 3, 4].map((k) => this.fmtAxisPrice(lo + span * k / 4));
      out.lvCurX = +(((m - lo) / span) * W).toFixed(1);
    }
    return out;
  }

  // ---- trade detail popup ----
  popupVals() {
    const md = this.state.modal;
    if (!md) return { pmShow: false };
    const G = '#3FE0A0', Rd = '#FF6B7A', B = '#8FC0F0', Y = '#F2B33D';
    const P = (v) => '$' + this.fmtPrice(v);
    const money = (v) => (v < 0 ? '−$' : '+$') + Math.abs(v).toFixed(2);
    const dir = md.side === 'LONG' ? 1 : -1;
    const isOpen = md.kind === 'open';
    const mark = isOpen ? (md.coin === this.coin ? this.T.price : (this.mids && this.mids[md.coin]) || md.entry) : md.exit;
    let pnl = isOpen ? md.margin * (md.lev || 10) * ((mark / md.entry - 1) * dir) : (md.pnl || 0);
    if (pnl < -md.margin) pnl = -md.margin;
    const cm = this.state.costMode !== 'gross';
    const cst = isOpen
      ? this.estCosts(md, null, Date.now())
      : (md.fees != null
        ? { fees: md.fees, slip: md.slip || 0, fund: md.fund || 0, total: (md.fees || 0) + (md.slip || 0) + (md.fund || 0) }
        : this.estCosts({ margin: md.margin, lev: md.lev, side: md.side, fr: md.fr, t0: md.ot || md.t }, md.outcome, md.t));
    if (cm) {
      pnl = (!isOpen && md.pnlNet != null) ? md.pnlNet : pnl - cst.total;
      if (pnl < -md.margin) pnl = -md.margin;
    }
    const roi = md.margin ? pnl / md.margin * 100 : 0;
    const move = (mark / md.entry - 1) * 100;
    const usdMode = this.state.pnlDisp !== 'pct';
    const ago = (t) => { const mn = Math.round((Date.now() - t) / 60000); return mn < 1 ? 'just now' : mn < 60 ? mn + 'm ago' : mn < 1440 ? Math.round(mn / 60) + 'h ago' : Math.round(mn / 1440) + 'd ago'; };
    const setDisp = (v) => { try { localStorage.setItem('hlg_pnl_disp', v); } catch (e) {} this.setState({ pnlDisp: v }); };
    return {
      pmShow: true,
      pmClose: () => this.setState({ modal: null }),
      pmStop: (e) => e.stopPropagation(),
      pmSide: md.side, pmSideColor: dir > 0 ? G : Rd, pmSideOn: dir > 0 ? '#0a1614' : '#fff',
      pmCoin: md.coin + '-PERP',
      pmHlUrl: 'https://app.hyperliquid.xyz/trade/' + md.coin,
      pmStatus: isOpen ? 'OPEN' : md.outcome === 'tp' ? 'TP HIT' : md.outcome === 'tp1' ? 'TP1 — HALF BANKED' : md.outcome === 'rat' ? 'RATCHET STOP · PROFIT' : md.outcome === 'sl' ? 'SL HIT' : md.outcome === 'be' ? 'BREAKEVEN STOP' : md.outcome === 'time' ? 'TIME STOP' : 'REVERSAL CLOSE',
      pmStatusColor: isOpen ? B : (md.outcome === 'tp' || md.outcome === 'tp1' || md.outcome === 'rat') ? G : md.outcome === 'sl' ? Rd : (md.outcome === 'be' || md.outcome === 'time') ? B : Y,
      pmStatusBg: isOpen ? 'rgba(143,192,240,.12)' : (md.outcome === 'tp' || md.outcome === 'tp1' || md.outcome === 'rat') ? 'rgba(63,224,160,.12)' : md.outcome === 'sl' ? 'rgba(255,107,122,.12)' : 'rgba(242,179,61,.12)',
      pmKindLbl: (isOpen ? 'UNREALISED P&L (UPNL)' : 'REALISED P&L') + (cm ? ' · NET OF COSTS' : ' · GROSS'),
      pmCosts: cm
        ? 'est. costs −$' + cst.total.toFixed(2) + ' — fees $' + cst.fees.toFixed(2) + ' · slippage $' + cst.slip.toFixed(2) + ' · funding ' + (cst.fund >= 0 ? '$' + cst.fund.toFixed(2) : '−$' + Math.abs(cst.fund).toFixed(2) + ' (earned)')
        : 'gross mode — exchange fees, slippage & funding excluded',
      pmBig: usdMode ? money(pnl) : (roi >= 0 ? '+' : '−') + Math.abs(roi).toFixed(2) + '%',
      pmBigColor: pnl >= 0 ? G : Rd,
      pmMove: (move >= 0 ? '▲ price up +' : '▼ price down −') + Math.abs(move).toFixed(2) + '% since entry',
      pmMoveColor: move >= 0 ? G : Rd,
      pmSetUsd: () => setDisp('usd'), pmSetPct: () => setDisp('pct'),
      pmUBg: usdMode ? 'rgba(151,252,228,.14)' : 'transparent', pmUCol: usdMode ? '#97FCE4' : '#7C9A91',
      pmPBg: usdMode ? 'transparent' : 'rgba(151,252,228,.14)', pmPCol: usdMode ? '#7C9A91' : '#97FCE4',
      pmEntry: P(md.entry), pmNowLbl: isOpen ? 'MARK (LIVE)' : 'EXIT', pmNow: P(mark),
      pmTp: md.target ? P(md.target) : '—', pmSl: md.stop ? P(md.stop) : '—',
      pmTp1: (() => { const r0 = md.risk0 || (md.target ? Math.abs(md.target - md.entry) / 2.2 : 0); return r0 ? P(md.entry + 1.2 * r0 * dir) : '—'; })(),
      pmTp1Lbl: 'TP1 · BANK HALF' + ((md.tp1 || (md.hiR || 0) >= 1.2 || md.outcome === 'tp' || md.outcome === 'tp1' || md.outcome === 'rat') ? ' — ✓ HIT' : ''),
      pmTp1LblColor: (md.tp1 || (md.hiR || 0) >= 1.2 || md.outcome === 'tp' || md.outcome === 'tp1' || md.outcome === 'rat') ? '#3FE0A0' : '#5f7a72',
      pmTpLbl: 'TP2 · FULL' + (md.outcome === 'tp' ? ' — ✓ HIT' : ''),
      pmTpLblColor: md.outcome === 'tp' ? '#3FE0A0' : '#5f7a72',
      pmNotional: '$' + (md.margin * (md.lev || 10)).toFixed(2),
      pmLev: 'STRATEGY ' + (md.v === 5 ? 'V5' : 'V4') + ' · ' + (md.lev || 10) + 'x leverage' + (md.conv ? ' · opened at ' + md.conv + '% conviction' : '') + (md.src === 'scan' ? ' · by background scanner' : ''),
      pmTime: isOpen ? 'opened ' + ago(md.t0) : 'closed ' + ago(md.t),
    };
  }

  procBook() {
    const bk = this.state.book;
    if (!bk || !bk.bids || !bk.bids.length) return null;
    const N = 9;
    // infer tick size from adjacent levels so every price label is distinct
    const diffs = [];
    [bk.bids, bk.asks].forEach((ls) => { for (let i = 1; i < Math.min(ls.length, N); i++) { const d = Math.abs(parseFloat(ls[i].px) - parseFloat(ls[i - 1].px)); if (d > 0) diffs.push(d); } });
    const tick = diffs.length ? Math.min(...diffs) : 0.01;
    const dec = Math.min(6, Math.max(2, Math.ceil(-Math.log10(tick)) + (tick.toString().includes('5') ? 1 : 0)));
    const fmtPx = (p) => p >= 1000 ? p.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : p.toFixed(dec);
    const mkRows = (levels, isBid) => {
      const rows = levels.slice(0, N).map((l) => ({ px: parseFloat(l.px), sz: parseFloat(l.sz), ntl: parseFloat(l.px) * parseFloat(l.sz) }));
      const med = rows.map((r) => r.ntl).sort((a, b) => a - b)[Math.floor(rows.length / 2)] || 1;
      const maxN = Math.max(...rows.map((r) => r.ntl), 1);
      return rows.map((r) => ({
        px: fmtPx(r.px), rawPx: r.px, rawNtl: r.ntl,
        ntl: '$' + this.fmtK(r.ntl),
        pct: Math.max(3, Math.round(r.ntl / maxN * 100)),
        wall: r.ntl > med * 3 ? (isBid ? ' ▮' : '▮ ') : '',
        rowBg: r.ntl > med * 3 ? (isBid ? 'rgba(43,196,138,.07)' : 'rgba(232,80,91,.07)') : 'transparent',
      }));
    };
    const bids = mkRows(bk.bids, true), asks = mkRows(bk.asks, false);
    const bidTot = bids.reduce((s, r) => s + r.rawNtl, 0), askTot = asks.reduce((s, r) => s + r.rawNtl, 0);
    const bidPct = Math.round(bidTot / (bidTot + askTot) * 100);
    const spread = asks[0].rawPx - bids[0].rawPx;
    const bigBid = bids.reduce((a, b) => b.rawNtl > a.rawNtl ? b : a, bids[0]);
    const bigAsk = asks.reduce((a, b) => b.rawNtl > a.rawNtl ? b : a, asks[0]);
    return {
      obBids: bids, obAsks: asks,
      bidTotStr: this.fmtK(bidTot), askTotStr: this.fmtK(askTot),
      bidPct, askPct: 100 - bidPct,
      spreadStr: fmtPx(spread) + ' (' + (spread / bids[0].rawPx * 100).toFixed(3) + '%)',
      supportStr: bigBid.px + ' · ' + bigBid.ntl,
      resistStr: bigAsk.px + ' · ' + bigAsk.ntl,
    };
  }

  // ---- live data ----
  async fetchData() {
    if ((this.props.liveData ?? true) === false) return;
    try {
      const r = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
      });
      const [meta, ctxs] = await r.json();
      meta.universe.forEach((u) => { if (+u.maxLeverage > 0) this.maxLev[u.name] = +u.maxLeverage; });
      const idx = meta.universe.findIndex((u) => u.name === this.coin);
      if (idx >= 0) {
        const c = ctxs[idx];
        const mark = parseFloat(c.markPx), prev = parseFloat(c.prevDayPx);
        if (mark > 0) {
          this.T.price = mark;
          this.T.change = ((mark - prev) / prev) * 100;
          this.T.funding = parseFloat(c.funding) * 100;
          this.T.oi = (parseFloat(c.openInterest) * mark) / 1e6;
          this.T.vol = parseFloat(c.dayNtlVlm) / 1e9;
          this.setState({ dataLive: true, liveDelta: 0 });
          this.rebuildHeat();
        }
      }
    } catch (e) { this.setState({ dataLive: false }); }
    try {
      const r3 = await fetch('https://api.alternative.me/fng/?limit=1');
      const f = await r3.json();
      const v = parseInt(f.data[0].value, 10);
      if (!isNaN(v)) this.T.fng = v;
    } catch (e) {}
    try {
      const mr = await fetch('https://api.hyperliquid.xyz/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"type":"allMids"}' });
      const midsRaw = await mr.json();
      if (midsRaw && typeof midsRaw === 'object') {
        this.mids = {};
        Object.keys(midsRaw).forEach((k) => { const v = parseFloat(midsRaw[k]); if (v > 0) this.mids[k] = v; });
      }
    } catch (e) {}
    try {
      const tr = await fetch('https://apihyperliquid.github.io/api/openTrades.json');
      const all = await tr.json();
      this.coinTrades = all.filter((t) => t.coin === this.coin);
      this.rebuildHeat();
    } catch (e) {}
    try {
      const sg = await fetch('https://apihyperliquid.github.io/api/signalOpenScore.json').then((r) => r.json());
      this.sig = (sg.signals || []).find((s) => s.coin === this.coin) || null;
    } catch (e) {}
    try {
      const r = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'l2Book', coin: this.coin }),
      });
      const j = await r.json();
      if (j && j.levels) this.setState({ book: { bids: j.levels[0], asks: j.levels[1] } });
    } catch (e) {}
    let raw = null;
    try { raw = this.computeRec(this.procBook()); this.manageRec(raw); } catch (e) {}
    try { this.managePaper(raw); } catch (e) {} // closes must run even if the verdict errors
    try { this.managePaper5(raw); } catch (e) {} // V5 book runs in parallel on its own wallet
    try { this.managePaper5(raw); } catch (e) {} // V5 book runs in parallel on its own wallet
    this.forceUpdate();
  }

  componentDidMount() {
    if (this.noCoin) { this.setState({ bootDone: true }); return; } // picker showing — no timers, no fetches, no sockets
    // hedge view is a direct-link destination — skip the splash so the board is there immediately
    if (this.hedgeDeep) this.setState({ bootDone: true });
    else setTimeout(() => this.setState({ bootDone: true }), 2450); // mascot preloader
    this.rebuildHeat();
    const im = document.getElementById('assetIcon');
    if (im) { const u = this.icon(this.coin); if (u) { im.onload = () => { im.style.display = 'block'; }; im.onerror = () => { im.style.display = 'none'; }; im.src = u; } }
    const countUp = (this.props.countUp ?? true) && !this.paused(); // skip the per-frame count-up while the signals overlay hides the board
    if (!countUp) { this.setState({ p: 1 }); this.startLive(); }
    else {
      const start = performance.now(), dur = 1500;
      const loop = (t) => {
        const k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
        this.setState({ p: e });
        if (k < 1) this.raf = requestAnimationFrame(loop);
        else this.startLive();
      };
      this.raf = requestAnimationFrame(loop);
    }
    this.fetchData();
    this.poll = setInterval(() => { if (!document.hidden) this.fetchData(); }, 12000);
    this.startLiqStreams();
    this.scan();
    this.scanId = setInterval(() => { if (!document.hidden) this.scan(); }, 60000);
    this.hedgeScan();
    this.hedgeId = setInterval(() => { if (!document.hidden) this.hedgeScan(); }, 60000);
    this.aiT0 = setTimeout(() => this.aiLiqRead(), 9000); // first read once live data has landed
    this.aiId = setInterval(() => { if (!document.hidden) this.aiLiqRead(); }, 90000);
    if (this.state.trTab === 'an') this.startAnAnim();
    this.tickClock();
    this.clockId = setInterval(() => this.tickClock(), 1000);
    // mascot rig: trots in (~7s), sits, then loops random moods; pupils follow the cursor
    this._catSitT = setTimeout(() => this.scheduleMood(), 7400);
    window.addEventListener('mousemove', this.onCatMouse);
  }

  // true while the full-screen Signals/Hedge overlay hides this board, or the tab is in background —
  // every tick-driven setState is skipped then, so the 40-card signals view never gets re-render storms from the parent.
  paused() { return document.hidden; }

  tickClock() {
    if (this.paused()) return;
    const d = new Date(), z = (n) => String(n).padStart(2, '0');
    this.setState({ clock: z(d.getUTCHours()) + ':' + z(d.getUTCMinutes()) + ':' + z(d.getUTCSeconds()) + ' UTC' });
  }

  startLive() {
    if ((this.props.liveTicking ?? true) === false) return;
    this.live = setInterval(() => {
      if (this.paused()) return;
      const d = (Math.random() - 0.5) * 0.0006 * this.T.price;
      const cap = 0.0015 * this.T.price;
      this.setState((s) => ({ liveDelta: Math.max(-cap, Math.min(cap, s.liveDelta * 0.7 + d)), flash: d >= 0 ? 'up' : 'down' }));
      clearTimeout(this.ft);
      this.ft = setTimeout(() => this.setState({ flash: '' }), 380);
    }, 1700);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    clearInterval(this.live); clearInterval(this.clockId); clearInterval(this.poll);
    clearTimeout(this.ft);
    this.stopLiqStreams();
    clearInterval(this.scanId); clearInterval(this.hedgeId);
    clearInterval(this.aiId); clearTimeout(this.aiT0);
    cancelAnimationFrame(this.anRaf2);
    clearTimeout(this._catSitT); clearTimeout(this._moodT); clearTimeout(this._moodClr);
    cancelAnimationFrame(this._pupRaf);
    window.removeEventListener('mousemove', this.onCatMouse);
  }

  renderVals() {
    // the signals board is its own page now — navigating avoids the nested-mount freeze entirely
    const sigNav = {
      pickerShow: this.noCoin,
      openSignals: () => { location.href = 'signal-dashboard.html'; },
      hedgeOpen: this.state.hedgeOpen != null ? !!this.state.hedgeOpen : new URLSearchParams(location.search).get('view') === 'hedge',
      openHedge: () => this.setState({ hedgeOpen: true }),
      closeHedge: () => this.setState({ hedgeOpen: false }),
      hedgeToSignals: () => { location.href = 'signal-dashboard.html'; },
      hedgeBackLabel: '✕ ' + this.coin + ' PERPS BOARD',
      backLabel: '✕ ' + this.coin + ' PERPS BOARD',
    };
    const p = this.state.p;
    const price = this.T.price * p + this.state.liveDelta;
    const change = this.T.change * p;
    const fngVal = Math.round(this.T.fng * p);

    let fngLabel = 'NEUTRAL', fngColor = '#F7C948';
    if (fngVal >= 75) { fngLabel = 'EXTREME GREED'; fngColor = '#3FE0A0'; }
    else if (fngVal >= 55) { fngLabel = 'GREED'; fngColor = '#3FE0A0'; }
    else if (fngVal >= 45) { fngLabel = 'NEUTRAL'; fngColor = '#F7C948'; }
    else if (fngVal >= 25) { fngLabel = 'FEAR'; fngColor = '#FF6B7A'; }
    else { fngLabel = 'EXTREME FEAR'; fngColor = '#FF6B7A'; }
    const fngBg = fngColor === '#3FE0A0' ? 'rgba(63,224,160,.12)' : fngColor === '#FF6B7A' ? 'rgba(255,107,122,.12)' : 'rgba(247,201,72,.14)';

    const priceColor = this.state.flash === 'up' ? '#3FE0A0' : this.state.flash === 'down' ? '#FF6B7A' : '#E9FBF5';
    const up = change >= 0;
    const h = this.state.heat || {};
    const m = this.T.price, dd = m < 0.1 ? 6 : m < 10 ? 4 : 2;
    const C = this.coin;
    const bookOut = this.procBook();
    const hb = (h.buckets && this.state.hoverIdx != null) ? h.buckets[this.state.hoverIdx] : null;
    const { z: hmZv, vbW, vbX } = this.hmWin();
    const mp = (cx) => +(((cx - vbX) / vbW) * 100).toFixed(2);
    const tipW = this.state.tipW || 600;
    const tipLeft = hb ? Math.max(4, Math.min(this.state.tipX + 14, tipW - 212)) : 0;
    const tipTop = hb ? Math.max(4, Math.min(this.state.tipY - 6, 168)) : 0;

    return {
      ...sigNav,
      ...this.hedgeVals(),
      priceStr: this.fmtPrice(price),
      priceColor,
      symbolStr: C + '-PERP',
      logoLetter: C.charAt(0),
      pairStr: C + ' / USDC · Hyperliquid Perp',
      changeStr: Math.abs(change).toFixed(2),
      changeArrow: up ? '▲' : '▼',
      changeColor: up ? '#3FE0A0' : '#FF6B7A',
      changeBg: up ? 'rgba(63,224,160,.12)' : 'rgba(255,107,122,.12)',
      changeBorder: up ? 'rgba(63,224,160,.25)' : 'rgba(255,107,122,.25)',
      fundingStr: (this.T.funding * p).toFixed(4),
      fundingColor: this.T.funding >= 0 ? '#3FE0A0' : '#FF6B7A',
      oiStr: (this.T.oi * p).toFixed(1),
      volStr: (this.T.vol * p).toFixed(2),
      fngStr: String(fngVal),
      fngLabel, fngColor, fngBg,
      fngPct: fngVal,
      needleDeg: -90 + (fngVal / 100) * 180,
      arcOffset: 339.29 * (1 - fngVal / 100),
      clock: this.state.clock,
      liveDot: this.state.dataLive ? '#3FE0A0' : '#F7C948',
      liveLabel: this.state.dataLive ? 'LIVE' : 'SIM',
      srcLabel: this.state.dataLive ? 'Live marks · Hyperliquid · open positions · apihyperliquid · Fear/Greed index' : 'Simulated data (live feed unavailable)',
      bars: h.rects,
      longLine: h.longLine, longFill: h.longFill, shortLine: h.shortLine, shortFill: h.shortFill,
      curX: h.curX, curXPct: h.curX != null ? mp(h.curX) : h.curXPct,
      vbBox: vbX + ' 0 ' + vbW + ' 300',
      hmWheel: this.hmWheel, hmDown: this.hmDown, hmUp: this.hmUp, hmReset: this.hmReset,
      hmZoomLbl: hmZv > 1 ? hmZv.toFixed(1) + '× zoom · drag to pan · double-click resets' : 'scroll to zoom · drag to pan',
      bandLeft: hb && h.n ? mp(hb.cx - 500 / h.n) : 0,
      bandW: h.n ? (1000 / h.n / vbW) * 100 : 0,
      hovDotTop: hb && hb.dotY != null ? +(hb.dotY / 3).toFixed(2) : 0,
      hovDotColor: hb ? (hb.isLong ? '#E8505B' : '#2BC48A') : '#97FCE4',
      supPulseA: (h.curX != null && Math.abs(h.curX - h.supX) < 70) ? 'hmPulseG 1.5s ease-in-out infinite' : 'none',
      resPulseA: (h.curX != null && Math.abs(h.curX - h.resX) < 70) ? 'hmPulseR 1.5s ease-in-out infinite' : 'none',
      leftAxis: h.leftAxis, rightAxis: h.rightAxis, gridY: h.gridY,
      xLabels: h.low != null ? [0, 1, 2, 3, 4, 5].map((k) => this.fmtAxisPrice(h.low + h.span * ((vbX + vbW * k / 5) / 1000))) : h.xLabels,
      longWall: h.longWall, shortWall: h.shortWall,
      supX: h.supX, resX: h.resX, supXPct: h.supX != null ? mp(h.supX) : h.supXPct, resXPct: h.resX != null ? mp(h.resX) : h.resXPct,
      supZX: h.supZX, supZW: h.supZW, resZX: h.resZX, resZW: h.resZW,
      supPill: h.supPill, resPill: h.resPill,
      supPrice: h.supPrice, resPrice: h.resPrice, supRange: h.supRange, resRange: h.resRange,
      onHover: this.onHover, onLeave: this.onLeave,
      showModel: this.state.heatSrc !== 'cg' && this.state.heatSrc !== 'live',
      showLive: this.state.heatSrc === 'live',
      showCG: this.state.heatSrc === 'cg',
      tabMBg: (this.state.heatSrc !== 'cg' && this.state.heatSrc !== 'live') ? 'rgba(151,252,228,.14)' : 'transparent',
      tabMCol: (this.state.heatSrc !== 'cg' && this.state.heatSrc !== 'live') ? '#97FCE4' : '#7C9A91',
      tabLBg: this.state.heatSrc === 'live' ? 'rgba(151,252,228,.14)' : 'transparent',
      tabLCol: this.state.heatSrc === 'live' ? '#97FCE4' : '#7C9A91',
      tabCBg: this.state.heatSrc === 'cg' ? 'rgba(151,252,228,.14)' : 'transparent',
      tabCCol: this.state.heatSrc === 'cg' ? '#97FCE4' : '#7C9A91',
      setSrcModel: () => { try { localStorage.setItem('perps-heat-src', 'model'); } catch (e) {} this.setState({ heatSrc: 'model' }); },
      setSrcLive: () => { try { localStorage.setItem('perps-heat-src', 'live'); } catch (e) {} this.setState({ heatSrc: 'live' }); },
      setSrcCG: () => { try { localStorage.setItem('perps-heat-src', 'cg'); } catch (e) {} this.setState({ heatSrc: 'cg' }); },
      cgRefresh: () => this.setState({ cgBust: Date.now() }),
      cgUrl: 'https://www.coinglass.com/pro/futures/LiquidationHeatMap?coin=' + C + '&type=symbol',
      cgSrc: 'https://www.coinglass.com/pro/futures/LiquidationHeatMap?coin=' + C + '&type=symbol' + (this.state.cgBust ? '&r=' + this.state.cgBust : ''),
      symbolCG: C + ' · symbol view',
      ...(bookOut || { obBids: [], obAsks: [], bidTotStr: '—', askTotStr: '—', bidPct: 50, askPct: 50, spreadStr: '—', supportStr: 'loading…', resistStr: 'loading…' }),
      ...(this.computeRec(bookOut) || { vWord: 'COMPUTING', vArrow: '…', vColor: '#7C9A91', vTextOn: '#0a1614', vBorder: 'rgba(151,252,228,.12)', vConv: 0, vEntry: '—', vTarget: '—', vTargetPct: '—', vStop: '—', vStopPct: '—', vLiq: '—', vR: '—', vStopLev: '—', vFactors: [], vWhy: 'Waiting for live positioning, order book and liquidation data…' }),
      vSince: '—',
      ...(this.lockVals() || {}),
      ...this.trackVals(),
      ...this.liveVals(),
      ...this.popupVals(),
      kmShow: !!this.state.keyModal,
      kmOpen: () => this.setState({ keyModal: true }),
      kmClose: () => { this.setState({ keyModal: false }); this.kmDropOpen = false; },
      kmStop: (e) => e.stopPropagation(),
      kmType: (e) => { this.keyTmp = (e.target.value || '').trim(); this.forceUpdate(); },
      kmModelType: (e) => { this.modelTmp = (e.target.value || '').trim(); this.forceUpdate(); },
      kmKeyVal: this.keyTmp !== undefined ? this.keyTmp : this.keyFor(this.kmSel()),
      kmModelVal: this.modelTmp !== undefined ? this.modelTmp : this.modelFor(this.kmSel()),
      kmCurModelLabel: (() => {
        const p = this.kmSel();
        const cur = this.modelTmp !== undefined ? this.modelTmp : this.modelFor(p);
        const list = (window.HYPURR_MODELS && window.HYPURR_MODELS[p]) || [];
        const match = list.find(m => m.id === cur);
        return match ? match.label : (cur || this.defModel(p));
      })(),
      kmDropOpen: !!this.kmDropOpen,
      kmToggleDrop: () => { this.kmDropOpen = !this.kmDropOpen; this.forceUpdate(); },
      kmModelPills: (() => {
        const p = this.kmSel();
        const cur = (this.modelTmp !== undefined ? this.modelTmp : this.modelFor(p)) || this.defModel(p);
        const list = (window.HYPURR_MODELS && window.HYPURR_MODELS[p]) || [];
        return list.map(m => {
          const active = m.id === cur;
          return {
            id: m.id,
            name: m.name,
            label: m.label,
            tag: m.tag,
            active,
            bg: active ? '#97FCE4' : 'rgba(255,255,255,.05)',
            col: active ? '#08130f' : '#9CB8AF',
            border: active ? '#97FCE4' : 'rgba(151,252,228,.14)',
            pick: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              this.modelTmp = m.id;
              this.kmDropOpen = false;
              this.forceUpdate();
            }
          };
        });
      })(),
      kmBadgeText: this.apiKey() ? (this.kmSel().toUpperCase() + ': ' + this.aiModel()) : 'CONNECT AI KEY',
      kmSave: () => {
        const p = this.kmSel();
        const rawKey = this.keyTmp !== undefined ? this.keyTmp : this.keyFor(p);
        const v = (rawKey || '').trim().replace(/^["'\s]+|["'\s]+$/g, '');
        const rawModel = this.modelTmp !== undefined ? this.modelTmp : this.modelFor(p);
        const m = (rawModel || '').trim() || this.defModel(p);
        if (!v) {
          this.kmTesting = 'Please enter an API key first.';
          this.forceUpdate();
          return;
        }
        try {
          localStorage.setItem('hlg_ai_key', v);
          localStorage.setItem('hlg_ai_key_' + p, v);
          localStorage.setItem('hlg_ai_provider', p);
          localStorage.setItem('hlg_ai_model', m);
          localStorage.setItem('hlg_ai_model_' + p, m);
          if (p === 'anthropic') localStorage.setItem('hlg_anthropic_key', v);
        } catch (e) {}
        this.keyTmp = undefined;
        this.modelTmp = undefined;
        this.kmDropOpen = false;
        this.ai = null;
        this.aiErr = null;
        this.kmRunTest();
      },
      kmTest: () => {
        const p = this.kmSel();
        const rawKey = this.keyTmp !== undefined ? this.keyTmp : this.keyFor(p);
        const v = (rawKey || '').trim().replace(/^["'\s]+|["'\s]+$/g, '');
        const rawModel = this.modelTmp !== undefined ? this.modelTmp : this.modelFor(p);
        const m = (rawModel || '').trim() || this.defModel(p);
        if (v) {
          try {
            localStorage.setItem('hlg_ai_key', v);
            localStorage.setItem('hlg_ai_key_' + p, v);
            localStorage.setItem('hlg_ai_provider', p);
            localStorage.setItem('hlg_ai_model', m);
            localStorage.setItem('hlg_ai_model_' + p, m);
          } catch (e) {}
        }
        this.kmRunTest();
      },
      kmRemove: () => {
        const p = this.kmSel();
        try {
          localStorage.removeItem('hlg_ai_key');
          localStorage.removeItem('hlg_ai_key_' + p);
          localStorage.removeItem('hlg_anthropic_key');
          localStorage.removeItem('hlg_ai_provider');
          localStorage.removeItem('hlg_ai_model');
          localStorage.removeItem('hlg_ai_model_' + p);
        } catch (e) {}
        this.ai = null;
        this.aiErr = 'nokey';
        this.kmTesting = null;
        this.keyTmp = '';
        this.modelTmp = undefined;
        this.kmDropOpen = false;
        this.forceUpdate();
      },
      kmStatus: this.hasHostAI() 
        ? 'This workspace has built-in Claude — no key needed here.' 
        : this.kmTesting === 'testing' 
        ? 'Connecting & testing ' + (this.aiModel()) + '…' 
        : this.kmTesting === 'ok' 
        ? '✓ Connected — ' + this.kmSel().toUpperCase() + ' (' + this.aiModel() + ') is ready.' 
        : (typeof this.kmTesting === 'string' && this.kmTesting) 
        ? '✗ ' + this.kmTesting 
        : (this.apiKey() ? 'A ' + this.kmSel().toUpperCase() + ' key is saved in this browser.' : 'No key saved in this browser yet.'),
      kmStatusCol: this.kmTesting === 'ok' ? '#3FE0A0' : this.kmTesting === 'testing' ? '#F7C948' : (typeof this.kmTesting === 'string' && this.kmTesting) ? '#FF6B7A' : '#7C9A91',
      kmProv: this.kmSel(),
      kmSetA: () => this.setKmProv('anthropic'),
      kmSetO: () => this.setKmProv('openai'),
      kmSetG: () => this.setKmProv('gemini'),
      kmSetR: () => this.setKmProv('openrouter'),
      kmABg: this.kmSel() === 'anthropic' ? 'rgba(151,252,228,.14)' : 'transparent', kmACol: this.kmSel() === 'anthropic' ? '#97FCE4' : '#7C9A91',
      kmOBg: this.kmSel() === 'openai' ? 'rgba(151,252,228,.14)' : 'transparent', kmOCol: this.kmSel() === 'openai' ? '#97FCE4' : '#7C9A91',
      kmGBg: this.kmSel() === 'gemini' ? 'rgba(151,252,228,.14)' : 'transparent', kmGCol: this.kmSel() === 'gemini' ? '#97FCE4' : '#7C9A91',
      kmRBg: this.kmSel() === 'openrouter' ? 'rgba(151,252,228,.14)' : 'transparent', kmRCol: this.kmSel() === 'openrouter' ? '#97FCE4' : '#7C9A91',
      kmDesc: (this.kmSel() === 'openai' ? 'Get a key at platform.openai.com → API keys.' : this.kmSel() === 'gemini' ? 'Get a free key at aistudio.google.com → Get API key.' : this.kmSel() === 'openrouter' ? 'Get a key at openrouter.ai → Keys.' : 'Create a key at console.anthropic.com → API Keys.') + ' Key is stored locally in THIS browser only.',
      kmPh: this.kmSel() === 'openai' ? 'sk-…' : this.kmSel() === 'gemini' ? 'AIza…' : this.kmSel() === 'openrouter' ? 'sk-or-…' : 'sk-ant-…',
      kmModelPh: 'model identifier — default: ' + this.defModel(this.kmSel()),
      hoverX: hb ? hb.cx : 0, hoverVis: hb ? '' : 'display:none',
      hoverXPct: hb ? hb.cx / 10 : 0, tipVis: hb ? 'visible' : 'hidden', tipOp: hb ? 1 : 0,
      tipDisplay: hb ? 'block' : 'none', tipLeft, tipTop,
      tipPrice: hb ? this.fmtPrice(hb.price) : '',
      tipLong: hb ? this.fmtK(hb.cumLong) : '', tipShort: hb ? this.fmtK(hb.cumShort) : '',
      tip10: hb ? this.fmtK(hb.t10) : '', tip25: hb ? this.fmtK(hb.t25) : '', tip50: hb ? this.fmtK(hb.t50) : '',
      lEntry: '$' + (m * 0.988).toFixed(dd) + ' – $' + (m * 1.006).toFixed(dd),
      lTarget: (m * 1.076).toFixed(dd), lStop: (m * 0.96).toFixed(dd),
      sEntry: '$' + (m * 1.036).toFixed(dd) + ' – $' + (m * 1.052).toFixed(dd),
      sTarget: (m * 0.908).toFixed(dd), sStop: (m * 1.03).toFixed(dd),
    };
  }
}