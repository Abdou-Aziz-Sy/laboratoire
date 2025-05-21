// --- fichier: frontend/src/pages/TaskStatusBoardPage.js ---
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DragDropProvider } from '../context/DragDropContext';
import TaskStatusBoard from '../components/Tasks/TaskStatusBoard';
import DeleteTaskModal from '../components/Tasks/DeleteTaskModal';
import { useToast } from '../context/ToastContext';
import { getTasks } from '../api/taskService';
import styles from './TaskStatusBoardPage.module.css';
import WaveBackground from '../components/UI/WaveBackground';

/**
 * Page d'affichage des tâches organisées par statut avec fonctionnalité drag & drop
 */
function TaskStatusBoardPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null });
  const { showToast } = useToast();

  // Mémorisation de la fonction loadTasks pour éviter les re-renders inutiles
  const loadTasks = useCallback(async () => {
    console.log('Chargement des tâches pour le board de statuts...');
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
    
    showToast({
      type: 'success',
      message: 'La tâche a été supprimée avec succès'
    });
  };

  // Fonction pour gérer le changement de statut d'une tâche
  const handleTaskStatusChange = (updatedTask) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  return (
    <div className={styles.boardPageContainer}>
      <WaveBackground />
      
      <div className={styles.pageHeader}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Tableau des Tâches</h1>
          <p className={styles.pageDescription}>Organisez vos tâches en les glissant-déposant entre les statuts</p>
        </div>
        
        <div className={styles.actionButtons}>
          <Link to="/tasks" className={styles.listViewButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Vue Liste
          </Link>
          
          <Link to="/tasks/create" className={styles.createButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nouvelle Tâche
          </Link>
        </div>
      </div>

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
        <DragDropProvider>
          <TaskStatusBoard 
            tasks={tasks} 
            onTaskStatusChange={handleTaskStatusChange}
            onDeleteClick={openDeleteModal}
          />
        </DragDropProvider>
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

export default TaskStatusBoardPage;
