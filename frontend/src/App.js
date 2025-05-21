// --- modification de frontend/src/App.js ---
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuthToken } from './api/authService';
import './App.css';

// Pages importées
import HomePage from './pages/HomePage';
// Importer les pages d'authentification existantes
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage'; // Ajout de l'import pour la page de tarification
import ContactPage from './pages/ContactPage'; // Ajout de l'import pour la page de contact
import CreateTaskPage from './pages/CreateTaskPage'; // Import de la page de création de tâche

// Page temporaire pour les routes non encore implémentées
const TemporaryPage = ({ pageName }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Page {pageName} (À implémenter)</h2>
    <p>Cette page est en cours de développement.</p>
  </div>
);

// Composant de protection de route privée
const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!getAuthToken();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
          <Route path="/fonctionnalites" element={<FeaturesPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} /> {/* Route pour la page de tarification */}
          <Route path="/contact" element={<ContactPage />} /> {/* Nouvelle route pour la page de contact */}
          
          {/* Routes protégées pour les tâches */}
          <Route path="/create-task" element={<PrivateRoute element={<CreateTaskPage />} />} />
          
          {/* Routes protégées temporaires */}
          <Route path="/dashboard" element={<PrivateRoute element={<TemporaryPage pageName="Tableau de bord" />} />} />
          <Route path="/profile" element={<PrivateRoute element={<TemporaryPage pageName="Profil" />} />} />
          <Route path="/tasks" element={<PrivateRoute element={<TemporaryPage pageName="Mes tâches" />} />} />
          
          {/* Route 404 */}
          <Route path="*" element={<TemporaryPage pageName="404 - Page non trouvée" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;