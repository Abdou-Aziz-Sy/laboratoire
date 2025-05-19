// --- fichier: frontend/src/pages/ForgotPasswordPage.js ---
import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import styles from './ForgotPasswordPage.module.css';
import WaveBackground from '../components/Home/WaveBackground';

function ForgotPasswordPage() {
  return (
    <div className={styles.pageContainer}>
      <WaveBackground />
      
      <Link to="/" className={styles.logoLink}>TaskHandler</Link>
      
      <div className={styles.contentWrapper}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Récupérez votre <span className={styles.highlight}>accès</span>
          </h1>
          <p className={styles.welcomeText}>
            Nous vous aiderons à réinitialiser votre mot de passe et à retrouver l'accès à votre compte.
          </p>
        </div>
        
        <div className={styles.formSection}>
          <ForgotPasswordForm />
          <p className={styles.backLink}>
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;