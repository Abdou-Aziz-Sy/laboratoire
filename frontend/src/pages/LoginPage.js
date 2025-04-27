// --- fichier: frontend/src/pages/LoginPage.js ---
import React from 'react';
import LoginForm from '../components/Auth/LoginForm'; // Note: import default
import styles from './LoginPage.module.css'; // Créer ce fichier CSS

function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <LoginForm />
      {/* Le lien vers l'inscription est maintenant DANS LoginForm, mais on pourrait en ajouter d'autres ici si besoin */}
    </div>
  );
}

export default LoginPage;