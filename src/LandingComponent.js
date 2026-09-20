class Component extends DCLogic {
  state = { rr: 2.5, touched: false, drag: false };
  chartRef = (el) => { this.chartEl = el; };
  rrFromEvent(e) {
    const el = this.chartEl; if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width) return null;
    const x = (e.clientX - r.left) / r.width * 380;
    return Math.max(0.5, Math.min(4, Math.round((0.5 + (x - 76) / 80) * 20) / 20));
  }
  renderVals() {
    const rr = this.state.rr, wr = 100 / (1 + rr);
    const dotX = 76 + (rr - 0.5) * 80, dotY = 48 + (67 - wr) * 2.51;
    const home = Math.abs(rr - 2.5) < 0.026;
    const right = rr > 3.05;
    return {
      doodlesOn: this.props.doodles ?? true,
      tickerOn: this.props.ticker ?? true,
      dotX: dotX, dotY: dotY,
      dotWrapStyle: 'transform:translate(' + dotX + 'px,' + dotY + 'px); transition:transform ' + (this.state.drag ? '.08s linear' : '.65s cubic-bezier(.3,1.6,.4,1)') + ';',
      lblX: dotX + (right ? -16 : 16), lblY: Math.max(26, dotY - 14), lblAnchor: right ? 'end' : 'start',
      lblLeft: Math.max(22, Math.min(78, dotX / 380 * 100)) + '%', lblTop: Math.max(8, dotY / 220 * 100 - 7) + '%',
      dotLabel: home ? 'us: 2.5R @ 28.6%' : (Math.round(rr * 100) / 100) + 'R needs ' + wr.toFixed(1) + '% WR',
      hintStyle: 'opacity:' + (this.state.touched ? 0 : 1) + '; transition:opacity .5s;',
      chartRef: this.chartRef,
      chartDown: (e) => { if (e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} } const v = this.rrFromEvent(e); this.setState({ touched: true, drag: true, rr: v != null ? v : this.state.rr }); },
      chartMove: (e) => { if (!this.state.drag) return; const v = this.rrFromEvent(e); if (v != null && v !== this.state.rr) this.setState({ rr: v }); },
      chartUp: () => this.setState({ drag: false, rr: 2.5 }),
      chartReset: () => this.setState({ rr: 2.5, touched: true }),
    };
  }
  componentDidMount() {
    const els = Array.from(document.querySelectorAll('[data-rv]'));
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity .85s cubic-bezier(.2,.7,.2,1), transform .85s cubic-bezier(.2,.7,.2,1)';
      el.style.transitionDelay = (parseInt(el.getAttribute('data-rv'), 10) || 0) + 'ms';
    });
    this.io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; this.io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => this.io.observe(el));
    const lay = Array.from(document.querySelectorAll('[data-px]'));
    const apply = () => { const y = window.scrollY; lay.forEach((el) => { el.style.transform = 'translateY(' + (y * parseFloat(el.getAttribute('data-px'))).toFixed(1) + 'px)'; }); this.raf = 0; };
    this.onS = () => { if (!this.raf) this.raf = requestAnimationFrame(apply); };
    window.addEventListener('scroll', this.onS, { passive: true });
  }
  componentWillUnmount() {
    if (this.io) this.io.disconnect();
    if (this.onS) window.removeEventListener('scroll', this.onS);
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}