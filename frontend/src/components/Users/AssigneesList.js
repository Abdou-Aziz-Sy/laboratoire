import React from 'react';
import UserAvatar from './UserAvatar';
import styles from './AssigneesList.module.css';

/**
 * Composant pour afficher la liste des utilisateurs assignu00e9s u00e0 une tu00e2che
 * @param {Array} assignees - Liste des utilisateurs assignu00e9s
 * @param {Function} onRemove - Fonction appelu00e9e pour retirer un assignu00e9 (facultatif)
 * @param {number} maxDisplay - Nombre maximum d'avatars u00e0 afficher avant de montrer un badge '+X'
 * @param {boolean} compact - Si vrai, utilise une version plus compacte de la liste
 */
const AssigneesList = ({ 
  assignees = [], 
  onRemove,
  maxDisplay = 5,
  compact = false
}) => {
  // Si aucun assignu00e9, afficher un message ou un placeholer
  if (!assignees || assignees.length === 0) {
    return (
      <div className={styles.emptyAssignees}>
        <span>Aucun assignu00e9</span>
      </div>
    );
  }

  // Du00e9termination si on doit afficher un badge '+X'
  const displayedAssignees = assignees.slice(0, maxDisplay);
  const remainingCount = assignees.length - maxDisplay;
  const showRemainingBadge = remainingCount > 0;

  return (
    <div className={`${styles.assigneesList} ${compact ? styles.compact : ''}`}>
      {displayedAssignees.map((user, index) => (
        <div key={user.id} className={styles.assigneeItem}>
          <UserAvatar 
            user={user} 
            size={compact ? 'small' : 'medium'}
            showName={!compact}
            className={styles.groupedAvatar}
          />
          
          {onRemove && (
            <button 
              className={styles.removeButton}
              onClick={() => onRemove(user.id)}
              title={`Retirer ${user.name}`}
              aria-label={`Retirer ${user.name}`}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
      ))}

      {showRemainingBadge && (
        <div className={styles.remainingBadge} title={`${remainingCount} assignu00e9${remainingCount > 1 ? 's' : ''} de plus`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AssigneesList;
