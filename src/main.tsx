import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import DaqSite from './components/DaqSite.tsx';
import './index.css';

// The DAQ Consulting site is the public landing experience; the PHRONIC
// dashboard remains available at /app.
const isDashboard = window.location.pathname.startsWith('/app');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isDashboard ? <App /> : <DaqSite />}</StrictMode>,
);
