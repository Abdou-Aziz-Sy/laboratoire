// --- fichier: frontend/src/components/UI/Toast.js ---
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Toast.module.css';

/**
 * Composant de notification Toast
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.type - Type de toast ('success', 'error', 'info', 'warning')
 * @param {string} props.message - Message à afficher
 * @param {number} props.duration - Durée d'affichage en ms
 * @param {Function} props.onClose - Callback pour fermer le toast
 */
function Toast({ type, message, duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Gestion de la fermeture avec animation - mis en place avec useCallback pour éviter les re-render
  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Durée de l'animation de sortie
  }, [onClose]);

  // Effet pour gérer l'apparition du toast
  useEffect(() => {
    // Animation d'entrée
    const timerId = setTimeout(() => setIsVisible(true), 50);
    
    // Auto-fermeture après la durée spécifiée
    const closeTimerId = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => {
      clearTimeout(timerId);
      clearTimeout(closeTimerId);
    };
  }, [duration, handleClose]);

  // Déterminer les icônes en fonction du type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        ${styles.toast} 
        ${styles[type]} 
        ${isVisible ? styles.visible : ''} 
        ${isLeaving ? styles.leaving : ''}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.iconContainer}>
        {getIcon()}
      </div>
      <div className={styles.messageContainer}>
        <p className={styles.message}>{message}</p>
      </div>
      <button 
        className={styles.closeButton} 
        onClick={handleClose}
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

export default Toast;
