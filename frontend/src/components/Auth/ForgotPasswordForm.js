// --- fichier: frontend/src/components/Auth/ForgotPasswordForm.js ---
import React, { useState } from 'react';
import styles from './ForgotPasswordForm.module.css'; // Créer ce fichier CSS
import { InputField } from '../common/InputField';
import { Button } from '../common/Button';
import { forgotPassword } from '../../api/authService';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Pour le message de confirmation

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Réinitialise les messages

    // Validation simple
    if (!email || !email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }
    // Optionnel : validation format email côté client
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       setError("Format d'email invalide.");
       return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      // Toujours afficher un message de succès générique
      setSuccessMessage(
        'Si un compte est associé à cet email, vous recevrez des instructions pour réinitialiser votre mot de passe.'
      );
      setEmail(''); // Vide le champ après succès
    } catch (err) {
      // Affiche l'erreur générique remontée par authService
      setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.forgotPasswordForm} noValidate>
      <h2>Mot de passe oublié ?</h2>
      <p className={styles.instructions}>
        Entrez votre adresse email ci-dessous. Si un compte correspondant existe, nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      {/* Affiche le message de succès SI il existe */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {/* Affiche le message d'erreur SI il existe ET qu'il n'y a pas de message de succès */}
      {error && !successMessage && <div className={styles.apiError}>{error}</div>}

      {/* N'affiche le formulaire que s'il n'y a pas de message de succès */}
      {!successMessage && (
        <>
          <InputField
            label="Adresse Email"
            type="email"
            name="email"
            id="forgot-email"
            value={email}
            onChange={handleChange}
            placeholder="exemple@domaine.com"
            error={null} // L'erreur globale est affichée au-dessus
            required
            disabled={isLoading} // Désactive pendant le chargement
          />

          <Button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
            variant="primary"
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </Button>
        </>
      )}
    </form>
  );
}

export default ForgotPasswordForm;