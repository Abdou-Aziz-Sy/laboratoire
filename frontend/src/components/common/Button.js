// --- fichier: frontend/src/components/common/Button.js ---
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css'; // Nous allons créer ce fichier CSS

const Button = ({
  children, // Le texte ou l'icône à l'intérieur du bouton
  onClick,
  type = 'button', // Type par défaut
  disabled = false,
  className = '', // Permet de passer des classes supplémentaires
  variant = 'primary', // Optionnel: pour différents styles (primary, secondary, etc.)
  ...rest // Autres props natives
}) => {

  // Combine les classes CSS Modules de base, la variante, et les classes externes
  const buttonClasses = `
    ${styles.button}
    ${styles[variant] || styles.primary}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses.trim()} // trim() pour enlever les espaces superflus
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired, // Peut être du texte, un élément, etc.
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.string, // ex: 'primary', 'secondary', 'danger'
};

// Export nommé (correspondant à l'import avec {})
export { Button };
