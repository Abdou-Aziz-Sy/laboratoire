// --- fichier: frontend/src/pages/CreateTaskPage.js ---
import React from 'react';
import TaskForm from '../components/Tasks/TaskForm';
import ProtectedNavbar from '../components/common/ProtectedNavbar';
import WaveBackground from '../components/UI/WaveBackground';
import styles from './CreateTaskPage.module.css';

const CreateTaskPage = () => {
  return (
    <div className={styles.createTaskPage}>
      {/* Arrière-plan animé avec vagues */}
      <WaveBackground />
      
      {/* Navigation protégée */}
      <ProtectedNavbar />
      
      <div className={styles.container}>
        <div className={styles.createTaskSection}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Créer une nouvelle tâche</h1>
            <p className={styles.pageDescription}>
              Complétez le formulaire ci-dessous pour ajouter une nouvelle tâche à votre liste.
              Tous les champs marqués d'un astérisque sont obligatoires.
            </p>
          </div>
          
          <div className={styles.formWrapper}>
            <TaskForm 
              onSuccess={(task) => {
                // Cette fonction est appelée après la création réussie d'une tâche
                console.log('Tâche créée:', task);
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
