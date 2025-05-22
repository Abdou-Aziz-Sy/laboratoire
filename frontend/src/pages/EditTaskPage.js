// --- fichier: frontend/src/pages/EditTaskPage.js (modifications) ---
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/Tasks/TaskForm';
import ProtectedNavbar from '../components/common/ProtectedNavbar';
import WaveBackground from '../components/UI/WaveBackground';
import { getTaskById, getTaskAssignees } from '../api/taskService';
import AssigneesList from '../components/Users/AssigneesList';
import UserSelectionModal from '../components/Users/UserSelectionModal';
import useTaskAssignment from '../hooks/useTaskAssignment';
import AssignmentNotification from '../components/Notifications/AssignmentNotification';
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
  
  // États pour gérer l'assignation
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentNotification, setAssignmentNotification] = useState(null);
  
  // Hook personnalisé pour la gestion des assignations
  const { 
    assignees, 
    isLoading: assignLoading, 
    fetchAssignees, 
    assignUsersToTask, 
    removeUserFromTask 
  } = useTaskAssignment();

  // Effet pour charger les données de la tâche au montage du composant
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Appel API pour récupérer les données de la tâche
        const taskData = await getTaskById(taskId);
        setTask(taskData);
        
        // Charger les assignés de la tâche
        fetchAssignees(taskId);
        
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
  }, [taskId, showError, fetchAssignees]);

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
  
  // Gestion de l'assignation de la tâche
  const handleAssignment = (selectedUsers) => {
    const userIds = selectedUsers.map(user => user.id);
    assignUsersToTask(taskId, userIds).then((result) => {
      // Afficher une notification d'assignation
      setAssignmentNotification({
        taskId,
        assignees: selectedUsers,
        action: 'assign',
        timestamp: new Date()
      });
      
      setTimeout(() => {
        setAssignmentNotification(null);
      }, 5000); // Masquer la notification après 5 secondes
    });
  };
  
  // Gestion de la suppression d'un assigné
  const handleRemoveAssignee = (userId) => {
    const removedUser = assignees.find(user => user.id === userId);
    removeUserFromTask(taskId, userId).then(() => {
      // Afficher une notification de désassignation
      if (removedUser) {
        setAssignmentNotification({
          taskId,
          assignees: [removedUser],
          action: 'remove',
          timestamp: new Date()
        });
        
        setTimeout(() => {
          setAssignmentNotification(null);
        }, 5000); // Masquer la notification après 5 secondes
      }
    });
  };

  return (
    <div className={styles.editTaskPage}>
      {/* Arrière-plan animé avec vagues */}
      <WaveBackground />
      
      {/* Navigation protégée */}
      <ProtectedNavbar />
      
      <div className={styles.container}>
        <div className={styles.editTaskSection}>
          
          {/* Modal de sélection d'utilisateurs */}
          <UserSelectionModal
            show={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            selectedUsers={assignees}
            onSelectUsers={handleAssignment}
          />
          
          {/* Notification d'assignation */}
          {assignmentNotification && (
            <AssignmentNotification
              taskId={assignmentNotification.taskId}
              assignees={assignmentNotification.assignees}
              action={assignmentNotification.action}
              timestamp={assignmentNotification.timestamp}
              onClose={() => setAssignmentNotification(null)}
            />
          )}
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
                <div className={styles.formSection}>
                  <TaskForm 
                    initialData={task}
                    isEditMode={true}
                    taskId={taskId}
                    onSuccess={handleEditSuccess}
                  />
                  
                  {/* Section des assignations */}
                  <div className={styles.assignmentSection}>
                    <div className={styles.sectionHeader}>
                      <h2>Assignation de la tâche</h2>
                      <button 
                        className={styles.assignButton}
                        onClick={() => setShowAssignModal(true)}
                        disabled={assignLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Gérer les assignés
                      </button>
                    </div>
                    
                    <div className={styles.assigneesContainer}>
                      {assignLoading ? (
                        <div className={styles.loadingAssignees}>
                          <div className={styles.spinner}></div>
                          <p>Chargement des assignés...</p>
                        </div>
                      ) : (
                        <AssigneesList 
                          assignees={assignees} 
                          onRemove={handleRemoveAssignee} 
                          maxDisplay={5}
                          compact={false}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;