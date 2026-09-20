import React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

// Ensure the single unified React instance is exposed globally for DC runtime
if (typeof window !== 'undefined') {
  window.React = React;
  window.ReactDOM = Object.assign({}, ReactDOM, ReactDOMClient);
}

function loadDcRuntime() {
  return new Promise((resolve, reject) => {
    if (window.adoptParsed && window.getDC) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = '/assets/dc-runtime.js';
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

loadDcRuntime().then(() => {
  import('./App.jsx').then(({ default: App }) => {
    const container = document.getElementById('root');
    if (container) {
      const root = ReactDOMClient.createRoot(container);
      root.render(<App />);
    }
  });
}).catch((err) => {
  console.error('Failed to load DC runtime:', err);
});
