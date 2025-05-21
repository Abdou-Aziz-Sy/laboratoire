// --- fichier: frontend/src/components/Tasks/DraggableTaskItem.js ---
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { useDragDrop } from '../../context/DragDropContext';
import styles from './DraggableTaskItem.module.css';

/**
 * Composant représentant un élément de tâche draggable dans le board de statuts
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.task - Données de la tâche
 * @param {number} props.index - Index pour le Draggable
 * @param {function} props.onDeleteClick - Handler pour l'action de suppression
 */
function DraggableTaskItem({ task, index, onDeleteClick }) {
  const itemRef = useRef(null);
  const [showSuccessDrop, setShowSuccessDrop] = useState(false);
  const { pendingUpdates, isDragging } = useDragDrop();
  
  // Vérifier si la tâche est en cours de mise à jour
  const isUpdating = pendingUpdates[task.id]?.status === 'pending';
  const hasError = pendingUpdates[task.id]?.status === 'error';
  
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

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeleteClick(task);
  };

  // Effect pour montrer l'animation de succès lorsqu'une tâche change de statut
  useEffect(() => {
    // Si la tâche vient d'être mise à jour avec succès et n'est plus en attente
    if (task.lastUpdated && !isUpdating && !isDragging) {
      const lastUpdatedTime = new Date(task.lastUpdated).getTime();
      const currentTime = new Date().getTime();
      
      // Vérifier si la mise à jour a eu lieu dans les 2 dernières secondes
      if (currentTime - lastUpdatedTime < 2000) {
        setShowSuccessDrop(true);
        
        // Masquer l'effet après 1 seconde
        const timer = setTimeout(() => {
          setShowSuccessDrop(false);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [task, isUpdating, isDragging]);

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={(node) => {
            // Cette méthode est nécessaire pour que le ref fonctionne avec react-beautiful-dnd
            provided.innerRef(node);
            itemRef.current = node;
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            ${styles.taskItem} 
            ${snapshot.isDragging ? styles.isDragging : ''} 
            ${isUpdating ? styles.updatingTask : ''} 
            ${hasError ? styles.errorUpdateTask : ''} 
            ${showSuccessDrop ? styles.successDrop : ''} 
            ${!snapshot.isDragging ? styles.animateTaskMove : ''}
          `}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <div className={styles.taskHeader}>
            <h3 className={styles.taskTitle}>{task.titre}</h3>
            <div className={`${styles.priorityBadge} ${getPriorityClass()}`}>
              {task.priorite || 'Non définie'}
            </div>
          </div>
          
          <div className={styles.taskDescription}>
            {task.description ? (
              <p>{task.description.length > 100 ? 
                `${task.description.substring(0, 100)}...` : 
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
          </div>
          
          <div className={styles.taskActions}>
            <Link to={`/tasks/edit/${task.id}`} className={styles.editButton} onClick={e => e.stopPropagation()}>
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
          
          {snapshot.isDragging && (
            <div className={styles.dragIndicator}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 9l-3 3 3 3"></path>
                <path d="M9 5l3-3 3 3"></path>
                <path d="M15 19l3-3 3 3"></path>
                <path d="M19 9l3 3-3 3"></path>
                <path d="M2 12h20"></path>
                <path d="M12 2v20"></path>
              </svg>
              <span>Déplacer pour changer le statut</span>
            </div>
          )}
          
          {isUpdating && !snapshot.isDragging && (
            <div className={styles.dragIndicator}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Mise à jour du statut...</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default DraggableTaskItem;
