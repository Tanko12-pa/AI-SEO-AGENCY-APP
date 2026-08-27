import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress benign third-party iframe / PayPal popup dismissal events
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event?.reason?.message || event?.reason || '');
    if (
      reasonStr.includes('Detected popup close') ||
      reasonStr.includes('popup close') ||
      reasonStr.includes('window closed') ||
      reasonStr.includes('popup_closed')
    ) {
      event.preventDefault();
      console.info('PayPal popup closed or cancelled by user.');
    }
  });

  window.addEventListener('error', (event) => {
    const msgStr = String(event?.message || '');
    if (
      msgStr.includes('Detected popup close') ||
      msgStr.includes('popup close') ||
      msgStr.includes('window closed')
    ) {
      event.preventDefault();
      console.info('PayPal popup window close handled.');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

