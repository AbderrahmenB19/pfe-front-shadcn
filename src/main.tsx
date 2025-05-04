// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { initKeycloak } from './auth/KeycloakService';
import './index.css';
import { BrowserRouter } from 'react-router-dom';


initKeycloak()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        
       
              
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error('Keycloak initialization failed:', err);
    const fallback = document.createElement('div');
    fallback.innerText = "🔒 Failed to load Keycloak. Please try again.";
    fallback.style.fontSize = '18px';
    fallback.style.color = 'red';
    fallback.style.padding = '20px';
    fallback.style.textAlign = 'center';
    document.body.appendChild(fallback);
  });