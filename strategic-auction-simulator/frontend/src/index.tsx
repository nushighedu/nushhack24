import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import dotenv from 'dotenv';

// Initialize Firebase (ensure this is done before rendering)
import './config/firebaseConfig';

// Load environment variables
require('dotenv').config({ path: require('find-config')('.env') });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('Index.tsx Executed');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
