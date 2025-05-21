// --- fichier: frontend/src/pages/EditTaskPage.js (modifications) ---
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/Tasks/TaskForm';
import ProtectedNavbar from '../components/common/ProtectedNavbar';
import WaveBackground from '../components/UI/WaveBackground';
import { getTaskById } from '../api/taskService';
import { useToast } from '../context/ToastContext';
import styles from './EditTaskPage.module.css';

const EditTaskPage = () => {
  // Récupération de l'ID depuis les paramètres d'URL
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  // États pour gérer le chargement et les erreurs
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingDone, setIsLoadingDone] = useState(false);

  // Effet pour charger les données de la tâche au montage du composant
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Appel API pour récupérer les données de la tâche
        const taskData = await getTaskById(taskId);
        setTask(taskData);
        
        // Ajouter un léger délai pour montrer l'animation de succès du chargement
        setTimeout(() => {
          setIsLoadingDone(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }, 1000);
      } catch (err) {
        console.error('Erreur lors du chargement de la tâche:', err);
        setError(err.message || 'Impossible de charger les détails de la tâche');
        showError(`Erreur: ${err.message || 'Impossible de charger les détails de la tâche'}`);
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, [taskId, showError]);

  // Gestionnaire de réussite après édition
  const handleEditSuccess = (updatedTask) => {
    console.log('Tâche mise à jour:', updatedTask);
    // Afficher le toast de succès
    success('Tâche mise à jour avec succès! Redirection...');
    
    // Redirection vers la liste des tâches après un court délai
    setTimeout(() => {
      navigate('/tasks');
    }, 1500);
  };

  return (
    <div className={styles.editTaskPage}>
      {/* Arrière-plan animé avec vagues */}
      <WaveBackground />
      
      {/* Navigation protégée */}
      <ProtectedNavbar />
      
      <div className={styles.container}>
        <div className={styles.editTaskSection}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Modifier la tâche</h1>
            <p className={styles.pageDescription}>
              Vous pouvez modifier les détails de votre tâche ci-dessous.
              Tous les champs marqués d'un astérisque sont obligatoires.
            </p>
          </div>
          
          <div className={styles.formWrapper}>
            {/* Affichage du loader pendant le chargement */}
            {isLoading && (
              <div className={`${styles.loadingContainer} ${isLoadingDone ? styles.fadeOut : styles.fadeIn}`}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>
                  {isLoadingDone ? 'Données chargées!' : 'Chargement des données...'}
                </p>
              </div>
            )}
            
            {/* Affichage du message d'erreur si nécessaire */}
            {error && !isLoading && (
              <div className={`${styles.errorContainer} ${styles.shakeAnimation}`}>
                <div className={styles.errorIcon}>!</div>
                <p className={styles.errorText}>{error}</p>
                <div className={styles.buttonContainer}>
                  <button 
                    className={styles.retryButton}
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </button>
                  <button 
                    className={styles.backButton}
                    onClick={() => navigate('/tasks')}
                  >
                    Retour à la liste
                  </button>
                </div>
              </div>
            )}
            
            {/* Affichage du formulaire quand les données sont chargées */}
            {!isLoading && !error && task && (
              <div className={styles.fadeIn}>
                <TaskForm 
                  initialData={task}
                  isEditMode={true}
                  taskId={taskId}
                  onSuccess={handleEditSuccess}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;