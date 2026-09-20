<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<style>/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_26.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_27.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_28.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_29.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_30.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_31.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_26.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_27.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_28.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_29.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_30.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_31.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_26.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_27.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_28.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_29.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_30.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_31.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_26.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_27.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_28.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_29.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_30.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_31.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Patrick Hand SC';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_32.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Patrick Hand SC';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_33.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Patrick Hand SC';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_34.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_35.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_36.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_37.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_35.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_36.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_37.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_35.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_36.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_37.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_35.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_36.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_37.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
</style>
<style>
  body { margin:0; background:#060f0d; }
  @keyframes rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:.2; } }
  @keyframes catBlink { 0%, 90%, 100% { transform:scaleY(1); } 93%, 96% { transform:scaleY(.08); } }
  @keyframes catBob { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
  @media (max-width:720px) {
    [data-mq="sig-wrap"] { padding:22px 14px 44px !important; }
    [data-mq="sig-title"] { font-size:23px !important; }
    [data-mq="sig-controls"] { flex-wrap:wrap !important; gap:12px !important; }
    [data-mq="sig-panel"] { width:100%; box-sizing:border-box; padding:12px 14px !important; }
    [data-mq="sig-find"] { flex:1; min-width:0; }
    [data-mq="sig-findwrap"] { width:100%; }
  }
</style>
</helmet>
<div data-screen-label="Signal Dashboard" data-mq="sig-wrap" style="position:relative; min-height:100vh; box-sizing:border-box; padding:clamp(18px,4vw,36px) clamp(12px,3vw,30px) 56px; font-family:'Space Grotesk',system-ui,sans-serif; color:#E9FBF5; background:radial-gradient(1100px 600px at 78% -14%, rgba(151,252,228,.10), transparent 60%), radial-gradient(820px 560px at -8% 110%, rgba(80,210,193,.06), transparent 60%), #060f0d;">

  <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(151,252,228,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(151,252,228,.03) 1px,transparent 1px); background-size:48px 48px; mask-image:radial-gradient(circle at 50% 20%, #000, transparent 78%); pointer-events:none;"></div>

  <div style="position:relative; max-width:1320px; margin:0 auto;">

    <!-- header -->
    <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:20px; margin-bottom:30px;">
      <div>
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <a href="index.html" title="Hypurr home" style="animation:catBob 3s ease-in-out infinite; display:block;"><img src="assets/icon_3.svg" alt="mascot" style="width:44px; height:auto; display:block;"></a>
          <h1 data-mq="sig-title" style="margin:0; font-size:clamp(22px,4.6vw,30px); font-weight:700; letter-spacing:-.02em; white-space:nowrap;">Signal Dashboard</h1>
          <span style="font-family:'Patrick Hand SC', cursive; font-size:20px; color:#97FCE4; opacity:.9; transform:rotate(-3deg); text-shadow:0 0 12px rgba(151,252,228,.35); white-space:nowrap;">$1 wen?</span>
          <span style="display:inline-flex; align-items:center; gap:6px; padding:5px 11px; border-radius:8px; background:rgba(151,252,228,.08); border:1px solid rgba(151,252,228,.18);">
            <span style="width:8px; height:8px; border-radius:50%; background:{{ liveDot }}; box-shadow:0 0 9px {{ liveDot }}; animation:blink 1.4s ease-in-out infinite;"></span>
            <span style="font-size:11px; font-weight:600; letter-spacing:.1em; color:#97FCE4; font-family:'JetBrains Mono';">{{ liveLabel }}</span>
          </span>
          <span sc-camel-on-click="{{ pbGo }}" style="cursor:pointer; display:inline-flex; align-items:center; gap:7px; padding:6px 13px; border-radius:9px; border:1px solid rgba(151,252,228,.14); background:rgba(255,255,255,.02); color:#9CB8AF; font-size:12px; font-weight:600; transition:all .25s ease;" style-hover="border:1px solid rgba(151,252,228,.4); color:#97FCE4; background:rgba(151,252,228,.06);">Perps board →</span>
          <span sc-camel-on-click="{{ hzGo }}" style="cursor:pointer; display:inline-flex; align-items:center; gap:7px; padding:6px 13px; border-radius:9px; border:1px solid rgba(151,252,228,.14); background:rgba(255,255,255,.02); color:#9CB8AF; font-size:12px; font-weight:600; transition:all .25s ease;" style-hover="border:1px solid rgba(151,252,228,.4); color:#97FCE4; background:rgba(151,252,228,.06);">Hedge scanner →</span>
        </div>
        <p style="margin:8px 0 0; font-size:14px; color:#7C9A91;">{{ subtitle }}</p>
      </div>

      <!-- control panel -->
      <div data-mq="sig-panel" style="padding:16px 18px; border:1px solid rgba(151,252,228,.14); border-radius:16px; background:linear-gradient(180deg, rgba(16,30,26,.9), rgba(10,21,18,.92)); box-shadow:0 24px 50px -38px rgba(0,0,0,.9);">
        <div data-mq="sig-controls" style="display:flex; align-items:center; gap:24px;">
          <div style="display:flex; align-items:center; gap:11px;">
            <span style="font-size:10.5px; font-weight:600; letter-spacing:.14em; color:#7C9A91;">MODE</span>
            <div style="display:flex; gap:3px; padding:3px; border-radius:9px; background:rgba(0,0,0,.3); border:1px solid rgba(151,252,228,.08);">
              <span sc-camel-on-click="{{ onPos }}" style="cursor:pointer; font-size:12px; font-weight:600; padding:6px 14px; border-radius:7px; color:{{ gPosColor }}; background:{{ gPosBg }};">Positional</span>
              <span sc-camel-on-click="{{ onIntra }}" style="cursor:pointer; font-size:12px; font-weight:600; padding:6px 14px; border-radius:7px; color:{{ gIntraColor }}; background:{{ gIntraBg }};">Intraday</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:11px;">
            <span style="font-size:10.5px; font-weight:600; letter-spacing:.14em; color:#7C9A91;">VIEW</span>
            <div style="display:flex; gap:3px; padding:3px; border-radius:9px; background:rgba(0,0,0,.3); border:1px solid rgba(151,252,228,.08);">
              <span sc-camel-on-click="{{ onScore }}" style="cursor:pointer; font-size:12px; font-weight:600; padding:6px 14px; border-radius:7px; color:{{ gScoreColor }}; background:{{ gScoreBg }};">Score</span>
              <span sc-camel-on-click="{{ onUsers }}" style="cursor:pointer; font-size:12px; font-weight:600; padding:6px 14px; border-radius:7px; color:{{ gUsersColor }}; background:{{ gUsersBg }};">Users</span>
            </div>
          </div>
          <div data-mq="sig-findwrap" style="display:flex; align-items:center; gap:11px;">
            <span style="font-size:10.5px; font-weight:600; letter-spacing:.14em; color:#7C9A91;">FIND</span>
            <input data-mq="sig-find" value="{{ qVal }}" sc-camel-on-change="{{ onSearch }}" placeholder="BTC, HYPE, PUMP…" style="box-sizing:border-box; width:168px; padding:8px 12px; border-radius:9px; border:1px solid rgba(151,252,228,.14); background:rgba(0,0,0,.3); color:#E9FBF5; font-family:'JetBrains Mono'; font-size:12px; outline:none; transition:all .25s ease;" style-focus="border:1px solid rgba(151,252,228,.45); box-shadow:0 0 14px -4px rgba(151,252,228,.35);">
          </div>
        </div>
      </div>
    </div>

    <!-- grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(min(370px, 100%), 1fr)); gap:18px;">
      <sc-for list="{{ rows }}" as="r" hint-placeholder-count="6">
        <dc-import name="Signal Card" asset="{{ r }}" view="{{ r.view }}" bias="{{ r.bias }}" on-toggle="{{ onToggle }}" on-nav="{{ onNavCb }}" hint-size="100%,440px"></dc-import>
      </sc-for>
    </div>

    <sc-if value="{{ noMatch }}" hint-placeholder-val="{{ false }}">
      <div style="margin-top:8px; text-align:center; padding:42px 20px; border:1px dashed rgba(151,252,228,.18); border-radius:16px; color:#7C9A91; font-size:14px;">
        No token matches "{{ qTxt }}" in the top 40.
        <span sc-camel-on-click="{{ onClearQ }}" style="cursor:pointer; color:#97FCE4; text-decoration:underline; margin-left:6px;">Clear search</span>
      </div>
    </sc-if>

    <div style="margin-top:26px; font-size:11.5px; color:#4f6a62; font-family:'JetBrains Mono';">{{ footer }}</div>

  </div>
</div>