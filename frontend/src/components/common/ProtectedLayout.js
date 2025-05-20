// --- fichier: frontend/src/components/common/ProtectedLayout.js ---
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProtectedNavbar from './ProtectedNavbar';
import WaveBackground from '../UI/WaveBackground';
import styles from './ProtectedLayout.module.css';

/**
 * Layout pour les pages protu00e9gu00e9es qui nu00e9cessitent une authentification.
 * Inclut la barre de navigation et l'arriu00e8re-plan animu00e9.
 */
const ProtectedLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Vu00e9rifie si l'utilisateur est authentifiu00e9
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Ne rend rien pendant la redirection
  }

  return (
    <div className={styles.protectedLayout}>
      <WaveBackground />
      <ProtectedNavbar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default ProtectedLayout;
