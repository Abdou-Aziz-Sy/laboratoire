// --- fichier: frontend/src/pages/RegistrationPage.js ---
import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/Auth/RegistrationForm';
import styles from './RegistrationPage.module.css';
import WaveBackground from '../components/Home/WaveBackground';

function RegistrationPage() {
  return (
    <div className={styles.pageContainer}>
      <WaveBackground />
      
      <Link to="/" className={styles.logoLink}>TaskHandler</Link>
      
      <div className={styles.contentWrapper}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Rejoignez <span className={styles.highlight}>TaskHandler</span>
          </h1>
          <p className={styles.welcomeText}>
            Créez votre compte et commencez à organiser vos tâches et projets comme jamais auparavant.
          </p>
        </div>
        
        <div className={styles.formSection}>
          <RegistrationForm />
          <p className={styles.loginLink}>
            Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;