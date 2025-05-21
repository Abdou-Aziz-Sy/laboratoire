// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages publiques
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';

// Pages protégées
import CreateTaskPage from './pages/CreateTaskPage';
import TaskListPage from './pages/TaskListPage';

// Contexte d'authentification et layout protégé
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './components/common/ProtectedLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Routes protégées */}
            <Route 
              path="/create-task" 
              element={
                <ProtectedLayout>
                  <CreateTaskPage />
                </ProtectedLayout>
              } 
            />
            
            {/* Ajouter la route pour la liste des tâches */}
            <Route 
              path="/tasks" 
              element={
                <ProtectedLayout>
                  <TaskListPage />
                </ProtectedLayout>
              } 
            />
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;