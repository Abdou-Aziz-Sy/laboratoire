// --- fichier: frontend/src/components/UI/Toast.js ---
import React, { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ type = 'success', message, onClose, autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      case 'warning':
        return '⚠';
      default:
        return '✓';
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]} ${styles.slideIn}`}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{getIcon()}</span>
      </div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
          &times;
        </button>
      )}
    </div>
  );
};

export default Toast;