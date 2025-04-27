// --- fichier: frontend/src/App.js ---
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
// --- AJOUTER L'IMPORT ---
import ResetPasswordPage from './pages/ResetPasswordPage.js';

import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Button } from './components/common/Button';
import './App.css';

// Composant interne LogoutNavButton (inchangé)
const LogoutNavButton = () => {
  const { logoutContext } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutContext();
    navigate('/login');
  };
  return (
    <Button onClick={handleLogout} variant="secondary" className="logout-button">
      Déconnexion
    </Button>
  );
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Router>
      <div className="App">
        {/* --- nav (inchangée) --- */}
        <nav className="main-nav">
         <ul>
            {isAuthenticated && (
              <li><Link to="/">Accueil</Link></li>
            )}
            {!isLoading && !isAuthenticated && (
              <>
                <li><Link to="/register">Inscription</Link></li>
                <li><Link to="/login">Connexion</Link></li>
              </>
            )}
             {isAuthenticated && (
              <li>
                <LogoutNavButton />
              </li>
            )}
          </ul>
        </nav>

        <main className="content-area">
          <Routes>
            {/* Routes Publiques */}
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/* --- AJOUTER LA ROUTE PARAMÉTRÉE --- */}
            {/* Le nom du paramètre (:resetToken) doit correspondre à ce qu'on utilise avec useParams */}
            <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />

            {/* Routes Protégées */}
            <Route
              path="/"
              element={<ProtectedRoute><HomePage /></ProtectedRoute>}
            />
            {/* ... autres routes protégées ... */}
          </Routes>
        </main>

        {/* --- footer (inchangé) --- */}
        <footer className="main-footer">
          <p>© {new Date().getFullYear()} Task Manager</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;