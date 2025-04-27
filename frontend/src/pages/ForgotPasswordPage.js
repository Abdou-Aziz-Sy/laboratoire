// --- fichier: frontend/src/pages/ForgotPasswordPage.js ---
import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm'; // Import default
import styles from './ForgotPasswordPage.module.css'; // Créer ce fichier CSS

function ForgotPasswordPage() {
  return (
    <div className={styles.pageContainer}>
      <ForgotPasswordForm />
      <p className={styles.backLink}>
        <Link to="/login">Retour à la connexion</Link>
      </p>
    </div>
  );
}

export default ForgotPasswordPage;