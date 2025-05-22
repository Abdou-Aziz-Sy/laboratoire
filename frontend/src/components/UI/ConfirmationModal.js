// --- fichier: frontend/src/components/UI/ConfirmationModal.js ---
import React, { useEffect, useRef, useState } from 'react';
import styles from './ConfirmationModal.module.css';

/**
 * Modal de confirmation gu00e9nu00e9rique
 * @param {Object} props - Les propriu00e9tu00e9s du composant
 * @param {boolean} props.isOpen - u00c9tat d'ouverture du modal
 * @param {string} props.title - Titre du modal
 * @param {string|React.ReactNode} props.message - Message ou contenu du modal
 * @param {string} props.confirmLabel - Texte du bouton de confirmation
 * @param {string} props.cancelLabel - Texte du bouton d'annulation
 * @param {string} props.type - Type de confirmation (info, warning, danger)
 * @param {Function} props.onConfirm - Callback lors de la confirmation
 * @param {Function} props.onCancel - Callback lors de l'annulation
 */
function ConfirmationModal({ 
  isOpen, 
  title = 'Confirmation', 
  message, 
  confirmLabel = 'Confirmer', 
  cancelLabel = 'Annuler', 
  type = 'info', 
  onConfirm, 
  onCancel 
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  // Gestion des touches clavier (Echap pour fermer)
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

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;

  // Gu00e9rer la confirmation avec animation
  const handleConfirm = () => {
    setIsAnimating(true);
    // Du00e9lai pour laisser l'animation de confirmation se terminer
    setTimeout(() => {
      onConfirm();
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div 
        ref={modalRef} 
        className={`${styles.modalContainer} ${styles[type]}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
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
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        <div className={styles.modalActions}>
          <button 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button 
            className={`${styles.confirmButton} ${styles[type + 'Button']} ${isAnimating ? styles.isAnimating : ''}`}
            onClick={handleConfirm}
            disabled={isAnimating}
          >
            {isAnimating ? 'Traitement...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
