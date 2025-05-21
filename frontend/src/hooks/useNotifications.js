// --- fichier: frontend/src/hooks/useNotifications.js ---
import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { handleApiError, getSuccessMessage } from '../utils/errorHandler';

/**
 * Hook personnalisu00e9 pour gu00e9rer les notifications et les erreurs
 * Facilite l'utilisation du systu00e8me de toast et la gestion des erreurs
 * @returns {Object} - Mu00e9thodes et u00e9tats liu00e9s aux notifications
 */
const useNotifications = () => {
  const toast = useToast();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Affiche un message de succu00e8s
   * @param {string} message - Message u00e0 afficher
   * @param {number} duration - Duru00e9e d'affichage (optionnel)
   */
  const showSuccess = useCallback((message, duration) => {
    toast.success(message, duration);
  }, [toast]);

  /**
   * Affiche un message d'erreur
   * @param {string} message - Message u00e0 afficher
   * @param {number} duration - Duru00e9e d'affichage (optionnel)
   */
  const showError = useCallback((message, duration) => {
    toast.error(message, duration);
    setError({ message }); // Stocker l'erreur dans l'u00e9tat local
  }, [toast]);

  /**
   * Affiche un message d'information
   * @param {string} message - Message u00e0 afficher
   * @param {number} duration - Duru00e9e d'affichage (optionnel)
   */
  const showInfo = useCallback((message, duration) => {
    toast.info(message, duration);
  }, [toast]);

  /**
   * Affiche un message d'avertissement
   * @param {string} message - Message u00e0 afficher
   * @param {number} duration - Duru00e9e d'affichage (optionnel)
   */
  const showWarning = useCallback((message, duration) => {
    toast.warning(message, duration);
  }, [toast]);

  /**
   * Gu00e8re une erreur d'API de fau00e7on standardisu00e9e
   * @param {Error} error - L'erreur u00e0 gu00e9rer
   */
  const handleError = useCallback((error) => {
    const errorInfo = handleApiError(error, toast);
    setError(errorInfo);
    return errorInfo;
  }, [toast]);

  /**
   * Nettoie l'u00e9tat d'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Notification de succu00e8s standardisu00e9e pour les actions CRUD
   * @param {string} actionType - Type d'action (create, update, delete, etc.)
   * @param {string} itemType - Type d'u00e9lu00e9ment concernu00e9 (tu00e2che, projet, etc.)
   * @param {string} itemName - Nom ou identifiant de l'u00e9lu00e9ment (optionnel)
   */
  const notifySuccess = useCallback((actionType, itemType, itemName) => {
    const message = getSuccessMessage(actionType, itemType, itemName);
    showSuccess(message);
  }, [showSuccess]);

  /**
   * Exu00e9cute une fonction asynchrone avec gestion d'u00e9tat de chargement et d'erreurs
   * @param {Function} asyncFunction - Fonction asynchrone u00e0 exu00e9cuter
   * @param {Object} options - Options
   * @param {string} options.successMessage - Message de succu00e8s u00e0 afficher
   * @param {boolean} options.showLoadingToast - Afficher ou non un toast durant le chargement
   * @returns {Promise} - Ru00e9sultat de la fonction asynchrone
   */
  const withAsyncNotification = useCallback(async (asyncFunction, options = {}) => {
    const { successMessage, showLoadingToast = false, onSuccess, onError } = options;
    setLoading(true);
    clearError();
    
    if (showLoadingToast) {
      toast.info('Traitement en cours...', 0); // Duru00e9e 0 = reste jusqu'u00e0 u00eatre enlevu00e9 manuellement
    }
    
    try {
      const result = await asyncFunction();
      
      if (successMessage) {
        showSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      setLoading(false);
      return result;
    } catch (err) {
      const errorInfo = handleError(err);
      
      if (onError) {
        onError(errorInfo);
      }
      
      setLoading(false);
      throw errorInfo; // Re-throw pour permettre une gestion externe si nu00e9cessaire
    }
  }, [toast, showSuccess, handleError, clearError]);

  return {
    // u00c9tats
    error,
    loading,
    
    // Mu00e9thodes de notification
    showSuccess,
    showError,
    showInfo,
    showWarning,
    notifySuccess,
    
    // Gestion des erreurs
    handleError,
    clearError,
    
    // Utilitaire pour opu00e9rations asynchrones
    withAsyncNotification
  };
};

export default useNotifications;
