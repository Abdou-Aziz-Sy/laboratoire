// --- fichier: frontend/src/components/common/InputField.js ---
import React from 'react';
import PropTypes from 'prop-types'; // Bonne pratique : définir les types de props
import styles from './InputField.module.css'; // Nous allons créer ce fichier CSS

const InputField = ({
  label,
  type = 'text', // Valeur par défaut
  name,
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required,
  ...rest // Pour passer d'autres props natives comme aria-describedby etc.
}) => {

  const hasError = Boolean(error); // Convertit le message d'erreur (string ou null) en booléen

  return (
    <div className={`${styles.inputGroup} ${hasError ? styles.inputError : ''}`}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label}{required && <span className={styles.requiredIndicator}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={id || name} // Utilise id s'il est fourni, sinon name
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={styles.input} // Applique la classe de base
        aria-invalid={hasError} // Pour l'accessibilité
        aria-describedby={hasError ? `${id || name}-error` : undefined} // Lie à l'erreur
        {...rest}
      />
      {/* Affiche le message d'erreur s'il existe */}
      {hasError && (
        <p id={`${id || name}-error`} className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Définition des types de props pour la validation et la documentation
InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired, // name est essentiel pour la gestion du formulaire
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string, // L'erreur est une chaîne ou null/undefined
  required: PropTypes.bool,
};

// Export nommé (correspondant à l'import avec {})
export { InputField };
