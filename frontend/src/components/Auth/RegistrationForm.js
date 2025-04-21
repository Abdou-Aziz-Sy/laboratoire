import React, { useState } from 'react';
import authService from '../../api/authService';
import styles from './RegistrationForm.module.css'; // Importation des styles CSS Modules
import { useNavigate } from 'react-router-dom'; // Pour la redirection après succès

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null); // Erreur venant du backend
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  const { username, email, password, confirmPassword } = formData;

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Efface l'erreur spécifique au champ lors de la saisie
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    // Efface l'erreur API générale lors de la saisie
    if (apiError) {
      setApiError(null);
    }
    // Efface le message de succès lors de la saisie
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  // Valide le formulaire côté client
  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Le nom d'utilisateur est requis.";
    if (!email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Le format de l'email est invalide.";
    }
    if (!password) {
      newErrors.password = 'Le mot de passe est requis.';
    } else if (password.length < 8) {
      // Validation simple de la force du mot de passe (à améliorer si besoin)
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }
    setErrors(newErrors);
    // Retourne true si pas d'erreurs, false sinon
    return Object.keys(newErrors).length === 0;
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setApiError(null); // Réinitialise les erreurs API précédentes
    setSuccessMessage(null); // Réinitialise les messages de succès précédents

    if (!validateForm()) {
      return; // Arrête si la validation échoue
    }

    setIsLoading(true); // Active l'indicateur de chargement

    try {
      const userData = { username, email, password };
      // Appel au service d'authentification
      await authService.register(userData);

      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      // Optionnel : Vider le formulaire après succès
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      // Optionnel : Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/login'); // Redirection vers la page de connexion
      }, 2000); // Délai de 2 secondes

    } catch (error) {
      console.error("Erreur d'inscription:", error);
      if (error.response && error.response.data) {
        // Tente de récupérer le message d'erreur du backend
        // Adaptez 'error.response.data.message' selon la structure de vos erreurs backend
        const backendErrorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || error.response.data.error || "Une erreur serveur s'est produite.";
         setApiError(backendErrorMessage);
      } else if (error.request) {
         // Erreur réseau (pas de réponse)
         setApiError('Erreur réseau. Impossible de contacter le serveur.');
      } else {
         // Erreur lors de la configuration de la requête
         setApiError('Une erreur inattendue est survenue lors de la préparation de la requête.');
      }
    } finally {
      setIsLoading(false); // Désactive l'indicateur de chargement
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registrationForm} noValidate>
      {/* Affichage de l'erreur API générale */}
      {apiError && <div className={styles.errorApi}>{apiError}</div>}
      {/* Affichage du message de succès */}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleChange}
          className={errors.username ? styles.inputError : ''}
          aria-invalid={errors.username ? "true" : "false"}
          aria-describedby={errors.username ? "username-error" : undefined}
          required
        />
        {errors.username && <span id="username-error" className={styles.error}>{errors.username}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          className={errors.email ? styles.inputError : ''}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
        />
        {errors.email && <span id="email-error" className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          className={errors.password ? styles.inputError : ''}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          required
        />
        {errors.password && <span id="password-error" className={styles.error}>{errors.password}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? styles.inputError : ''}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          required
        />
        {errors.confirmPassword && <span id="confirmPassword-error" className={styles.error}>{errors.confirmPassword}</span>}
      </div>

      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Inscription en cours...' : "S'inscrire"}
      </button>
    </form>
  );
};

export default RegistrationForm;