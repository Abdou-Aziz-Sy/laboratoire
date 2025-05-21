// --- fichier: frontend/src/components/Tasks/TaskItem.js ---
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TaskItem.module.css';
import AssigneesList from '../Users/AssigneesList';
import UserSelectionModal from '../Users/UserSelectionModal';
import useTaskAssignment from '../../hooks/useTaskAssignment';

/**
 * Composant représentant un élément de tâche dans la liste
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.task - Données de la tâche
 * @param {function} props.onDeleteClick - Handler pour l'action de suppression
 * @param {function} props.onAssignmentUpdate - Handler appelé après une mise à jour des assignés
 */
function TaskItem({ task, onDeleteClick, onAssignmentUpdate }) {
  // États pour l'UI et les interactions
  const [isRemoving, setIsRemoving] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const itemRef = useRef(null);
  
  // Hook personnalisé pour gérer les assignations
  const { 
    assignees, 
    isLoading: assignLoading, 
    fetchAssignees, 
    assignUsersToTask, 
    removeUserFromTask 
  } = useTaskAssignment();
  
  // Charge les assignés au montage du composant
  useEffect(() => {
    if (task?.id) {
      fetchAssignees(task.id);
    }
  }, [task?.id, fetchAssignees]);
  
  // Gère le clic sur le bouton de suppression avec animation
  const handleDeleteClick = () => {
    // Si l'utilisateur clique sur supprimer, on déclenche l'animation avant d'ouvrir le modal
    setIsRemoving(true);
    setTimeout(() => {
      setIsRemoving(false);
      onDeleteClick(task);
    }, 300); // Durée de l'animation
  };
  // Formatage de la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'Aucune date limite';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Détermine la classe de priorité pour le styling
  const getPriorityClass = () => {
    switch(task.priorite?.toLowerCase()) {
      case 'haute':
        return styles.highPriority;
      case 'moyenne':
        return styles.mediumPriority;
      case 'basse':
        return styles.lowPriority;
      default:
        return '';
    }
  };

  // Détermine la classe de statut pour le styling
  const getStatusClass = () => {
    switch(task.statut) {
      case 'TERMINEE':
        return styles.completed;
      case 'EN_COURS':
        return styles.inProgress;
      case 'EN_ATTENTE':
        return styles.pending;
      default:
        return '';
    }
  };

  return (
    <div 
      ref={itemRef}
      className={`${styles.taskItem} ${getStatusClass()} ${isRemoving ? styles.removing : ''}`}
    >
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{task.titre}</h3>
        <div className={`${styles.priorityBadge} ${getPriorityClass()}`}>
          {task.priorite || 'Non définie'}
        </div>
      </div>
      
      <div className={styles.taskDescription}>
        {task.description ? (
          <p>{task.description.length > 120 ? 
            `${task.description.substring(0, 120)}...` : 
            task.description}
          </p>
        ) : (
          <p className={styles.noDescription}>Aucune description</p>
        )}
      </div>
      
      <div className={styles.taskMeta}>
        <div className={styles.taskDate}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formatDate(task.dateEcheance)}</span>
        </div>
        
        <div className={styles.taskStatus}>
          <span>{task.statut?.replace('_', ' ') || 'Non défini'}</span>
        </div>
      </div>
      
      {/* Section des assignés */}
      <div className={styles.assigneesSection}>
        <div className={styles.assigneesHeader}>
          <h4>Assignés</h4>
          <button 
            className={styles.assignButton}
            onClick={() => setShowAssignModal(true)}
            title="Gérer les assignés"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </button>
        </div>
        
        <AssigneesList 
          assignees={assignees} 
          onRemove={(userId) => {
            removeUserFromTask(task.id, userId).then(() => {
              if (onAssignmentUpdate) onAssignmentUpdate(task.id);
            });
          }}
          compact={true} 
          maxDisplay={3}
        />
      </div>
      
      <div className={styles.taskActions}>
        <Link to={`/tasks/edit/${task.id}`} className={styles.editButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Modifier</span>
        </Link>
        
        <button 
          className={styles.deleteButton}
          onClick={handleDeleteClick}
          aria-label="Supprimer la tâche"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          <span>Supprimer</span>
        </button>
      </div>
      
      {/* Modal de sélection d'utilisateurs */}
      <UserSelectionModal
        show={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        selectedUsers={assignees}
        onSelectUsers={(selectedUsers) => {
          const userIds = selectedUsers.map(user => user.id);
          assignUsersToTask(task.id, userIds).then(() => {
            if (onAssignmentUpdate) onAssignmentUpdate(task.id);
          });
        }}
      />
    </div>
  );
}

export default TaskItem;
