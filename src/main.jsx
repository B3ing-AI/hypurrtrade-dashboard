import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Ensure React is exposed globally for DC runtime compatibility
if (typeof window !== 'undefined') {
  window.React = React;
  window.ReactDOM = ReactDOM;
}

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
