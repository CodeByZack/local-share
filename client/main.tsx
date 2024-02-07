import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import VConsole from "vconsole";
import { isMobile } from './utils/is.ts';
import { drawingBackdrop } from './components/canvas.ts';

if (process.env.NODE_ENV === "development" && isMobile()) {
    new VConsole();
}

window.addEventListener("DOMContentLoaded", drawingBackdrop);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
