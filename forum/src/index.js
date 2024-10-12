import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Dodanie AuthProvider */}
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
