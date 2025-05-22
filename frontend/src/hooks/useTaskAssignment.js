// --- fichier: frontend/src/hooks/useTaskAssignment.js ---
import { useState, useCallback } from 'react';
import { assignTask, getTaskAssignees } from '../api/taskService';
import useNotifications from './useNotifications';

/**
 * Hook personnalisé pour gérer la logique d'assignation de tâches
 * @returns {Object} - Méthodes et états pour l'assignation de tâches
 */
const useTaskAssignment = () => {
  const [assignees, setAssignees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const notifications = useNotifications();

  /**
   * Récupère la liste des utilisateurs assignés à une tâche
   * @param {string} taskId - L'ID de la tâche
   * @returns {Promise<Array>} Liste des assignés
   */
  const fetchAssignees = useCallback(async (taskId) => {
    if (!taskId) {
      setAssignees([]);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const assigneesList = await getTaskAssignees(taskId);
      setAssignees(assigneesList);
      return assigneesList;
    } catch (err) {
      const errorInfo = notifications.handleError(err);
      setError(errorInfo);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  /**
   * Assigne une tâche à un ou plusieurs utilisateurs
   * @param {string} taskId - L'ID de la tâche
   * @param {Array<string>} userIds - IDs des utilisateurs à assigner
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  const assignUsersToTask = useCallback(async (taskId, userIds) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await notifications.withAsyncNotification(
        async () => await assignTask(taskId, userIds),
        {
          successMessage: `${userIds.length > 1 ? 'Utilisateurs assignés' : 'Utilisateur assigné'} avec succès à la tâche`,
          onSuccess: () => fetchAssignees(taskId)
        }
      );
      return result;
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [notifications, fetchAssignees]);

  /**
   * Retire l'assignation d'un utilisateur à une tâche
   * @param {string} taskId - L'ID de la tâche
   * @param {string} userId - L'ID de l'utilisateur à retirer
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  const removeUserFromTask = useCallback(async (taskId, userId) => {
    // Récupérer les assignés actuels et filtrer pour retirer l'utilisateur spécifié
    const currentAssignees = [...assignees];
    const updatedUserIds = currentAssignees
      .filter(user => user.id !== userId)
      .map(user => user.id);

    return await assignUsersToTask(taskId, updatedUserIds);
  }, [assignees, assignUsersToTask]);

  /**
   * Gère les erreurs liées à l'assignation
   * @param {Error} error - L'erreur à gérer
   */
  const handleAssignmentError = useCallback((error) => {
    notifications.showError(`Erreur d'assignation: ${error.message || 'Une erreur est survenue'}`);
    setError(error);
  }, [notifications]);

  return {
    // États
    assignees,
    isLoading,
    error,
    
    // Actions
    fetchAssignees,
    assignUsersToTask,
    removeUserFromTask,
    handleAssignmentError,
    
    // Réinitialisation
    reset: useCallback(() => {
      setAssignees([]);
      setError(null);
    }, [])
  };
};

export default useTaskAssignment;
