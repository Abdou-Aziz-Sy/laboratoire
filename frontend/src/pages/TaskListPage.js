// frontend/src/pages/TaskListPage.js
import React from 'react';
import TaskList from '../components/Tasks/TaskList';
import ProtectedNavbar from '../components/common/ProtectedNavbar';
import WaveBackground from '../components/UI/WaveBackground';
import styles from './TaskListPage.module.css';

const TaskListPage = () => {
  return (
    <div className={styles.taskListPage}>
      {/* Arrière-plan animé avec vagues */}
      <WaveBackground />
      
      {/* Navigation protégée */}
      <ProtectedNavbar />
      
      <div className={styles.container}>
        <div className={styles.taskListSection}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Mes tâches</h1>
            <p className={styles.pageDescription}>
              Consultez et gérez toutes vos tâches. Utilisez les filtres pour affiner votre recherche.
            </p>
          </div>
          
          <div className={styles.contentWrapper}>
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListPage;