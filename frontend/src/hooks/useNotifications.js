// --- fichier: frontend/src/hooks/useNotifications.js ---
import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { handleApiError, getSuccessMessage } from '../utils/errorHandler';

// Types de notifications pour l'assignation de tâches
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_UNASSIGNED: 'TASK_UNASSIGNED',
  ASSIGNMENT_FAILED: 'ASSIGNMENT_FAILED',
  ASSIGNMENT_UPDATED: 'ASSIGNMENT_UPDATED'
};

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
   * Notification de succès standardisée pour les actions CRUD
   * @param {string} actionType - Type d'action (create, update, delete, etc.)
   * @param {string} itemType - Type d'élément concerné (tâche, projet, etc.)
   * @param {string} itemName - Nom ou identifiant de l'élément (optionnel)
   */
  const notifySuccess = useCallback((actionType, itemType, itemName) => {
    const message = getSuccessMessage(actionType, itemType, itemName);
    showSuccess(message);
  }, [showSuccess]);

  /**
   * Notification spécifique pour l'assignation de tâches
   * @param {string} notificationType - Type de notification d'assignation
   * @param {Object} data - Données supplémentaires (nom de la tâche, utilisateurs, etc.)
   */
  const notifyAssignment = useCallback((notificationType, data = {}) => {
    const { taskTitle, userCount, userName } = data;
    let message = '';
    
    switch (notificationType) {
      case NOTIFICATION_TYPES.TASK_ASSIGNED:
        message = userCount > 1
          ? `${userCount} utilisateurs assignés à la tâche ${taskTitle || ''}`
          : `${userName || 'Utilisateur'} assigné à la tâche ${taskTitle || ''}`;
        showSuccess(message);
        break;
      
      case NOTIFICATION_TYPES.TASK_UNASSIGNED:
        message = `${userName || 'Utilisateur'} retiré de la tâche ${taskTitle || ''}`;
        showInfo(message);
        break;
      
      case NOTIFICATION_TYPES.ASSIGNMENT_UPDATED:
        message = `Assignation de la tâche ${taskTitle || ''} mise à jour`;
        showSuccess(message);
        break;
      
      case NOTIFICATION_TYPES.ASSIGNMENT_FAILED:
        message = `Échec de l'assignation de la tâche ${taskTitle || ''}${data.reason ? `: ${data.reason}` : ''}`;
        showError(message);
        break;
      
      default:
        message = data.message || 'Opération d\'assignation effectuée';
        showInfo(message);
    }
    
    return message;
  }, [showSuccess, showInfo, showError]);

  /**
   * Exécute une fonction asynchrone avec gestion d'état de chargement et d'erreurs
   * @param {Function} asyncFunction - Fonction asynchrone à exécuter
   * @param {Object} options - Options
   * @param {string} options.successMessage - Message de succès à afficher
   * @param {boolean} options.showLoadingToast - Afficher ou non un toast durant le chargement
   * @returns {Promise} - Résultat de la fonction asynchrone
   */
  const withAsyncNotification = useCallback(async (asyncFunction, options = {}) => {
    const { successMessage, showLoadingToast = false, onSuccess, onError } = options;
    setLoading(true);
    clearError();
    
    if (showLoadingToast) {
      toast.info('Traitement en cours...', 0); // Durée 0 = reste jusqu'à être enlevé manuellement
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
      throw errorInfo; // Re-throw pour permettre une gestion externe si nécessaire
    }
  }, [toast, showSuccess, handleError, clearError]);

  return {
    // États
    error,
    loading,
    
    // Méthodes de notification
    showSuccess,
    showError,
    showInfo,
    showWarning,
    notifySuccess,
    notifyAssignment,
    
    // Gestion des erreurs
    handleError,
    clearError,
    
    // Utilitaire pour opérations asynchrones
    withAsyncNotification
  };
};

export default useNotifications;
