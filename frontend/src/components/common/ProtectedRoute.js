// --- fichier: frontend/src/components/common/ProtectedRoute.js ---
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Pour garder une trace de la page d'origine

  // 1. Gérer l'état de chargement initial du contexte
  // Pendant que le contexte vérifie le token initial, on ne rend rien ou un spinner
  if (isLoading) {
    // Optionnel : Afficher un indicateur de chargement global
    // return <div>Chargement de l'authentification...</div>;
    return null; // Ou simplement ne rien rendre pour éviter un flash de contenu
  }

  // 2. Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated) {
    // Rediriger vers la page de connexion
    // On passe l'URL actuelle dans l'état de la navigation (`state`)
    // pour pouvoir rediriger l'utilisateur vers cette page après la connexion.
    return <Navigate to="/login" state={{ from: location }} replace />;
    // `replace` évite d'ajouter la page de connexion à l'historique de navigation
    // quand on redirige depuis une route protégée non autorisée.
  }

  // 3. Si authentifié et non en chargement, rendre le composant enfant (la page protégée)
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Le composant de la page à protéger
};

// Utilisation d'un export nommé, cohérent avec InputField/Button
export { ProtectedRoute };