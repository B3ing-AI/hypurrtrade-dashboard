import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const PrepDashboardPage = lazy(() => import('./pages/PrepDashboardPage.jsx'));
const SignalDashboardPage = lazy(() => import('./pages/SignalDashboardPage.jsx'));

function LoadingFallback({ label }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#060f0d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#97FCE4',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontSize: '15px',
        letterSpacing: '0.05em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#97FCE4',
            boxShadow: '0 0 12px #97FCE4',
            animation: 'blink 1.4s ease-in-out infinite',
          }}
        ></span>
        <span>Loading {label || 'page'}...</span>
      </div>
    </div>
  );
}

function LinkInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      const anchor = e.target.closest('a');
      if (!anchor || !anchor.href) return;

      const target = anchor.getAttribute('target');
      if (target && target !== '_self') return;

      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin === window.location.origin) {
          const pathname = url.pathname.toLowerCase();
          let newRoute = null;

          if (pathname.includes('prep-dashboard') || pathname.includes('prep dashboard')) {
            newRoute = '/prep-dashboard' + url.search;
          } else if (pathname.includes('signal-dashboard') || pathname.includes('signal dashboard')) {
            newRoute = '/signal-dashboard' + url.search;
          } else if (pathname.endsWith('index.html') || pathname.endsWith('landing.dc.html')) {
            newRoute = '/' + url.search;
          }

          if (newRoute) {
            e.preventDefault();
            navigate(newRoute);
          }
        }
      } catch (err) {}
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <LinkInterceptor />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/prep-dashboard" element={<PrepDashboardPage />} />
          <Route path="/prep" element={<PrepDashboardPage />} />
          <Route path="/signal-dashboard" element={<SignalDashboardPage />} />
          <Route path="/signals" element={<SignalDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
