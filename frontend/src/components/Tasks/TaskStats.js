// --- fichier: frontend/src/components/Tasks/TaskStats.js ---
import React, { useState, useEffect } from 'react';
import { getTaskStats } from '../../api/taskService';
import styles from './TaskStats.module.css';

/**
 * Composant affichant les statistiques des tu00e2ches
 * @param {Object} props - Les propriu00e9tu00e9s du composant
 * @param {boolean} props.refreshTrigger - Du00e9clencheur de rafrau00eechissement (change u00e0 chaque modification des tu00e2ches)
 */
function TaskStats({ refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les statistiques quand les tu00e2ches changent
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const statsData = await getTaskStats();
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError(err.message || 'Impossible de charger les statistiques');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [refreshTrigger]); // Rafrau00eechir quand refreshTrigger change

  if (isLoading) {
    return (
      <div className={styles.statsContainer}>
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <span>Chargement des statistiques...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statsContainer}>
        <div className={styles.errorMessage}>
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.statsTitle}>Statistiques des tu00e2ches</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{stats.total || 0}</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.inProgressCard}`}>
          <div className={styles.statIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>En cours</span>
            <span className={styles.statValue}>{stats.inProgress || 0}</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.completedCard}`}>
          <div className={styles.statIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Terminu00e9es</span>
            <span className={styles.statValue}>{stats.completed || 0}</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.pendingCard}`}>
          <div className={styles.statIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>En attente</span>
            <span className={styles.statValue}>{stats.pending || 0}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.statsFooter}>
        <div className={styles.statsUpdateInfo}>
          Derniu00e8re mise u00e0 jour: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default TaskStats;
