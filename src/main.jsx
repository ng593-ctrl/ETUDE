// THE STUDY SYNC/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom'; 
// CRITICAL FIX: The component you are using in line 16 must be imported
import { AuthProvider } from './context/AuthContext'; // <-- ADD THIS LINE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);