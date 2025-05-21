import React, { useState, useEffect, useCallback } from 'react';
import styles from './AssignmentNotification.module.css';
import UserAvatar from '../Users/UserAvatar';

/**
 * Composant de notification spécifique pour l'assignation/désassignation de tâches
 * Apparaît temporairement avec une animation et disparaît après un délai
 * 
 * @param {string} taskId - ID de la tâche concernée
 * @param {Array} assignees - Liste des utilisateurs assignés/désassignés
 * @param {string} action - Action effectuée ('assign' ou 'remove')
 * @param {Date} timestamp - Horodatage de l'action
 * @param {Function} onClose - Fonction appelée pour fermer la notification
 */
const AssignmentNotification = ({ taskId, assignees = [], action, timestamp, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Gestion de la fermeture avec animation - utilisation de useCallback pour éviter les re-renders
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300); // Durée de l'animation de sortie
  }, [onClose]);
  
  // Effet pour animer l'apparition et la disparition
  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => {
      setVisible(true);
    }, 50);
    
    // Fermeture automatique après un délai
    const timeoutId = setTimeout(() => {
      handleClose();
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [handleClose]);

  
  // Formatage de l'horodatage
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Génération du message selon l'action
  const getMessage = () => {
    if (!assignees || assignees.length === 0) return '';
    
    const names = assignees.map(user => user.name || user.username || 'Utilisateur');
    const displayNames = names.length <= 2 
      ? names.join(' et ') 
      : `${names.slice(0, 2).join(', ')} et ${names.length - 2} autres`;
    
    if (action === 'assign') {
      return `${displayNames} ${names.length > 1 ? 'ont été assignés' : 'a été assigné'} à cette tâche`;
    } else if (action === 'remove') {
      return `${displayNames} ${names.length > 1 ? 'ont été retirés' : 'a été retiré'} de cette tâche`;
    }
    
    return '';
  };
  
  if (!visible) return null;
  
  return (
    <div
      className={`${styles.notificationContainer} ${visible ? styles.visible : ''} ${closing ? styles.closing : ''}`}
    >
      <div className={styles.notificationContent}>
        <div className={styles.notificationIcon}>
          {action === 'assign' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          )}
        </div>
        
        <div className={styles.notificationMessage}>
          <div className={styles.messageHeader}>
            <h4>{action === 'assign' ? 'Assignation' : 'Désassignation'} de tâche</h4>
            <span className={styles.timestamp}>{formatTime(timestamp)}</span>
          </div>
          <p>{getMessage()}</p>
          
          <div className={styles.avatarGroup}>
            {assignees.slice(0, 3).map((user, index) => (
              <div key={user.id} className={styles.avatarWrapper} style={{ zIndex: 10 - index }}>
                <UserAvatar user={user} size="small" />
              </div>
            ))}
            {assignees.length > 3 && (
              <div className={styles.moreAvatars}>+{assignees.length - 3}</div>
            )}
          </div>
        </div>
        
        <button 
          className={styles.closeButton} 
          onClick={handleClose}
          aria-label="Fermer la notification"
        >
          &times;
        </button>
      </div>
      
      <div className={styles.progressBar}>
        <div className={styles.progress}></div>
      </div>
    </div>
  );
};

export default AssignmentNotification;
