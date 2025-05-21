// --- fichier: frontend/src/context/ToastContext.js ---
import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/UI/Toast';
import styles from './ToastContext.module.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, duration = 5000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, type, message, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Fonctions d'aide pour différents types de notifications
  const success = (message, duration) => addToast('success', message, duration);
  const error = (message, duration) => addToast('error', message, duration);
  const info = (message, duration) => addToast('info', message, duration);
  const warning = (message, duration) => addToast('warning', message, duration);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};