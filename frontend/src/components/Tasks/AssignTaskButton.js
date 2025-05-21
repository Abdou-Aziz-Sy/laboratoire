import React, { useState } from 'react';
import UserSelectionModal from '../Users/UserSelectionModal';
import AssigneesList from '../Users/AssigneesList';
import styles from './AssignTaskButton.module.css';

/**
 * Bouton pour du00e9clencher l'interface d'assignation de tu00e2che
 * @param {Object} task - La tu00e2che u00e0 assigner
 * @param {Array} currentAssignees - Liste des utilisateurs du00e9ju00e0 assignu00e9s u00e0 cette tu00e2che
 * @param {Function} onAssign - Fonction appelu00e9e lors de l'assignation avec la liste des nouveaux assignu00e9s
 * @param {boolean} disabled - Indique si le bouton est du00e9sactivu00e9
 * @param {boolean} showAssignees - Indique si la liste des assignu00e9s doit u00eatre affichu00e9e
 * @param {boolean} compact - Version compacte du composant pour les espaces ru00e9duits
 */
const AssignTaskButton = ({
  task,
  currentAssignees = [],
  onAssign,
  disabled = false,
  showAssignees = true,
  compact = false
}) => {
  const [showModal, setShowModal] = useState(false);
  
  // Ouvre le modal de su00e9lection
  const handleOpenModal = () => {
    if (disabled) return;
    setShowModal(true);
  };

  // Ferme le modal de su00e9lection
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Gu00e8re la su00e9lection finale des utilisateurs
  const handleSelectUsers = (selectedUsers) => {
    if (onAssign && typeof onAssign === 'function') {
      onAssign(task.id, selectedUsers);
    }
  };

  // Retire un assignu00e9 existant
  const handleRemoveAssignee = (userId) => {
    if (!onAssign || typeof onAssign !== 'function') return;
    
    const updatedAssignees = currentAssignees.filter(user => user.id !== userId);
    onAssign(task.id, updatedAssignees);
  };

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      {showAssignees && currentAssignees.length > 0 && (
        <div className={styles.assigneesContainer}>
          <AssigneesList 
            assignees={currentAssignees} 
            onRemove={handleRemoveAssignee} 
            maxDisplay={compact ? 3 : 5}
            compact={compact}
          />
        </div>
      )}
      
      <button 
        className={`${styles.assignButton} ${disabled ? styles.disabled : ''}`}
        onClick={handleOpenModal}
        disabled={disabled}
        title="Assigner des utilisateurs u00e0 cette tu00e2che"
      >
        <span className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {!compact && <span className={styles.text}>Assigner</span>}
      </button>

      <UserSelectionModal 
        show={showModal} 
        onClose={handleCloseModal}
        selectedUsers={currentAssignees}
        onSelectUsers={handleSelectUsers}
        excludeUsers={[]}
      />
    </div>
  );
};

export default AssignTaskButton;
