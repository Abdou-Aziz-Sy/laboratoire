// --- fichier: frontend/src/pages/ResetPasswordPage.js ---
import React from 'react';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm'; // Import default
import styles from './ResetPasswordPage.module.css'; // Créer ce fichier CSS

function ResetPasswordPage() {
  return (
    <div className={styles.pageContainer}>
      <ResetPasswordForm />
      {/* Le lien de retour est géré dans le formulaire après succès */}
    </div>
  );
}

export default ResetPasswordPage;