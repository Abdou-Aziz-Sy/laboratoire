// --- fichier: frontend/src/index.js ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; 
import reportWebVitals from './reportWebVitals';

// En mode développement, chargez l'utilitaire de test des tâches
if (process.env.NODE_ENV === 'development') {
  import('./test/taskServiceTest').then(() => {
    console.log('Testeur de service de tâches chargé pour le développement');
  }).catch(err => {
    console.error('Erreur lors du chargement du testeur de tâches:', err);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();