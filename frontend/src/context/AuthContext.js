// --- fichier: frontend/src/context/AuthContext.js ---
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCurrentUser, storeAuthToken, removeAuthToken, getAuthToken } from '../api/authService'; // Fonctions à créer/adapter dans authService

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Informations de l'utilisateur connecté
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Pour gérer le chargement initial
  const [dashboardSession, setDashboardSession] = useState(null); // Pour stocker l'état du dashboard

  // Fonction pour vérifier si un token existe et tenter de récupérer l'utilisateur au chargement
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    const token = getAuthToken(); // Récupère le token depuis le stockage
    if (token) {
      try {
        // Optionnel mais recommandé: Valider le token en récupérant les infos user
        const userData = await getCurrentUser(); // Appel API pour /api/users/me (par exemple)
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Échec de la validation du token:", error);
        removeAuthToken(); // Token invalide ou expiré, on le supprime
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
       setUser(null);
       setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  // Vérifier le statut au montage initial du provider
  useEffect(() => {
    checkAuthStatus();
    
    // Restaurer la session dashboard du localStorage si elle existe
    const savedDashboardSession = localStorage.getItem('dashboardSession');
    if (savedDashboardSession) {
      try {
        setDashboardSession(JSON.parse(savedDashboardSession));
      } catch (error) {
        console.error("Erreur lors de la restauration de la session dashboard:", error);
        localStorage.removeItem('dashboardSession');
      }
    }
  }, [checkAuthStatus]);

  // Fonction appelée après une connexion réussie
  const loginContext = (userData, token) => {
    storeAuthToken(token); // Stocke le token
    setUser(userData);     // Met à jour l'utilisateur dans le contexte
    setIsAuthenticated(true);
    
    // Initialisation de la session dashboard
    const initialDashboardSession = {
      lastVisit: new Date().toISOString(),
      preferences: { layout: 'default' }
    };
    setDashboardSession(initialDashboardSession);
    localStorage.setItem('dashboardSession', JSON.stringify(initialDashboardSession));
    
    // La redirection sera effectuée dans le composant LoginForm via useNavigate
    // pour respecter les règles d'utilisation des hooks React
  };

  // Fonction pour la déconnexion
  const logoutContext = () => {
    removeAuthToken(); // Supprime le token
    setUser(null);
    setIsAuthenticated(false);
    // Suppression de la session dashboard
    localStorage.removeItem('dashboardSession');
    setDashboardSession(null);
    // La redirection se fera dans le composant qui appelle logout
  };

  // Fonction pour mettre à jour les préférences dashboard
  const updateDashboardSession = (updates) => {
    const updatedSession = { ...dashboardSession, ...updates, lastVisit: new Date().toISOString() };
    setDashboardSession(updatedSession);
    localStorage.setItem('dashboardSession', JSON.stringify(updatedSession));
    return updatedSession;
  };

  // Valeur fournie par le contexte
  const value = {
    user,
    isAuthenticated,
    isLoading, // Permet aux composants d'afficher un loader si l'authentification initiale est en cours
    loginContext,
    logoutContext,
    checkAuthStatus, // Peut être utile pour rafraîchir manuellement
    dashboardSession,
    updateDashboardSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour consommer le contexte facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};