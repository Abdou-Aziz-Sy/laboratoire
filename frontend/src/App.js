// React and related imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { getAuthToken } from './api/authService';
import './App.css';

// Pages imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TaskListPage from './pages/TaskListPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';

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
    <ToastProvider>
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
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Routes protégées pour les tâches */}
            <Route path="/tasks" element={<PrivateRoute element={<TaskListPage />} />} />
            <Route path="/tasks/create" element={<PrivateRoute element={<CreateTaskPage />} />} />
            <Route path="/tasks/:taskId/edit" element={<PrivateRoute element={<EditTaskPage />} />} />
            
            {/* Routes protégées temporaires */}
            <Route path="/dashboard" element={<PrivateRoute element={<TemporaryPage pageName="Tableau de bord" />} />} />
            <Route path="/profile" element={<PrivateRoute element={<TemporaryPage pageName="Profil" />} />} />
            
            {/* Route 404 */}
            <Route path="*" element={<TemporaryPage pageName="404 - Page non trouvée" />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;