// --- fichier: frontend/src/components/Auth/ResetPasswordForm.js ---
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom'; // useParams pour extraire le token
import styles from './ResetPasswordForm.module.css'; // Créer ce fichier CSS
import { InputField } from '../common/InputField';
import { Button } from '../common/Button';
import { resetPassword } from '../../api/authService'; // Importe la fonction API

function ResetPasswordForm() {
  const navigate = useNavigate();
  // Extraction du token depuis les paramètres de l'URL
  const { resetToken } = useParams(); // Doit correspondre au nom dans la route de App.js

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Vérifie si le token est présent au montage (sécurité basique)
  useEffect(() => {
    if (!resetToken) {
      setApiError("Token de réinitialisation manquant ou invalide.");
      // Optionnel: rediriger ou afficher un message plus permanent
    }
  }, [resetToken]);

  // --- Fonctions de Validation (similaires à l'inscription) ---
  const validatePassword = (password) => {
    // Règle: min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const checkFieldValidity = (name, value, currentFormData) => {
    let error = null;
    if (!value || !value.trim()) {
      error = 'Ce champ est requis.';
    } else if (name === 'newPassword' && !validatePassword(value)) {
      error = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.';
    } else if (name === 'confirmPassword' && value !== currentFormData.newPassword) {
      error = 'Les mots de passe ne correspondent pas.';
    }
    return error;
  };

  // --- Gestionnaires d'Événements ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (touchedFields[name] || validationErrors[name]) {
       const error = checkFieldValidity(name, value, newFormData);
       setValidationErrors(prev => ({
         ...prev,
         [name]: error,
         // Si on change newPassword, revalide confirmPassword si touché
         ...(name === 'newPassword' && (touchedFields.confirmPassword || validationErrors.confirmPassword) && {
             confirmPassword: checkFieldValidity('confirmPassword', newFormData.confirmPassword, newFormData)
         })
       }));
     }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = checkFieldValidity(name, value, formData);
    setValidationErrors(prev => ({
        ...prev,
        [name]: error,
        // Si on quitte newPassword, revalide confirmPassword si touché
        ...(name === 'newPassword' && (touchedFields.confirmPassword || validationErrors.confirmPassword) && {
          confirmPassword: checkFieldValidity('confirmPassword', formData.confirmPassword, formData)
        })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    // Marque tous les champs comme touchés pour afficher les erreurs potentielles
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouchedFields(allTouched);

    // Recalcule et met à jour toutes les erreurs
    const currentErrors = Object.keys(formData).reduce((acc, name) => {
        const error = checkFieldValidity(name, formData[name], formData);
        if (error) acc[name] = error;
        return acc;
    }, {});
    setValidationErrors(currentErrors);

    // Vérifie s'il y a des erreurs ou si le token est manquant
    if (Object.keys(currentErrors).length > 0 || !resetToken) {
        console.log('Formulaire invalide ou token manquant', currentErrors);
        if(!resetToken && !apiError) setApiError("Token de réinitialisation invalide."); // Assure un message si le token est le problème
        return;
    }

    setIsLoading(true);
    try {
        // Appel API avec le token de l'URL et le nouveau mot de passe
        await resetPassword(resetToken, formData.newPassword);

        setIsLoading(false);
        setSuccessMessage("Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.");
        // Optionnel: Vider le formulaire
        setFormData({ newPassword: '', confirmPassword: '' });
        // Ne pas rediriger immédiatement pour que l'utilisateur voie le message.
        // On pourrait ajouter un bouton/lien pour aller à la connexion.

    } catch (error) {
        setIsLoading(false);
        // Afficher l'erreur renvoyée par l'API (ex: token invalide/expiré)
        setApiError(error.message || "Impossible de réinitialiser le mot de passe. Le lien est peut-être invalide ou expiré.");
        console.error("Erreur API Reset Password:", error);
    }
  };

  // Ne rend le formulaire que si le token existe initialement
  // (évite un flash si on arrive sans token)
  if (!resetToken && !apiError) {
      return <div className={styles.apiError}>Token de réinitialisation manquant dans l'URL.</div>;
  }


  return (
    <div className={styles.resetPasswordFormContainer}>
      <form onSubmit={handleSubmit} className={styles.resetPasswordForm} noValidate>
        <h2>Réinitialiser votre mot de passe</h2>

        {/* Affiche succès OU erreur */}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {apiError && !successMessage && <div className={styles.apiError}>{apiError}</div>}

        {/* N'affiche le formulaire que s'il n'y a pas de succès */}
        {!successMessage && (
          <>
            <p className={styles.instructions}>
              Veuillez saisir votre nouveau mot de passe ci-dessous.
            </p>
            <InputField
              label="Nouveau mot de passe"
              type="password"
              name="newPassword"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="********"
              error={touchedFields.newPassword ? validationErrors.newPassword : null}
              required
              disabled={isLoading}
            />
            {/* Indice de complexité */}
            {touchedFields.newPassword && formData.newPassword && !validatePassword(formData.newPassword) && (
              <p className={styles.passwordHint}>8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre.</p>
            )}

            <InputField
              label="Confirmer le nouveau mot de passe"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="********"
              error={touchedFields.confirmPassword ? validationErrors.confirmPassword : null}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
              variant="primary"
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </>
        )}

        {/* Lien pour retourner à la connexion après succès */}
        {successMessage && (
            <div className={styles.loginLinkContainer}>
                <Link to="/login">Retour à la connexion</Link>
            </div>
        )}
      </form>
    </div>
  );
}

export default ResetPasswordForm;