// --- fichier: frontend/src/components/Tasks/TaskStatusColumn.js ---
import React, { useState, useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableTaskItem from './DraggableTaskItem';
import styles from './TaskStatusColumn.module.css';

/**
 * Colonne pour chaque statut dans le board
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - ID de la colonne (utilisé pour le Droppable)
 * @param {string} props.title - Titre de la colonne
 * @param {Array} props.tasks - Liste des tâches dans cette colonne
 * @param {function} props.onDeleteTask - Handler pour l'action de suppression
 */
function TaskStatusColumn({ id, title, tasks = [], onDeleteTask }) {
  const [prevTaskCount, setPrevTaskCount] = useState(tasks.length);
  const [isCountChanged, setIsCountChanged] = useState(false);
  const [showDropSuccess, setShowDropSuccess] = useState(false);
  const columnRef = useRef(null);
  // Obtenir la couleur de la colonne en fonction du statut
  const getStatusColor = () => {
    switch(id) {
      case 'EN_ATTENTE':
        return styles.pendingColumn;
      case 'EN_COURS':
        return styles.inProgressColumn;
      case 'TERMINEE':
        return styles.completedColumn;
      default:
        return '';
    }
  };

  // Effet pour détecter les changements dans le nombre de tâches
  useEffect(() => {
    // Si le nombre de tâches a changé
    if (tasks.length !== prevTaskCount) {
      // Déclencher l'animation du compteur
      setIsCountChanged(true);
      
      // Si le nombre de tâches a augmenté, montrer l'animation de succès pour la colonne
      if (tasks.length > prevTaskCount) {
        setShowDropSuccess(true);
        setTimeout(() => setShowDropSuccess(false), 800);
      }
      
      // Masquer l'animation après 600ms
      const timer = setTimeout(() => {
        setIsCountChanged(false);
        setPrevTaskCount(tasks.length);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [tasks.length, prevTaskCount]);

  return (
    <div 
      ref={columnRef}
      className={`
        ${styles.statusColumn} 
        ${getStatusColor()} 
        ${showDropSuccess ? styles.columnDropSuccess : ''}
      `}
    >
      <div className={styles.columnHeader}>
        <h2 className={styles.columnTitle}>{title}</h2>
        <div className={`
          ${styles.taskCount} 
          ${isCountChanged ? styles.taskCountChanged : ''}
        `}>
          <span>{tasks.length}</span>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            className={`${styles.taskList} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <DraggableTaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onDeleteClick={onDeleteTask}
                />
              ))
            ) : (
              <div className={styles.emptyColumn}>
                <div className={styles.emptyMessage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                  </svg>
                  <p>Aucune tâche</p>
                  <span>Déposez une tâche ici</span>
                </div>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default TaskStatusColumn;
