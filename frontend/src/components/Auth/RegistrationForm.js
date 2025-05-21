// --- fichier: frontend/src/components/Auth/RegistrationForm.js ---
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authService';
import { InputField } from '../common/InputField';
import styles from './RegistrationForm.module.css';

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // --- Fonctions de Validation (pures) ---

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  // --- Validation Logique (ne met pas à jour l'état directement) ---
  const checkFieldValidity = useCallback((name, value, currentFormData) => {
    let error = null;
    if (!value || (typeof value === 'string' && !value.trim())) {
        error = 'Ce champ est requis.';
    } else if (name === 'email' && !validateEmail(value)) {
        error = "Format d'email invalide.";
    } else if (name === 'password' && !validatePassword(value)) {
        error = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.';
    } else if (name === 'confirmPassword' && value !== currentFormData.password) {
        error = 'Les mots de passe ne correspondent pas.';
    }
    return error;
  }, []);

  // --- Gestionnaires d'Événements ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Valide le champ en cours si il a déjà été touché ou a une erreur
     if (touchedFields[name] || validationErrors[name]) {
       const error = checkFieldValidity(name, value, newFormData);
       setValidationErrors(prevErrors => ({
         ...prevErrors,
         [name]: error,
         // Si on change le mdp, revalide aussi la confirmation si elle a été touchée
         ...(name === 'password' && (touchedFields.confirmPassword || validationErrors.confirmPassword) && {
             confirmPassword: checkFieldValidity('confirmPassword', newFormData.confirmPassword, newFormData)
         })
       }));
     }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
     // Marque le champ comme touché
     setTouchedFields(prev => ({ ...prev, [name]: true }));
     // Effectue la validation pour ce champ
    const error = checkFieldValidity(name, value, formData);
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
      // Si on quitte le champ mdp, revalide aussi la confirmation si elle a été touchée
      ...(name === 'password' && (touchedFields.confirmPassword || validationErrors.confirmPassword) && {
        confirmPassword: checkFieldValidity('confirmPassword', formData.confirmPassword, formData)
      })
    }));
  };


  // --- Calcul de la validité (mémoïsé pour l'optimisation) ---
  const isFormValid = useMemo(() => {
      // Vérifie que tous les champs requis sont remplis
      const allFilled = Object.values(formData).every(value => value && String(value).trim() !== '');
      if (!allFilled) return false;

      // Vérifie qu'il n'y a pas d'erreurs de validation actives
      // Note: si validationErrors est vide (objet {}), on considère le formulaire valide
      const errors = Object.values(validationErrors);
      const noErrors = errors.length === 0 || errors.every(error => !error);

      // Vérification finale de la logique métier
      const passwordMatch = formData.password === formData.confirmPassword;
      const emailOk = validateEmail(formData.email);
      const passwordOk = validatePassword(formData.password);

      return noErrors && passwordMatch && emailOk && passwordOk;

  }, [formData, validationErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouchedFields(allTouched);

    const currentErrors = Object.keys(formData).reduce((acc, name) => {
        const error = checkFieldValidity(name, formData[name], formData);
        if (error) acc[name] = error;
        return acc;
    }, {});
    setValidationErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
        setIsLoading(true);
        try {
            const { confirmPassword, ...userData } = formData;
            await register(userData);
            setIsLoading(false);
            alert('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
            navigate('/login');
        } catch (error) {
            setIsLoading(false);
            setApiError(error.message || "Une erreur inconnue s'est produite lors de l'inscription.");
            console.error("Erreur API Inscription:", error);
        }
    } else {
        console.log('Formulaire invalide', currentErrors);
    }
  };

  // --- Rendu JSX ---

  return (
    <form onSubmit={handleSubmit} className={styles.registrationForm} noValidate>
      <h2 className={styles.formTitle}>Créer un compte</h2>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <InputField
            label="Prénom"
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Entrez votre prénom"
            error={touchedFields.firstName ? validationErrors.firstName : null}
            required
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <InputField
            label="Nom"
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Entrez votre nom"
            error={touchedFields.lastName ? validationErrors.lastName : null}
            required
            className={styles.formInput}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="Adresse Email"
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="exemple@domaine.com"
          error={touchedFields.email ? validationErrors.email : null}
          required
          className={styles.formInput}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="Mot de passe"
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="********"
          error={touchedFields.password ? validationErrors.password : null}
          required
          className={styles.formInput}
        />
        {touchedFields.password && formData.password && !validatePassword(formData.password) && (
          <p className={styles.passwordHint}>8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre.</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="Confirmer le mot de passe"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="********"
          error={touchedFields.confirmPassword ? validationErrors.confirmPassword : null}
          required
          className={styles.formInput}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className={styles.submitButton}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner}>
            <span className={styles.spinner}></span>
            <span>Inscription en cours...</span>
          </div>
        ) : (
          <span>S'inscrire</span>
        )}
      </button>
    </form>
  );
}

export default RegistrationForm;