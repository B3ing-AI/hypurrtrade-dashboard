class Component extends DCLogic {
  flipping = false;

  navUrl() {
    const a = this.props.asset || {};
    return 'prep-dashboard.html?coin=' + encodeURIComponent(a.sym || 'SUI');
  }

  componentDidMount() {
    // if the browser restores this page from bfcache after a flip-navigation, un-flip
    this.onShow = () => {
      this.flipping = false;
      if (this.tiltEl) {
        this.tiltEl.style.transition = 'transform .2s ease-out';
        this.tiltEl.style.transform = 'none';
      }
    };
    window.addEventListener('pageshow', this.onShow);
  }
  componentWillUnmount() { window.removeEventListener('pageshow', this.onShow); }

  renderVals() {
    const a = this.props.asset || {};
    const view = this.props.view || 'score';
    const bias = this.props.bias || 'positional';
    const d = (bias === 'intraday' ? a.intra : a.pos) || {};
    const bearPct = Math.round(view === 'users' ? (d.bearUsers || 0) : (d.bearScore || 0));
    const bear = bearPct >= 50;
    const pct = bear ? bearPct : 100 - bearPct;
    const accent = bear ? '#FF6B7A' : '#3FE0A0';

    const circ = 339.292, gap = 16;
    const bearLen = Math.max(0.1, (bearPct / 100) * circ - gap);
    const bullLen = Math.max(0.1, ((100 - bearPct) / 100) * circ - gap);

    const active = (on) => on ? '#97FCE4' : 'transparent';
    const activeT = (on) => on ? '#08130f' : '#7C9A91';
    const sym = a.sym || '?';
    const cb = (key, val) => (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } this.props.onToggle && this.props.onToggle(sym, key, val); };
    const ch = a.change || 0;

    return {
      onTilt: (e) => {
        const el = this.tiltEl = e.currentTarget;
        if (this.flipping) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'rotateY(' + (px * 8).toFixed(2) + 'deg) rotateX(' + (-py * 6).toFixed(2) + 'deg)';
      },
      onTiltOut: (e) => {
        const el = this.tiltEl = e.currentTarget;
        if (this.flipping) return;
        el.style.transform = 'rotateY(0deg) rotateX(0deg)';
      },
      onFlip: (e) => {
        const el = this.tiltEl = e.currentTarget;
        if (this.flipping) return;
        this.flipping = true;
        el.style.transition = 'transform .72s cubic-bezier(.5,0,.15,1)';
        el.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
          if (this.props.onNav) { this.props.onNav((this.props.asset || {}).sym || 'SUI'); this.flipping = false; el.style.transition = 'none'; el.style.transform = 'none'; }
          else location.href = this.navUrl();
        }, 700);
      },
      iconUrl: a.icon || '', hasIcon: !!a.icon,
      onIconErr: (e) => { if (e && e.target) e.target.style.display = 'none'; },
      sym, priceStr: a.priceStr || '—', color: a.color || '#97FCE4', logoLetter: sym.charAt(0),
      aliasName: a.alias || '',
      changeStr: (ch >= 0 ? '▲ +' : '▼ −') + Math.abs(ch).toFixed(2) + '%',
      changeColor: ch >= 0 ? '#3FE0A0' : '#FF6B7A',
      changeBg: ch >= 0 ? 'rgba(63,224,160,.1)' : 'rgba(255,107,122,.1)',
      neuralScore: (a.score || 0).toLocaleString('en-US'),
      totalUsers: d.users || 0,
      biasLabel: (bear ? 'SHORT' : 'LONG') + ' BIAS', biasColor: accent,
      pctStr: pct + '%', donutWord: bear ? 'BEARISH' : 'BULLISH', donutColor: accent,
      donutGlow: bear ? 'rgba(255,107,122,.4)' : 'rgba(63,224,160,.4)',
      bearDash: bearLen.toFixed(2) + ' ' + (circ - bearLen).toFixed(2),
      bullDash: bullLen.toFixed(2) + ' 9999',
      bullOffset: +(-(bearLen + gap)).toFixed(2),
      lPct: 100 - bearPct, sPct: bearPct,
      lUsers: d.usersLong, lScore: d.scoreLong, lEntry: d.entryLong, lRecent: d.recentLong,
      sUsers: d.usersShort, sScore: d.scoreShort, sEntry: d.entryShort, sRecent: d.recentShort,
      vScoreBg: active(view === 'score'), vScoreColor: activeT(view === 'score'),
      vUsersBg: active(view === 'users'), vUsersColor: activeT(view === 'users'),
      bPosBg: active(bias === 'positional'), bPosColor: activeT(bias === 'positional'),
      bIntraBg: active(bias === 'intraday'), bIntraColor: activeT(bias === 'intraday'),
      onScore: cb('view', 'score'), onUsers: cb('view', 'users'),
      onPos: cb('bias', 'positional'), onIntra: cb('bias', 'intraday'),
    };
  }
}