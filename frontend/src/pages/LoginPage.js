// --- fichier: frontend/src/pages/LoginPage.js ---
import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import styles from './LoginPage.module.css';
import WaveBackground from '../components/Home/WaveBackground';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <WaveBackground />
      
      <Link to="/" className={styles.logoLink}>TaskHandler</Link>
      
      <div className={styles.contentWrapper}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Bon retour <span className={styles.highlight}>parmi nous</span>
          </h1>
          <p className={styles.welcomeText}>
            Connectez-vous pour retrouver vos projets et continuer à gérer vos tâches efficacement.
          </p>
        </div>
        
        <div className={styles.formSection}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;