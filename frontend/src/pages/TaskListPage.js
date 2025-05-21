// --- fichier: frontend/src/pages/TaskListPage.js ---
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../api/taskService';
import TaskItem from '../components/Tasks/TaskItem';
import DeleteTaskModal from '../components/Tasks/DeleteTaskModal';
import TaskStats from '../components/Tasks/TaskStats';
import { useToast } from '../context/ToastContext';
import styles from './TaskListPage.module.css';

/**
 * Page d'affichage de la liste des tâches de l'utilisateur
 * Permet la visualisation, l'accès aux détails et la suppression des tâches
 */
function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null });
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0); // Déclencheur de rafraîchissement des statistiques
  const { showToast } = useToast();

  // Mémorisation de la fonction loadTasks pour éviter les re-renders inutiles
  const loadTasks = useCallback(async () => {
    console.log('Chargement des tâches...');
    setIsLoading(true);
    setError(null);
    try {
      const tasksData = await getTasks();
      setTasks(tasksData || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des tâches');
      showToast({
        type: 'error',
        message: err.message || 'Impossible de charger vos tâches'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);
  
  // Chargement des tâches au chargement de la page
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Fonction pour ouvrir le modal de suppression
  const openDeleteModal = (task) => {
    setDeleteModal({
      isOpen: true,
      task
    });
  };

  // Fonction pour fermer le modal de suppression
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      task: null
    });
  };

  // Fonction appelée après une suppression réussie
  const handleDeleteSuccess = (deletedTaskId) => {
    // Mettre à jour la liste des tâches en supprimant celle qui a été supprimée
    setTasks(currentTasks => 
      currentTasks.filter(task => task.id !== deletedTaskId)
    );
    
    // Ajouter une animation à la liste pour indiquer le changement
    const taskListElement = document.querySelector(`.${styles.tasksList}`);
    if (taskListElement) {
      taskListElement.classList.add(styles.updateAnimation);
      setTimeout(() => {
        taskListElement.classList.remove(styles.updateAnimation);
      }, 500);
    }

    // Rafraîchir les statistiques en incrémentant le déclencheur
    setStatsRefreshTrigger(prev => prev + 1);

    // Afficher un message de succès supplémentaire si la liste est désormais vide
    if (tasks.length === 1) {
      setTimeout(() => {
        showToast({
          type: 'info',
          message: 'Bravo ! Vous avez terminé toutes vos tâches. Voulez-vous en créer une nouvelle ?',
          duration: 6000 // Durée plus longue pour ce message important
        });
        
        // Mettre en évidence le bouton de création après un court délai
        setTimeout(() => {
          const createButton = document.querySelector(`.${styles.createButton}`);
          if (createButton) {
            createButton.classList.add(styles.highlight);
            // Retirer l'effet de mise en évidence après un certain temps
            setTimeout(() => {
              createButton.classList.remove(styles.highlight);
            }, 2000);
          }
        }, 1000);
      }, 1000);
    }
  };

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mes Tâches</h1>
        <Link to="/tasks/create" className={styles.createButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouvelle Tâche
        </Link>
      </div>

      {/* Composant de statistiques qui se rafraîchit automatiquement après suppression */}
      {!isLoading && !error && tasks.length > 0 && (
        <TaskStats refreshTrigger={statsRefreshTrigger} />
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des tâches...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
          <button onClick={loadTasks} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className={styles.emptyContainer}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>Aucune tâche trouvée</h3>
          <p>Vous n'avez pas encore créé de tâches. Commencez par ajouter une nouvelle tâche.</p>
          <Link to="/tasks/create" className={styles.createEmptyButton}>
            Créer ma première tâche
          </Link>
        </div>
      ) : (
        <div className={styles.tasksList}>
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onDeleteClick={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModal.isOpen && deleteModal.task && (
        <DeleteTaskModal
          taskId={deleteModal.task.id}
          taskTitle={deleteModal.task.titre}
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

export default TaskListPage;