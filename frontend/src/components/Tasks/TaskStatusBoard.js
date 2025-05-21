// --- fichier: frontend/src/components/Tasks/TaskStatusBoard.js ---
import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskStatusColumn from './TaskStatusColumn';
import StatusChangeConfirmation from './StatusChangeConfirmation';
import { useDragDrop } from '../../context/DragDropContext';
import styles from './TaskStatusBoard.module.css';

/**
 * Tableau de bord des tu00e2ches organisu00e9es par statut avec fonctionnalitu00e9 drag & drop
 * @param {Object} props - Les propriu00e9tu00e9s du composant
 * @param {Array} props.tasks - Liste de toutes les tu00e2ches
 * @param {Function} props.onTaskStatusChange - Callback pour le changement de statut
 * @param {Function} props.onDeleteClick - Callback pour l'action de suppression
 */
function TaskStatusBoard({ tasks = [], onTaskStatusChange, onDeleteClick }) {
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false,
    task: null,
    newStatus: '',
    sourceStatus: ''
  });
  const [localTasks, setLocalTasks] = useState([...tasks]);
  const { changeTaskStatus } = useDragDrop(); // Suppression de lastDroppedTask car non utilisé
  
  // Mettre u00e0 jour localTasks lorsque tasks change
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Optimistic update handler pour mettre u00e0 jour localement et visuellement les tu00e2ches
  const handleOptimisticUpdate = useCallback((taskId, newStatus, isRollback = false, additionalProps = {}) => {
    setLocalTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id.toString() === taskId.toString()) {
          // Conserver une ru00e9fu00e9rence u00e0 l'ancien statut pour l'animation
          const previousStatus = task.statut;
          
          return {
            ...task,
            statut: newStatus,
            previousStatus: isRollback ? null : previousStatus,
            lastUpdated: additionalProps.lastUpdated || new Date().toISOString(),
            ...additionalProps
          };
        }
        return task;
      });
    });
  }, []);

  // Organiser les tu00e2ches par statut
  const getTasksByStatus = () => {
    const result = {
      'EN_ATTENTE': [],
      'EN_COURS': [],
      'TERMINEE': []
    };

    // Grouper les tu00e2ches par statut
    localTasks.forEach(task => {
      if (task.statut in result) {
        result[task.statut].push(task);
      } else {
        // Si un statut inconnu est rencontru00e9, placer par du00e9faut en EN_ATTENTE
        result['EN_ATTENTE'].push(task);
      }
    });

    return result;
  };

  // Gu00e9rer la fin d'un drag
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Si pas de destination valide ou si la destination est la mu00eame que la source
    if (!destination || 
        (destination.droppableId === source.droppableId)) {
      return;
    }

    // Trouver la tu00e2che du00e9placu00e9e
    const taskId = draggableId;
    const task = localTasks.find(t => t.id.toString() === taskId);
    
    if (!task) return;

    // Ouvrir le modal de confirmation pour confirmer le changement de statut
    setConfirmModal({
      isOpen: true,
      task,
      newStatus: destination.droppableId,
      sourceStatus: source.droppableId
    });
    
    // Mise u00e0 jour immu00e9diate et visuelle pour donner un retour immu00e9diat u00e0 l'utilisateur
    // La confirmation ru00e9elle aura lieu lorsque l'utilisateur acceptera le modal
    handleOptimisticUpdate(taskId, destination.droppableId);
  };

  // Confirmer le changement de statut
  const confirmStatusChange = async (taskId, newStatus, sourceStatus) => {
    try {
      await changeTaskStatus(
        taskId, 
        newStatus, 
        (updatedTask) => {
          // Appeler le callback du parent pour mettre u00e0 jour la liste de tu00e2ches
          if (onTaskStatusChange) {
            onTaskStatusChange(updatedTask);
          }
        },
        // Gestion optimiste pour mettre u00e0 jour visuellement avant la ru00e9ponse API
        handleOptimisticUpdate
      );
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      // En cas d'erreur, revenir u00e0 l'u00e9tat d'origine
      handleOptimisticUpdate(taskId, sourceStatus, true);
    } finally {
      // Fermer le modal de confirmation
      setConfirmModal({ isOpen: false, task: null, newStatus: '', sourceStatus: '' });
    }
  };

  // Annuler le changement de statut
  const cancelStatusChange = () => {
    // Si on annule, on doit remettre la tu00e2che u00e0 son u00e9tat pru00e9cu00e9dent
    if (confirmModal.task && confirmModal.sourceStatus) {
      handleOptimisticUpdate(confirmModal.task.id, confirmModal.sourceStatus, true);
    }
    setConfirmModal({ isOpen: false, task: null, newStatus: '', sourceStatus: '' });
  };

  // Ru00e9cupu00e9rer les tu00e2ches organisu00e9es par statut
  const tasksByStatus = getTasksByStatus();

  // Du00e9finir les titres des colonnes pour chaque statut
  const statusTitles = {
    'EN_ATTENTE': 'En attente',
    'EN_COURS': 'En cours',
    'TERMINEE': 'Terminu00e9e'
  };

  return (
    <div className={styles.taskBoardContainer}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.statusColumns}>
          {Object.keys(tasksByStatus).map(status => (
            <TaskStatusColumn
              key={status}
              id={status}
              title={statusTitles[status]}
              tasks={tasksByStatus[status]}
              onDeleteTask={onDeleteClick}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Modal de confirmation de changement de statut */}
      <StatusChangeConfirmation
        isOpen={confirmModal.isOpen}
        task={confirmModal.task}
        newStatus={confirmModal.newStatus}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
      />
    </div>
  );
}

export default TaskStatusBoard;
