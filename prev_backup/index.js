import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './modules/font/font.css';
import {CookiesProvider} from "react-cookie";
import './style/general.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <App></App>
    </CookiesProvider>
  </React.StrictMode>
);
