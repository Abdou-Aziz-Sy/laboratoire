// --- fichier: frontend/src/components/Auth/ForgotPasswordForm.js ---
import React, { useState } from 'react';
import styles from './ForgotPasswordForm.module.css';
import { InputField } from '../common/InputField';
import { forgotPassword } from '../../api/authService';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation simple
    if (!email || !email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }
    // Validation format email côté client
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       setError("Format d'email invalide.");
       return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSuccessMessage(
        'Si un compte est associé à cet email, vous recevrez des instructions pour réinitialiser votre mot de passe.'
      );
      setEmail('');
    } catch (err) {
      setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.forgotPasswordForm} noValidate>
      <h2 className={styles.formTitle}>Mot de passe oublié ?</h2>
      
      {!successMessage && (
        <p className={styles.instructions}>
          Entrez votre adresse email ci-dessous. Si un compte correspondant existe, nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      )}

      {/* Affiche le message de succès SI il existe */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      
      {/* Affiche le message d'erreur SI il existe ET qu'il n'y a pas de message de succès */}
      {error && !successMessage && <div className={styles.apiError}>{error}</div>}

      {/* N'affiche le formulaire que s'il n'y a pas de message de succès */}
      {!successMessage && (
        <>
          <div className={styles.inputGroup}>
            <InputField
              label="Adresse Email"
              type="email"
              name="email"
              id="forgot-email"
              value={email}
              onChange={handleChange}
              placeholder="exemple@domaine.com"
              required
              disabled={isLoading}
              className={styles.formInput}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <div className={styles.loadingSpinner}>
                <span className={styles.spinner}></span>
                <span>Envoi en cours...</span>
              </div>
            ) : (
              <span>Envoyer le lien de réinitialisation</span>
            )}
          </button>
        </>
      )}
    </form>
  );
}

export default ForgotPasswordForm;