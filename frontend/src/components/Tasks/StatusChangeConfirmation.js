// --- fichier: frontend/src/components/Tasks/StatusChangeConfirmation.js ---
import React, { useEffect, useRef, useState } from 'react';
import styles from './StatusChangeConfirmation.module.css';

/**
 * Modal de confirmation pour le changement de statut d'une tâche
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.isOpen - État d'ouverture du modal
 * @param {Object} props.task - La tâche concernée par le changement
 * @param {string} props.newStatus - Le nouveau statut proposé
 * @param {string} props.sourceStatus - Le statut d'origine
 * @param {Function} props.onConfirm - Callback lors de la confirmation
 * @param {Function} props.onCancel - Callback lors de l'annulation
 */
function StatusChangeConfirmation({ isOpen, task, newStatus, sourceStatus, onConfirm, onCancel }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  // Gestion des touches clavier (Échap pour fermer)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  // Focus automatique sur le bouton de confirmation
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const confirmButton = modalRef.current.querySelector(`.${styles.confirmButton}`);
      if (confirmButton) confirmButton.focus();
    }
  }, [isOpen]);

  // Formater l'affichage du statut
  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  };

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>Confirmer le changement de statut</h3>
          <button 
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>
          <p>
            Voulez-vous changer le statut de la tâche <strong>"{task?.titre}"</strong>{' '}
            de <span className={styles.statusBadge}>{formatStatus(task?.statut)}</span>{' '}
            à <span className={styles.statusBadge}>{formatStatus(newStatus)}</span> ?
          </p>
        </div>

        <div className={styles.modalActions}>
          <button 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Annuler
          </button>
          <button 
            className={`${styles.confirmButton} ${isAnimating ? styles.isAnimating : ''}`}
            onClick={() => {
              setIsAnimating(true);
              // Du00e9lai pour laisser l'animation de confirmation se terminer
              setTimeout(() => {
                onConfirm(task.id, newStatus, sourceStatus);
                setIsAnimating(false);
              }, 400);
            }}
            disabled={isAnimating}
          >
            {isAnimating ? 'Traitement...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatusChangeConfirmation;
