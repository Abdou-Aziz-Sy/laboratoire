// --- fichier: frontend/src/context/DragDropContext.js ---
import React, { createContext, useState, useContext, useCallback } from 'react';
import { updateTaskStatus } from '../api/taskService';
import { useToast } from './ToastContext';

// Création du contexte
const DragDropContext = createContext();

/**
 * Provider pour gérer les opérations de drag & drop des tâches
 * @param {Object} props - Props du composant
 * @param {React.ReactNode} props.children - Composants enfants
 */
export function DragDropProvider({ children }) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [lastDroppedTask, setLastDroppedTask] = useState(null);
  const { showToast } = useToast();

  // Appel API pour mettre à jour le statut d'une tâche avec gestion optimiste de l'UI
  const changeTaskStatus = useCallback(async (taskId, newStatus, onSuccess, onOptimisticUpdate) => {
    // Récupérer les informations de la tâche avant la mise à jour pour un éventuel rollback
    const taskBeforeUpdate = pendingUpdates[taskId]?.originalTask || 'unknown';
    const originalStatus = typeof taskBeforeUpdate !== 'string' ? taskBeforeUpdate.statut : null;
    
    // Stocker l'horodatage du changement pour les animations
    const updateTimestamp = new Date().toISOString();
    
    // Marquer cette tâche comme étant en cours de mise à jour
    setPendingUpdates(prev => ({
      ...prev,
      [taskId]: {
        status: 'pending',
        originalTask: taskBeforeUpdate !== 'unknown' ? taskBeforeUpdate : null,
        targetStatus: newStatus,
        timestamp: updateTimestamp
      }
    }));
    
    // Appliquer immédiatement la mise à jour visuelle (optimiste)
    if (onOptimisticUpdate) {
      // Ajouter l'horodatage pour permettre des animations lors du changement de statut
      onOptimisticUpdate(taskId, newStatus, false, { lastUpdated: updateTimestamp });
    }
    
    try {
      // Envoi de la requête API avec gestion silencieuse des erreurs
      const result = await updateTaskStatus(taskId, newStatus, true);
      
      // Vérifier si la mise à jour a réussi
      if (result && result.success === false) {
        throw result.error || new Error(result.message || 'Erreur lors de la mise à jour');
      }
      
      // Stocker la dernière tâche déposée avec succès pour permettre des animations
      setLastDroppedTask({
        taskId,
        newStatus,
        timestamp: updateTimestamp
      });
      
      // Mise à jour réussie, mettre à jour l'état et notifier
      setPendingUpdates(prev => {
        const newState = { ...prev };
        delete newState[taskId];
        return newState;
      });
      
      showToast({
        type: 'success',
        message: `Le statut de la tâche a été mis à jour avec succès.`,
      });
      
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      // Erreur lors de la mise à jour - revenir à l'état précédent (rollback)
      setPendingUpdates(prev => {
        const newState = { ...prev };
        delete newState[taskId];
        return newState;
      });
      
      // Appliquer le rollback visuel si on a l'état original
      if (originalStatus && onOptimisticUpdate) {
        onOptimisticUpdate(taskId, originalStatus, true, { error: true });
      }
      
      // Mettre à jour l'état des mises à jour en attente pour indiquer une erreur
      setPendingUpdates(prev => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          status: 'error'
        }
      }));
      
      // Nettoyer l'état d'erreur après 2 secondes
      setTimeout(() => {
        setPendingUpdates(prev => {
          const newState = { ...prev };
          delete newState[taskId];
          return newState;
        });
      }, 2000);
      
      // Afficher le message d'erreur
      showToast({
        type: 'error',
        message: error.message || 'Erreur lors du changement de statut de la tâche',
        duration: 5000  // Durée plus longue pour les erreurs
      });
      
      console.error('Erreur lors du changement de statut:', error);
      return { success: false, error };
    }
  }, [pendingUpdates, showToast]);

  // Début du drag d'une tâche
  const startDrag = useCallback((task) => {
    setIsDragging(true);
    setDraggedTask(task);
  }, []);

  // Fin du drag
  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedTask(null);
  }, []);

  const contextValue = {
    isDragging,
    draggedTask,
    pendingUpdates,
    lastDroppedTask,
    startDrag,
    endDrag,
    changeTaskStatus,
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
    </DragDropContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte de drag & drop
 * @returns {Object} Le contexte de drag & drop
 */
export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop doit être utilisé à l\'intérieur d\'un DragDropProvider');
  }
  return context;
}