<helmet>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hypurr Trade — the cat does the math</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <style>/* cyrillic-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_1.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_2.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* latin-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_3.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_4.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_1.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_2.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* latin-ext */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_3.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_4.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_5.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_6.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_7.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_8.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_9.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("assets/font_10.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_5.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_6.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_7.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_8.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_9.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_10.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_5.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_6.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_7.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_8.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_9.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_10.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_5.woff2") format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_6.woff2") format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_7.woff2") format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_8.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_9.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_10.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_11.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_12.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("assets/font_13.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_11.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_12.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("assets/font_13.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_11.woff2") format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_12.woff2") format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("assets/font_13.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
</style>
  <style>
    html { scroll-behavior: smooth; }
    body { margin: 0; background: #0B231C; color: #E9F6F0; font-family: 'Space Grotesk', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    a { color: #97FCE4; text-decoration: none; }
    a:hover { color: #C4FDF0; }
    ::selection { background: rgba(151,252,228,.28); }
    @keyframes rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
    @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-11px); } }
    @keyframes floaty2 { 0%,100% { transform: translateY(-6px); } 50% { transform: translateY(7px); } }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes chalkdraw { from { stroke-dashoffset: 900; } to { stroke-dashoffset: 0; } }
    @keyframes dustdrift { 0% { transform: translateY(0) } 100% { transform: translateY(-18px) } }
    @keyframes beamRock { 0%, 100% { transform: rotate(8deg); } 50% { transform: rotate(4deg); } }
    @keyframes tailSway { 0%,100% { transform: rotate(0deg); } 30% { transform: rotate(7deg); } 65% { transform: rotate(-3deg); } }
    @keyframes armIdle { 0% { transform: rotate(0deg); } 4% { transform: rotate(14deg); } 8% { transform: rotate(-4deg); } 12% { transform: rotate(11deg); } 16%,42% { transform: rotate(0deg); } 50%,64% { transform: rotate(34deg); } 57% { transform: rotate(28deg); } 72%,100% { transform: rotate(0deg); } }
    @keyframes headIdle { 0%,20% { transform: rotate(0deg); } 26% { transform: rotate(-8deg); } 32%,44% { transform: rotate(0deg); } 52%,66% { transform: rotate(13deg); } 74%,86% { transform: rotate(0deg); } 92% { transform: rotate(-6deg); } 100% { transform: rotate(0deg); } }
    @keyframes earTw { 0%,84%,100% { transform: rotate(0deg); } 88% { transform: rotate(-9deg); } 93% { transform: rotate(4deg); } }
    @keyframes blinkY { 0%,90%,100% { transform: scaleY(1); } 94% { transform: scaleY(.08); } }
    @keyframes lickFlick { 0%,50%,66%,100% { opacity: 0; } 53%,63% { opacity: 1; } 58% { opacity: .2; } }
    @keyframes dustTw { 0%,100% { opacity: .5; } 50% { opacity: .1; } }
    @keyframes dotPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }
    @keyframes ringSpin { to { transform: rotate(360deg); } }
  </style>
</helmet>

<div style="position:relative; min-height:100vh; background: radial-gradient(1200px 700px at 75% -10%, #14382C 0%, rgba(20,56,44,0) 60%), radial-gradient(900px 600px at -10% 40%, #123227 0%, rgba(18,50,39,0) 55%), linear-gradient(180deg, #0C2620 0%, #0B231C 40%, #081A15 100%);">

  <!-- chalk doodle backdrop -->
  <sc-if value="{{ doodlesOn }}" hint-placeholder-val="{{ true }}">
  <div aria-hidden="true" style="position:absolute; inset:0; overflow:hidden; pointer-events:none;">
    <div data-px="-0.06" style="position:absolute; inset:0;">
      <svg sc-camel-view-box="0 0 60 90" style="position:absolute; top:12vh; left:4vw; width:52px; opacity:.13;"><path d="M30 6 C40 18 42 38 36 54 L24 54 C18 38 20 18 30 6 Z M30 54 l0 14 M22 60 l-8 14 M38 60 l8 14" stroke="#E9F6F0" stroke-width="2.4" fill="none" stroke-linecap="round"></path></svg>
      <div style="position:absolute; top:30vh; right:5vw; font-family:'Caveat'; font-size:34px; color:#E9F6F0; opacity:.14; transform:rotate(8deg);">p &gt; 28.6%</div>
      <svg sc-camel-view-box="0 0 80 60" style="position:absolute; top:64vh; left:7vw; width:74px; opacity:.12;"><path d="M6 50 L26 30 L42 40 L74 8 M74 8 l-12 2 M74 8 l-2 12" stroke="#E9F6F0" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      <div style="position:absolute; top:110vh; right:9vw; font-family:'Caveat'; font-size:38px; color:#97FCE4; opacity:.12; transform:rotate(-6deg);">$1 WEN?</div>
      <div style="position:absolute; top:150vh; left:5vw; font-family:'Caveat'; font-size:32px; color:#E9F6F0; opacity:.12; transform:rotate(-4deg);">Σ (edge − fees)</div>
      <svg sc-camel-view-box="0 0 70 70" style="position:absolute; top:186vh; right:6vw; width:60px; opacity:.12;"><circle cx="35" cy="35" r="26" stroke="#E9F6F0" stroke-width="2.4" fill="none" stroke-dasharray="5 7"></circle><text x="35" y="43" text-anchor="middle" font-family="Caveat" font-size="26" fill="#E9F6F0">R</text></svg>
      <div style="position:absolute; top:230vh; left:8vw; font-family:'Caveat'; font-size:30px; color:#E9F6F0; opacity:.11; transform:rotate(5deg);">2 + 2 ≠ moon</div>
    </div>
  </div>
  </sc-if>

  <!-- nav -->
  <div style="position:sticky; top:0; z-index:50; display:flex; justify-content:center; padding:14px 16px 0;">
    <div style="display:flex; align-items:center; gap:18px; width:min(1180px,100%); padding:10px 14px 10px 12px; border-radius:18px; background:linear-gradient(160deg, rgba(17,38,31,.72), rgba(10,24,19,.6)); backdrop-filter:blur(18px) saturate(1.3); -webkit-backdrop-filter:blur(18px) saturate(1.3); border:1px solid rgba(151,252,228,.16); box-shadow:0 18px 50px -22px rgba(0,0,0,.75), inset 0 1px 0 rgba(233,246,240,.07);">
      <a href="#top" style="display:flex; align-items:center; gap:10px; min-height:44px;">
        <img src="assets/icon_1.svg" alt="Hypurr the cat" style="width:36px; height:39px;">
        <span style="font-weight:700; letter-spacing:.06em; font-size:15px; color:#F2FBF7;">HYPURR<span style="color:#97FCE4;">·</span>TRADE</span>
      </a>
      <div style="flex:1;"></div>
      <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap; justify-content:flex-end;">
        <a href="#math" style="padding:12px 12px; font-size:13px; font-weight:600; color:#BFE3D6; border-radius:10px;" style-hover="color:#97FCE4; background:rgba(151,252,228,.08);">The math</a>
        <a href="#receipts" style="padding:12px 12px; font-size:13px; font-weight:600; color:#BFE3D6; border-radius:10px;" style-hover="color:#97FCE4; background:rgba(151,252,228,.08);">Receipts</a>
        <a href="prep-dashboard.html" style="display:inline-flex; align-items:center; min-height:44px; padding:0 18px; border-radius:12px; background:#97FCE4; color:#0A1614; font-weight:700; font-size:13px; letter-spacing:.02em; box-shadow:0 10px 26px -10px rgba(151,252,228,.55);" style-hover="background:#C4FDF0; transform:translateY(-1px);">Open the boards</a>
      </div>
    </div>
  </div>

  <!-- HERO -->
  <section id="top" data-screen-label="Hero" style="position:relative; z-index:1; display:flex; align-items:center; justify-content:center; min-height:calc(100svh - 90px); padding:40px 20px 30px;">
    <div style="display:flex; align-items:center; justify-content:center; gap:clamp(28px,5vw,72px); width:min(1180px,100%); flex-wrap:wrap;">
      <div style="flex:1 1 460px; min-width:min(460px,100%); animation:rise .9s cubic-bezier(.2,.7,.2,1) both;">
        <div style="font-family:'Caveat'; font-size:clamp(20px,2.4vw,27px); color:#97FCE4; transform:rotate(-1.6deg); margin-bottom:10px;">a cat, a chalkboard, and a public ledger</div>
        <h1 style="margin:0; font-size:clamp(42px,7.2vw,86px); line-height:.98; letter-spacing:-.025em; font-weight:700; color:#F2FBF7; text-wrap:balance;">The cat does<br>the <span style="position:relative; display:inline-block;">math.<svg sc-camel-view-box="0 0 220 26" style="position:absolute; left:-4px; bottom:-14px; width:104%; overflow:visible;"><path d="M6 16 C60 8 150 6 214 12 C160 14 60 18 10 20" stroke="#97FCE4" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="900" style="animation:chalkdraw 1.4s .5s cubic-bezier(.4,0,.2,1) both;"></path></svg></span></h1>
        <p style="margin:26px 0 0; max-width:54ch; font-family:'JetBrains Mono'; font-size:clamp(13.5px,1.4vw,15.5px); line-height:1.75; color:#9CC0B3;">Hypurr paper-trades Hyperliquid perps in public — every signal, every fill, every loss stays on the board. The money comes from three places, and all three are arithmetic, not vibes.</p>
        <div style="display:flex; gap:12px; margin-top:30px; flex-wrap:wrap;">
          <a href="prep-dashboard.html" style="display:inline-flex; align-items:center; gap:9px; min-height:52px; padding:0 26px; border-radius:14px; background:#97FCE4; color:#0A1614; font-weight:700; font-size:15px; box-shadow:0 16px 40px -14px rgba(151,252,228,.6);" style-hover="background:#C4FDF0; transform:translateY(-2px);">Open the boards <span style="font-family:'JetBrains Mono';">→</span></a>
          <a href="signal-dashboard.html" style="display:inline-flex; align-items:center; min-height:52px; padding:0 24px; border-radius:14px; border:1px solid rgba(151,252,228,.22); background:rgba(151,252,228,.06); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); color:#C9E5DA; font-weight:600; font-size:14.5px;" style-hover="border-color:rgba(151,252,228,.5); color:#97FCE4;">See the signal board</a>
        </div>
        <div style="display:flex; gap:16px; margin-top:26px; flex-wrap:wrap; font-family:'JetBrains Mono'; font-size:11.5px; letter-spacing:.08em; color:#5F7A72;">
          <span>PAPER-TRADED LIVE</span><span style="color:#2E4A40;">/</span><span>LOSSES PUBLISHED</span><span style="color:#2E4A40;">/</span><span>FEES COUNTED NET</span>
        </div>
      </div>
      <div style="flex:0 1 400px; position:relative; display:flex; justify-content:center; animation:rise 1s .15s cubic-bezier(.2,.7,.2,1) both;">
        <svg sc-camel-view-box="0 0 320 320" style="position:absolute; top:50%; left:50%; width:min(430px,102%); transform:translate(-50%,-52%); overflow:visible;" aria-hidden="true">
          <circle cx="160" cy="160" r="148" stroke="rgba(233,246,240,.2)" stroke-width="2.6" fill="none" stroke-dasharray="930" stroke-linecap="round" style="animation:chalkdraw 1.8s .4s cubic-bezier(.4,0,.2,1) both;" transform="rotate(-90 160 160)"></circle>
          <circle cx="160" cy="160" r="132" stroke="rgba(151,252,228,.1)" stroke-width="1.6" fill="none" stroke-dasharray="4 9"></circle>
        </svg>
        <div data-px="-0.03" style="position:relative;">
          <svg sc-camel-view-box="0 0 220 240" fill="none" role="img" aria-label="Hypurr — the chalkboard cat" style="width:clamp(240px,32vw,360px); filter:drop-shadow(0 30px 40px rgba(0,0,0,.45)); animation:floaty 4.8s ease-in-out infinite; overflow:visible;">
            <ellipse cx="110" cy="222" rx="54" ry="8" fill="#050f0c" opacity="0.55"></ellipse>
            <g style="transform-origin:62px 176px; transform-box:view-box; animation:tailSway 3.4s ease-in-out infinite;">
              <path d="M62 176 C30 172 14 146 26 118 C30 108 40 104 46 110" stroke="#F4FAF6" stroke-width="13" stroke-linecap="round"></path>
              <path d="M34 152 C40 154 46 154 51 151 M28 134 C34 137 42 137 47 134 M31 120 C36 123 42 123 46 121" stroke="#93A8A1" stroke-width="4" stroke-linecap="round"></path>
            </g>
            <path d="M66 206 C58 158 74 124 110 118 C146 124 162 158 154 206 C154 216 66 216 66 206 Z" fill="#16211D" stroke="#EAF7F0" stroke-width="3"></path>
            <path d="M90 176 h40 v12 q0 7 -9 7 h-22 q-9 0 -9 -7 Z" fill="#101A16" stroke="#DFF0E9" stroke-width="2" opacity="0.9"></path>
            <path d="M98 162 l5 -6 5 6 5 -6 5 6" stroke="#97FCE4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M102 142 c-1 5 -1 8 -2 12 M118 142 c1 5 1 8 2 12" stroke="#B7FDEC" stroke-width="3" stroke-linecap="round"></path>
            <circle cx="100" cy="156" r="2.6" fill="#B7FDEC"></circle><circle cx="120" cy="156" r="2.6" fill="#B7FDEC"></circle>
            <path d="M74 142 C66 154 68 168 82 178 L92 178 C84 168 82 154 86 144 Z" fill="#16211D" stroke="#EAF7F0" stroke-width="2.6" stroke-linejoin="round"></path>
            <g style="transform-origin:146px 144px; transform-box:view-box; animation:armIdle 12s ease-in-out infinite;">
              <path d="M146 144 C166 140 178 124 181 106" stroke="#EAF7F0" stroke-width="19" stroke-linecap="round"></path>
              <path d="M146 144 C166 140 178 124 181 106" stroke="#16211D" stroke-width="14" stroke-linecap="round"></path>
              <circle cx="182" cy="100" r="11.5" fill="#F4FAF6" stroke="#10241D" stroke-width="2.4"></circle>
              <path d="M177 92 l1 6 M183 90 l0.6 7" stroke="#10241D" stroke-width="1.7" stroke-linecap="round"></path>
              <ellipse cx="174" cy="92" rx="3.2" ry="4.4" fill="#F291B1" style="opacity:0; animation:lickFlick 12s ease-in-out infinite;"></ellipse>
            </g>
            <ellipse cx="90" cy="212" rx="13" ry="8" fill="#F4FAF6" stroke="#10241D" stroke-width="2.2"></ellipse>
            <ellipse cx="130" cy="212" rx="13" ry="8" fill="#F4FAF6" stroke="#10241D" stroke-width="2.2"></ellipse>
            <path d="M86 208 l0 5 M93 208 l0 5 M126 208 l0 5 M133 208 l0 5" stroke="#10241D" stroke-width="1.5" stroke-linecap="round"></path>
            <path d="M76 134 Q110 154 144 134 L138 122 Q110 138 82 122 Z" fill="#101A16" stroke="#EAF7F0" stroke-width="2.4" stroke-linejoin="round"></path>
            <g style="transform-origin:110px 116px; transform-box:view-box; animation:headIdle 12s ease-in-out infinite;">
              <g style="transform-origin:72px 44px; transform-box:view-box; animation:earTw 5.6s ease-in-out infinite;">
                <path d="M76 52 L62 16 L98 38 Z" fill="#F4FAF6" stroke="#10241D" stroke-width="2.6" stroke-linejoin="round"></path>
                <path d="M76 44 L69 26 L87 37 Z" fill="#F6A8C0"></path>
              </g>
              <path d="M144 52 L158 16 L122 38 Z" fill="#F4FAF6" stroke="#10241D" stroke-width="2.6" stroke-linejoin="round"></path>
              <path d="M144 44 L151 26 L133 37 Z" fill="#F6A8C0"></path>
              <path d="M64 78 C64 52 84 36 110 36 C136 36 156 52 156 78 C156 102 136 116 110 116 C84 116 64 102 64 78 Z" fill="#F4FAF6" stroke="#10241D" stroke-width="2.8"></path>
              <path d="M101 44 C100 39 99 36 97 32 M110 43 C110 38 110 34 110 30 M119 44 C120 39 121 36 123 32" stroke="#A9BDB6" stroke-width="4" stroke-linecap="round"></path>
              <ellipse cx="77" cy="94" rx="7" ry="4" fill="#F6A8C0" opacity="0.4"></ellipse>
              <ellipse cx="143" cy="94" rx="7" ry="4" fill="#F6A8C0" opacity="0.4"></ellipse>
              <path d="M74 80 L62 78 M146 80 L158 78" stroke="#17241F" stroke-width="4" stroke-linecap="round"></path>
              <circle cx="92" cy="81" r="16.5" fill="#FFFFFF" fill-opacity="0.07" stroke="#17241F" stroke-width="5.4"></circle>
              <circle cx="128" cy="81" r="16.5" fill="#FFFFFF" fill-opacity="0.07" stroke="#17241F" stroke-width="5.4"></circle>
              <path d="M106 79 Q110 74 114 79" stroke="#17241F" stroke-width="4.4" stroke-linecap="round"></path>
              <ellipse cx="92" cy="82" rx="4.6" ry="5.6" fill="#17241F" style="transform-box:fill-box; transform-origin:center; animation:blinkY 4.4s linear infinite;"></ellipse>
              <ellipse cx="128" cy="82" rx="4.6" ry="5.6" fill="#17241F" style="transform-box:fill-box; transform-origin:center; animation:blinkY 4.4s linear infinite;"></ellipse>
              <circle cx="94" cy="79.5" r="1.7" fill="#FFFFFF"></circle>
              <circle cx="130" cy="79.5" r="1.7" fill="#FFFFFF"></circle>
              <path d="M106.5 94 L113.5 94 L110 98.6 Z" fill="#F291B1" stroke="#10241D" stroke-width="1.4" stroke-linejoin="round"></path>
              <path d="M110 98.6 Q107 103 102.5 100.6 M110 98.6 Q113 103 117.5 100.6" stroke="#17241F" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M66 88 C58 86 52 85 45 85 M67 94 C59 94 53 95 46 97 M146 87 C154 85 160 84 167 84 M145 93 C153 93 159 94 166 96" stroke="#CFE2DB" stroke-width="1.7" stroke-linecap="round"></path>
            </g>
            <g fill="#EAF7F0">
              <circle cx="36" cy="86" r="1.6" style="animation:dustTw 2.8s ease-in-out infinite;"></circle>
              <circle cx="196" cy="140" r="1.3" style="animation:dustTw 3.6s ease-in-out infinite;"></circle>
              <circle cx="184" cy="62" r="1.8" style="animation:dustTw 3.1s ease-in-out infinite;"></circle>
              <circle cx="24" cy="150" r="1.2" style="animation:dustTw 2.4s ease-in-out infinite;"></circle>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <!-- ticker -->
  <sc-if value="{{ tickerOn }}" hint-placeholder-val="{{ true }}">
  <div style="position:relative; z-index:1; overflow:hidden; border-top:1px solid rgba(151,252,228,.1); border-bottom:1px solid rgba(151,252,228,.1); background:rgba(8,22,17,.5); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);">
    <div style="display:flex; width:max-content; animation:marquee 34s linear infinite; padding:11px 0;">
      <div style="display:flex; gap:34px; padding-right:34px; font-family:'JetBrains Mono'; font-size:11.5px; letter-spacing:.12em; color:#6E9285; white-space:nowrap;">
        <span>FEES ARE THE FIRST OPPONENT</span><span style="color:#97FCE4;">✳</span><span>BREAKEVEN 28.6% AT 2.5R</span><span style="color:#97FCE4;">✳</span><span>DELTA-NEUTRAL CARRY ≈ FUNDING SPREAD × 1,095</span><span style="color:#97FCE4;">✳</span><span>EVERY LOSS STAYS ON THE BOARD</span><span style="color:#97FCE4;">✳</span><span>NO MOON MATH. JUST MATH.</span><span style="color:#97FCE4;">✳</span>
      </div>
      <div style="display:flex; gap:34px; padding-right:34px; font-family:'JetBrains Mono'; font-size:11.5px; letter-spacing:.12em; color:#6E9285; white-space:nowrap;">
        <span>FEES ARE THE FIRST OPPONENT</span><span style="color:#97FCE4;">✳</span><span>BREAKEVEN 28.6% AT 2.5R</span><span style="color:#97FCE4;">✳</span><span>DELTA-NEUTRAL CARRY ≈ FUNDING SPREAD × 1,095</span><span style="color:#97FCE4;">✳</span><span>EVERY LOSS STAYS ON THE BOARD</span><span style="color:#97FCE4;">✳</span><span>NO MOON MATH. JUST MATH.</span><span style="color:#97FCE4;">✳</span>
      </div>
    </div>
  </div>
  </sc-if>

  <!-- MONEY MATH -->
  <section id="math" data-screen-label="Money math" style="position:relative; z-index:1; padding:clamp(70px,10vw,130px) 20px 30px;">
    <div style="width:min(1180px,100%); margin:0 auto;">
      <div data-rv="0" style="display:flex; align-items:flex-end; justify-content:space-between; gap:30px 40px; flex-wrap:wrap;">
        <div style="max-width:640px; flex:1 1 420px;">
          <div style="font-family:'Caveat'; font-size:25px; color:#97FCE4; transform:rotate(-1.2deg);">lesson 01</div>
          <h2 style="margin:6px 0 0; font-size:clamp(30px,4.4vw,50px); line-height:1.04; letter-spacing:-.02em; font-weight:700; color:#F2FBF7;">Where the money comes from</h2>
          <p style="margin:16px 0 0; font-family:'JetBrains Mono'; font-size:13.5px; line-height:1.75; color:#9CC0B3;">Three engines. Each one is a formula you can check with a pencil.</p>
        </div>
        <div style="flex:0 1 230px; min-width:180px; margin-left:auto;">
          <svg sc-camel-view-box="0 0 200 224" style="width:100%; overflow:visible; display:block;" aria-label="Reward outweighs risk">
            <text x="100" y="22" text-anchor="middle" font-family="Caveat" font-size="21" fill="#9CC0B3" transform="rotate(-3 100 22)">weighed, every trade</text>
            <g fill="none" stroke="#E9F6F0" stroke-linecap="round" stroke-linejoin="round" opacity=".92">
              <path d="M86 210 L114 210 L107 194 L93 194 Z" stroke-width="3"></path>
              <path d="M100 194 L100 86" stroke-width="3.4"></path>
            </g>
            <g style="transform-origin:100px 84px; transform-box:view-box; animation:beamRock 6.5s ease-in-out infinite;">
              <path d="M32 84 L168 84" stroke="#E9F6F0" stroke-width="4" stroke-linecap="round" fill="none"></path>
              <path d="M36 86 L24 120 M36 86 L48 120 M164 86 L152 128 M164 86 L176 128" stroke="#CFE2DB" stroke-width="1.8" fill="none"></path>
              <path d="M12 120 Q36 142 60 120" stroke="#E9F6F0" stroke-width="3" fill="rgba(233,246,240,.05)"></path>
              <path d="M140 128 Q164 150 188 128" stroke="#97FCE4" stroke-width="3" fill="rgba(151,252,228,.09)"></path>
              <text x="36" y="117" text-anchor="middle" font-family="Caveat" font-size="17" fill="#E9F6F0">1R</text>
              <text x="164" y="125" text-anchor="middle" font-family="Caveat" font-size="20" fill="#97FCE4">2.5R</text>
              <text x="36" y="158" text-anchor="middle" font-family="'JetBrains Mono'" font-size="10.5" letter-spacing="1.5" fill="#9CC0B3">RISK</text>
              <text x="164" y="166" text-anchor="middle" font-family="'JetBrains Mono'" font-size="10.5" letter-spacing="1.5" fill="#97FCE4">REWARD</text>
            </g>
            <circle cx="100" cy="84" r="4.5" fill="#97FCE4"></circle>
          </svg>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(300px,100%), 1fr)); gap:18px; margin-top:44px;">
        <div data-rv="0" style="display:flex; flex-direction:column; gap:14px; padding:26px 24px; border-radius:22px; background:linear-gradient(165deg, rgba(20,40,33,.66), rgba(11,25,20,.56)); backdrop-filter:blur(16px) saturate(1.25); -webkit-backdrop-filter:blur(16px) saturate(1.25); border:1px solid rgba(151,252,228,.15); box-shadow:0 26px 60px -30px rgba(0,0,0,.75), inset 0 1px 0 rgba(233,246,240,.07);" style-hover="border-color:rgba(151,252,228,.32); transform:translateY(-4px);">
          <div style="font-family:'Caveat'; font-size:27px; color:#97FCE4;">① Funding carry</div>
          <p style="margin:0; font-size:14px; line-height:1.7; color:#BFDDD1;">Perps pay funding around the clock. When venue A pays shorts and venue B pays longs, hold both sides — price cancels out, the spread doesn't.</p>
          <div style="padding:15px 16px; border-radius:14px; background:rgba(6,17,13,.75); border:1px solid rgba(151,252,228,.12); font-family:'JetBrains Mono'; font-size:12.5px; line-height:1.9; color:#8FE8CF; overflow-x:auto;">carry = (f<sub>A</sub> − f<sub>B</sub>) × 3 × 365<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = (0.010% + 0.004%) × 1,095<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ≈ <b style="color:#97FCE4;">+15.3% APR</b>, delta-neutral</div>
          <div style="margin-top:auto; font-family:'JetBrains Mono'; font-size:11px; letter-spacing:.08em; color:#5F7A72;">THE HEDGE SCANNER RANKS THESE SPREADS LIVE</div>
        </div>
        <div data-rv="120" style="display:flex; flex-direction:column; gap:14px; padding:26px 24px; border-radius:22px; background:linear-gradient(165deg, rgba(20,40,33,.66), rgba(11,25,20,.56)); backdrop-filter:blur(16px) saturate(1.25); -webkit-backdrop-filter:blur(16px) saturate(1.25); border:1px solid rgba(151,252,228,.15); box-shadow:0 26px 60px -30px rgba(0,0,0,.75), inset 0 1px 0 rgba(233,246,240,.07);" style-hover="border-color:rgba(151,252,228,.32); transform:translateY(-4px);">
          <div style="font-family:'Caveat'; font-size:27px; color:#97FCE4;">② Asymmetric signals</div>
          <p style="margin:0; font-size:14px; line-height:1.7; color:#BFDDD1;">Every trade risks a fixed slice of the book and targets 2.5× that risk. Losers are small by construction; winners are paid to be patient.</p>
          <div style="padding:15px 16px; border-radius:14px; background:rgba(6,17,13,.75); border:1px solid rgba(151,252,228,.12); font-family:'JetBrains Mono'; font-size:12.5px; line-height:1.9; color:#8FE8CF; overflow-x:auto;">risk = 1.5% of equity = 1R<br>EV = p·2.5R − (1−p)·R<br>@ p = 40% → <b style="color:#97FCE4;">+0.40R ≈ +0.6% / trade</b></div>
          <div style="margin-top:auto; font-family:'JetBrains Mono'; font-size:11px; letter-spacing:.08em; color:#5F7A72;">BREAKEVEN IS 28.6%. EVERYTHING ABOVE IS THE BUSINESS</div>
        </div>
        <div data-rv="240" style="display:flex; flex-direction:column; gap:14px; padding:26px 24px; border-radius:22px; background:linear-gradient(165deg, rgba(20,40,33,.66), rgba(11,25,20,.56)); backdrop-filter:blur(16px) saturate(1.25); -webkit-backdrop-filter:blur(16px) saturate(1.25); border:1px solid rgba(151,252,228,.15); box-shadow:0 26px 60px -30px rgba(0,0,0,.75), inset 0 1px 0 rgba(233,246,240,.07);" style-hover="border-color:rgba(151,252,228,.32); transform:translateY(-4px);">
          <div style="font-family:'Caveat'; font-size:27px; color:#97FCE4;">③ Costs cleared first</div>
          <p style="margin:0; font-size:14px; line-height:1.7; color:#BFDDD1;">Fees, slippage and funding get paid whether you win or not. A trade that can't clear its ~$3 round-trip tax is a donation — so leverage is capped and thin books are skipped.</p>
          <div style="padding:15px 16px; border-radius:14px; background:rgba(6,17,13,.75); border:1px solid rgba(151,252,228,.12); font-family:'JetBrains Mono'; font-size:12.5px; line-height:1.9; color:#8FE8CF; overflow-x:auto;">net = gross − fees − slip − funding<br>fees ≈ 0.045% × 2 sides × notional<br><b style="color:#97FCE4;">5× cap</b> keeps the tax below the edge</div>
          <div style="margin-top:auto; font-family:'JetBrains Mono'; font-size:11px; letter-spacing:.08em; color:#5F7A72;">THE TAX GETS PAID BEFORE THE EDGE DOES</div>
        </div>
      </div>
    </div>
  </section>

  <!-- THE BAR -->
  <section data-screen-label="The bar" style="position:relative; z-index:1; padding:clamp(60px,8vw,110px) 20px;">
    <div data-rv="0" style="width:min(1180px,100%); margin:0 auto; display:flex; gap:clamp(24px,4vw,56px); align-items:center; flex-wrap:wrap; padding:clamp(28px,4vw,52px); border-radius:26px; background:linear-gradient(160deg, rgba(16,35,28,.72), rgba(9,21,17,.6)); backdrop-filter:blur(18px) saturate(1.3); -webkit-backdrop-filter:blur(18px) saturate(1.3); border:1px solid rgba(151,252,228,.16); box-shadow:0 30px 70px -32px rgba(0,0,0,.8), inset 0 1px 0 rgba(233,246,240,.07);">
      <div style="flex:1 1 380px; min-width:min(380px,100%);">
        <div style="font-family:'Caveat'; font-size:25px; color:#97FCE4; transform:rotate(-1.2deg);">lesson 02</div>
        <h2 style="margin:6px 0 0; font-size:clamp(28px,3.8vw,44px); line-height:1.05; letter-spacing:-.02em; font-weight:700; color:#F2FBF7;">The bar every trade must clear</h2>
        <div style="margin:22px 0 0; font-family:'Caveat'; font-size:clamp(28px,3.4vw,40px); color:#EAF7F0; transform:rotate(-.8deg);">p·2.5R − (1−p)·R &gt; 0 <span style="color:#97FCE4;">⇒ p &gt; 28.6%</span></div>
        <p style="margin:18px 0 0; font-family:'JetBrains Mono'; font-size:13px; line-height:1.75; color:#9CC0B3;">At a 2.5-to-1 payoff, the model can be wrong 7 times out of 10 and still break even. The board's whole job is keeping the dot above the curve — and it does that homework in public.</p>
      </div>
      <div style="flex:1 1 340px; min-width:min(340px,100%); position:relative;">
        <svg sc-camel-view-box="0 0 380 220" ref="{{ chartRef }}" sc-camel-on-pointer-down="{{ chartDown }}" sc-camel-on-pointer-move="{{ chartMove }}" sc-camel-on-pointer-up="{{ chartUp }}" sc-camel-on-double-click="{{ chartReset }}" style="width:100%; display:block; touch-action:pan-y; cursor:crosshair; overflow:visible;">
          <line x1="46" y1="14" x2="46" y2="180" stroke="rgba(233,246,240,.22)" stroke-width="1.4"></line>
          <line x1="46" y1="180" x2="366" y2="180" stroke="rgba(233,246,240,.22)" stroke-width="1.4"></line>
          <text x="14" y="20" font-family="JetBrains Mono" font-size="10" fill="#6E9285">WR%</text>
          <text x="340" y="204" font-family="JetBrains Mono" font-size="10" fill="#6E9285">R:R</text>
          <text x="24" y="52" font-family="JetBrains Mono" font-size="9.5" fill="#557067">67</text>
          <text x="24" y="92" font-family="JetBrains Mono" font-size="9.5" fill="#557067">50</text>
          <text x="24" y="136" font-family="JetBrains Mono" font-size="9.5" fill="#557067">33</text>
          <text x="24" y="172" font-family="JetBrains Mono" font-size="9.5" fill="#557067">20</text>
          <text x="72" y="196" font-family="JetBrains Mono" font-size="9.5" fill="#557067">0.5</text><text x="152" y="196" font-family="JetBrains Mono" font-size="9.5" fill="#557067">1.5</text><text x="232" y="196" font-family="JetBrains Mono" font-size="9.5" fill="#557067">2.5</text><text x="312" y="196" font-family="JetBrains Mono" font-size="9.5" fill="#557067">3.5</text>
          <path d="M76 48.8 L86 61.7 L96 72.7 L116 90.7 L136 104.6 L156 115.8 L176 124.9 L196 132.5 L216 138.9 L236 144.5 L256 149.2 L276 153.4 L296 157.1 L316 160.4 L336 163.3 L356 166" stroke="#E9F6F0" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="620" style="animation:chalkdraw 1.6s .2s cubic-bezier(.4,0,.2,1) both;"></path>
          <text x="120" y="66" font-family="Caveat" font-size="19" fill="#9CC0B3" transform="rotate(-14 120 66)">breakeven curve · WR = 1/(1+R:R)</text>
          <circle cx="236" cy="144.5" r="5" fill="none" stroke="rgba(151,252,228,.4)" stroke-width="1.4" stroke-dasharray="2 4"></circle>
          <line x1="{{ dotX }}" y1="{{ dotY }}" x2="{{ dotX }}" y2="180" stroke="rgba(151,252,228,.28)" stroke-width="1.2" stroke-dasharray="3 5"></line>
          <line x1="46" y1="{{ dotY }}" x2="{{ dotX }}" y2="{{ dotY }}" stroke="rgba(151,252,228,.28)" stroke-width="1.2" stroke-dasharray="3 5"></line>
          <g style="{{ dotWrapStyle }}">
            <circle cx="0" cy="0" r="13" fill="none" stroke="rgba(151,252,228,.45)" stroke-width="1.6" stroke-dasharray="3 5" style="animation:ringSpin 9s linear infinite;"></circle>
            <circle cx="0" cy="0" r="7" fill="#97FCE4" style="animation:dotPulse 2.4s ease-in-out infinite; cursor:grab;"></circle>
          </g>
          <text x="252" y="184" font-family="Caveat" font-size="18" fill="#9CC0B3" transform="rotate(-2 252 184)" style="{{ hintStyle }}">↑ drag the dot, try your own R:R</text>
        </svg>
        <div style="position:absolute; left:{{ lblLeft }}; top:{{ lblTop }}; transform:translate(-50%,-100%); font-family:'Caveat'; font-size:clamp(19px,2.3vw,25px); font-weight:700; color:#97FCE4; white-space:nowrap; pointer-events:none; text-shadow:0 2px 10px rgba(4,12,9,.85);">{{ dotLabel }}</div>
      </div>
    </div>
  </section>

  <!-- RECEIPTS -->
  <section id="receipts" data-screen-label="Receipts" style="position:relative; z-index:1; padding:clamp(50px,7vw,90px) 20px;">
    <div style="width:min(1180px,100%); margin:0 auto;">
      <div data-rv="0" style="max-width:640px;">
        <div style="font-family:'Caveat'; font-size:25px; color:#97FCE4; transform:rotate(-1.2deg);">lesson 03</div>
        <h2 style="margin:6px 0 0; font-size:clamp(30px,4.4vw,50px); line-height:1.04; letter-spacing:-.02em; font-weight:700; color:#F2FBF7;">Receipts, not promises</h2>
        <p style="margin:16px 0 0; font-family:'JetBrains Mono'; font-size:13.5px; line-height:1.75; color:#9CC0B3;">The whole model runs in the open. If it bleeds, you watch it bleed — and you watch it learn.</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(290px,100%), 1fr)); gap:18px; margin-top:40px;">
        <a data-rv="0" href="signal-dashboard.html" style="display:flex; flex-direction:column; gap:10px; padding:24px; border-radius:22px; background:linear-gradient(165deg, rgba(20,40,33,.6), rgba(11,25,20,.5)); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid rgba(151,252,228,.15); box-shadow:0 24px 56px -30px rgba(0,0,0,.75);" style-hover="border-color:rgba(151,252,228,.4); transform:translateY(-4px); background:linear-gradient(165deg, rgba(24,48,39,.7), rgba(13,29,24,.6));">
          <span style="font-family:'JetBrains Mono'; font-size:10.5px; letter-spacing:.16em; color:#5F7A72;">BOARD 01</span>
          <span style="font-size:21px; font-weight:700; color:#F2FBF7;">Signal board</span>
          <span style="font-size:13.5px; line-height:1.65; color:#9CC0B3;">40 coins scored live — funding, momentum, breadth and smart-money flow on one wall of cards.</span>
          <span style="margin-top:auto; font-family:'JetBrains Mono'; font-size:12px; color:#97FCE4;">open →</span>
        </a>
        <a data-rv="110" href="prep-dashboard.html" style="display:flex; flex-direction:column; gap:10px; padding:24px; border-radius:22px; background:linear-gradient(165deg, rgba(20,40,33,.6), rgba(11,25,20,.5)); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid rgba(151,252,228,.15); box-shadow:0 24px 56px -30px rgba(0,0,0,.75);" style-hover="border-color:rgba(151,252,228,.4); transform:translateY(-4px); background:linear-gradient(165deg, rgba(24,48,39,.7), rgba(13,29,24,.6));">
          <span style="font-family:'JetBrains Mono'; font-size:10.5px; letter-spacing:.16em; color:#5F7A72;">BOARD 02</span>
          <span style="font-size:21px; font-weight:700; color:#F2FBF7;">Prep board</span>
          <span style="font-size:13.5px; line-height:1.65; color:#9CC0B3;">One coin, full workup — levels, liquidation maps, a written trade plan, and the model's live track record with every loss on display.</span>
          <span style="margin-top:auto; font-family:'JetBrains Mono'; font-size:12px; color:#97FCE4;">open →</span>
        </a>
        <a data-rv="220" href="prep-dashboard.html?view=hedge" style="display:flex; flex-direction:column; gap:10px; padding:24px; border-radius:22px; background:linear-gradient(165deg, rgba(20,40,33,.6), rgba(11,25,20,.5)); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid rgba(151,252,228,.15); box-shadow:0 24px 56px -30px rgba(0,0,0,.75);" style-hover="border-color:rgba(151,252,228,.4); transform:translateY(-4px); background:linear-gradient(165deg, rgba(24,48,39,.7), rgba(13,29,24,.6));">
          <span style="font-family:'JetBrains Mono'; font-size:10.5px; letter-spacing:.16em; color:#5F7A72;">BOARD 03</span>
          <span style="font-size:21px; font-weight:700; color:#F2FBF7;">Hedge scanner</span>
          <span style="font-size:13.5px; line-height:1.65; color:#9CC0B3;">Funding spreads across Hyperliquid, dYdX and Paradex — the carry math from lesson 01, pre-computed and ranked.</span>
          <span style="margin-top:auto; font-family:'JetBrains Mono'; font-size:12px; color:#97FCE4;">open →</span>
        </a>
      </div>
      <div data-rv="120" style="display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-top:22px; padding:18px 22px; border-radius:18px; border:1px dashed rgba(151,252,228,.28); background:rgba(151,252,228,.045);">
        <span style="font-family:'Caveat'; font-size:24px; color:#97FCE4; transform:rotate(-1deg);">honesty clause —</span>
        <span style="flex:1 1 320px; font-family:'JetBrains Mono'; font-size:12.5px; line-height:1.7; color:#9CC0B3;">The exact entry gates stay private (published edges get crowded, then die). Everything they produce is public — every fill, every loss, every fee, timestamped as it happens.</span>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section data-screen-label="CTA" style="position:relative; z-index:1; padding:clamp(40px,6vw,80px) 20px clamp(70px,9vw,120px);">
    <div data-rv="0" style="width:min(880px,100%); margin:0 auto; display:flex; align-items:center; gap:clamp(20px,4vw,44px); flex-wrap:wrap; justify-content:center; text-align:center; flex-direction:column; padding:clamp(34px,5vw,56px) clamp(22px,4vw,56px); border-radius:28px; background:linear-gradient(160deg, rgba(151,252,228,.1), rgba(11,25,20,.4)); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(151,252,228,.22); box-shadow:0 34px 80px -36px rgba(0,0,0,.85);">
      <img src="assets/icon_1.svg" alt="" style="width:110px; animation:floaty 4.4s ease-in-out infinite;">
      <h2 style="margin:0; font-size:clamp(26px,3.6vw,40px); font-weight:700; letter-spacing:-.02em; color:#F2FBF7; text-wrap:balance;">Class is always in session.</h2>
      <p style="margin:0; max-width:52ch; font-family:'JetBrains Mono'; font-size:13px; line-height:1.75; color:#9CC0B3;">The boards update themselves. The cat keeps score. Come check the homework whenever you like.</p>
      <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
        <a href="prep-dashboard.html" style="display:inline-flex; align-items:center; min-height:50px; padding:0 26px; border-radius:14px; background:#97FCE4; color:#0A1614; font-weight:700; font-size:14.5px; box-shadow:0 16px 40px -14px rgba(151,252,228,.6);" style-hover="background:#C4FDF0; transform:translateY(-2px);">Open the boards →</a>
      </div>
    </div>
  </section>

  <!-- footer -->
  <footer data-screen-label="Footer" style="position:relative; z-index:1; border-top:1px solid rgba(151,252,228,.1); background:rgba(6,16,13,.6); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);">
    <div style="width:min(1180px,100%); margin:0 auto; padding:30px 20px; display:flex; gap:18px; align-items:flex-start; justify-content:space-between; flex-wrap:wrap;">
      <div style="display:flex; flex-direction:column; gap:10px; max-width:56ch;">
        <div style="display:flex; align-items:center; gap:9px;">
          <img src="assets/icon_1.svg" alt="" style="width:26px;">
          <span style="font-weight:700; letter-spacing:.06em; font-size:13px; color:#F2FBF7;">HYPURR<span style="color:#97FCE4;">·</span>TRADE</span>
        </div>
        <p style="margin:0; font-family:'JetBrains Mono'; font-size:11px; line-height:1.8; color:#5F7A72;">A paper-trading research project. Nothing here is financial advice or a solicitation to trade. Data from Hyperliquid, dYdX and Paradex public APIs. The cat is not a fiduciary.</p>
      </div>
      <div style="display:flex; gap:6px 22px; flex-wrap:wrap; font-family:'JetBrains Mono'; font-size:12px;">
        <a href="signal-dashboard.html" style="padding:10px 0;">signal board</a>
        <a href="prep-dashboard.html" style="padding:10px 0;">prep board</a>
        <a href="prep-dashboard.html?view=hedge" style="padding:10px 0;">hedge scanner</a>
      </div>
    </div>
  </footer>
</div>