// --- fichier: frontend/src/components/Tasks/DeleteTaskModal.js ---
import React, { useEffect, useState } from 'react';
import { deleteTask } from '../../api/taskService';
import { useToast } from '../../context/ToastContext';
import styles from './DeleteTaskModal.module.css';

/**
 * Modal de confirmation pour la suppression d'une tâche
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.taskId - L'ID de la tâche à supprimer
 * @param {string} props.taskTitle - Le titre de la tâche à supprimer
 * @param {boolean} props.isOpen - État d'ouverture du modal
 * @param {function} props.onClose - Fonction pour fermer le modal
 * @param {function} props.onSuccess - Fonction appelée après suppression réussie
 */
function DeleteTaskModal({ taskId, taskTitle, isOpen, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Gère l'animation d'apparition/disparition du modal
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Fonction pour gérer la transition de sortie
  const handleClose = () => {
    setIsVisible(false);
    // Attendre la fin de l'animation avant de réellement fermer le modal
    setTimeout(() => {
      onClose();
    }, 300); // Durée correspondant à la transition CSS
  };

  // Gère la confirmation de suppression avec une gestion améliorée des erreurs et du retour utilisateur
  const handleConfirmDelete = async () => {
    if (!taskId) return;
    
    setIsDeleting(true);
    try {
      // Appel de l'API de suppression
      const response = await deleteTask(taskId);
      
      // Vérification explicite du succès
      if (response && response.success) {
        // Délai court avant de fermer le modal pour une meilleure UX
        setTimeout(() => {
          setIsDeleting(false);
          
          // Affichage du toast de succès
          showToast({
            message: `La tâche "${taskTitle}" a été supprimée avec succès`,
            type: 'success',
            duration: 4000 // Durée un peu plus longue pour que l'utilisateur puisse bien voir le message
          });
          
          // Fermeture du modal
          handleClose();
          
          // Notifier le composant parent pour mettre à jour la liste des tâches
          if (onSuccess) {
            onSuccess(taskId);
          }
        }, 500); // Délai court pour que l'utilisateur voie la confirmation visuelle
      } else {
        throw new Error('La suppression n\'a pas pu être confirmée par le serveur');
      }
    } catch (error) {
      setIsDeleting(false);
      
      // Détermination du message d'erreur selon le type d'erreur
      let errorMessage;
      if (error.message && error.message.includes('401')) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.message && error.message.includes('403')) {
        errorMessage = 'Vous n\'avez pas les droits pour supprimer cette tâche.';
      } else if (error.message && error.message.includes('404')) {
        errorMessage = 'Cette tâche n\'existe plus ou a déjà été supprimée.';
        // Si la tâche n'existe plus, on peut quand même mettre à jour l'UI
        handleClose();
        if (onSuccess) {
          onSuccess(taskId);
        }
      } else {
        errorMessage = `Erreur lors de la suppression : ${error.message || 'Veuillez réessayer'}`;
      }
      
      // Affichage du toast d'erreur avec une durée plus longue pour les erreurs critiques
      showToast({
        message: errorMessage,
        type: 'error',
        duration: errorMessage.includes('Session expirée') || errorMessage.includes('droits') ? 6000 : 5000 // Durée plus longue pour les erreurs importantes
      });
      
      // Log de l'erreur pour débogage
      console.error('Erreur lors de la suppression de la tâche :', error);
    }
  };

  // Ne rien rendre si le modal n'est pas ouvert
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div 
        className={`${styles.modalContent} ${isVisible ? styles.visible : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Confirmer la suppression</h3>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.warningIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <p className={styles.confirmMessage}>
            Êtes-vous sûr de vouloir supprimer la tâche <span className={styles.taskTitle}>"{taskTitle}"</span> ?
          </p>
          <p className={styles.warningText}>Cette action est irréversible.</p>
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={handleClose}
            disabled={isDeleting}
          >
            Annuler
          </button>
          <button 
            className={styles.deleteButton} 
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className={styles.loadingSpinner}>
                <span className={styles.spinner}></span>
                <span>Suppression...</span>
              </div>
            ) : (
              "Supprimer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
