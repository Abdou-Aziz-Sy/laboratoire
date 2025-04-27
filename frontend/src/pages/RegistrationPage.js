// --- fichier: frontend/src/pages/RegistrationPage.js ---
import React from 'react';
import { Link } from 'react-router-dom'; // Importe Link pour la navigation
import RegistrationForm from '../components/Auth/RegistrationForm';
import styles from './RegistrationPage.module.css'; // Créer ce fichier CSS

function RegistrationPage() {
  return (
    <div className={styles.pageContainer}>
      {/* La classe 'card' est gérée dans RegistrationForm.module.css */}
      <RegistrationForm />
      <p className={styles.loginLink}>
        Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
      </p>
    </div>
  );
}

export default RegistrationPage;