// --- fichier: frontend/src/pages/DashboardPage.js ---
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';

// Import des composants du dashboard
import { TaskProgressChart, ActivityTimelineChart } from '../components/Dashboard/Charts';
import { 
  TaskSummaryWidget, 
  RecentActivitiesWidget, 
  NotificationsWidget, 
  PerformanceWidget 
} from '../components/Dashboard/Widgets';

// Import du hook personnalisé pour les données
import useDashboardData from '../hooks/useDashboardData';
import styles from './DashboardPage.module.css';

/**
 * Page principale du dashboard
 * Cette page sert de conteneur pour tous les widgets et composants du dashboard
 * Elle n'est accessible qu'aux utilisateurs authentifiés
 */
function DashboardPage() {
  // Utilisation du contexte d'authentification
  const { isAuthenticated = true } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  // Utilisation du hook pour récupérer les données du dashboard
  // Toujours appeler les hooks au même niveau, avant les conditionnels
  const { 
    taskData, 
    activityData, 
    performanceData, 
    notifications, 
    isLoading, 
    error 
  } = useDashboardData();

  // Vérification de l'authentification (à implémenter avec le backend)
  useEffect(() => {
    // Ici, ajoutez la logique pour vérifier l'authentification de l'utilisateur
    // Exemple: appel API pour vérifier le token, etc.
    const checkAuth = async () => {
      try {
        // Simulation d'une vérification d'authentification
        // À remplacer par une vérification réelle
        // const isUserAuthenticated = localStorage.getItem('token') !== null;
        setIsAuthChecked(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de \'authentification', error);
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Attendre que la vérification d'authentification soit terminée
  if (!isAuthChecked) {
    return <div>Chargement...</div>;
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Les données du dashboard sont déjà récupérées par le hook appelé plus haut

  // Gestion des états de chargement et d'erreur
  if (isLoading && !taskData) {
    return (
      <DashboardLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des données du tableau de bord...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Une erreur est survenue</h3>
          <p>{error.message || 'Impossible de charger les données du tableau de bord.'}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Section d'en-tête du dashboard */}
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>
          Tableau de bord
          <span className={styles.titleHighlight}></span>
        </h1>
        <p className={styles.dashboardSubtitle}>
          Bienvenue sur votre espace personnel de gestion de tâches
        </p>
      </header>

      {/* Grille principale du dashboard */}
      <div className={styles.dashboardGrid}>
        {/* Première rangée: Graphiques principaux */}
        <div className={styles.chartSection}>
          {/* Graphique circulaire de progression des tâches */}
          <div className={`${styles.dashboardCard} ${styles.progressChart}`}>
            <h3 className={styles.cardTitle}>Progression des tâches</h3>
            <TaskProgressChart data={taskData} />
          </div>
          
          {/* Graphique chronologique des activités */}
          <div className={`${styles.dashboardCard} ${styles.timelineChart}`}>
            <h3 className={styles.cardTitle}>Chronologie des activités</h3>
            <ActivityTimelineChart data={activityData} />
          </div>
        </div>

        {/* Deuxième rangée: Widgets informatifs */}
        <div className={styles.widgetsSection}>
          {/* Widget résumé des tâches */}
          <div className={styles.dashboardCard}>
            <TaskSummaryWidget data={taskData} />
          </div>
          
          {/* Widget activités récentes */}
          <div className={styles.dashboardCard}>
            <RecentActivitiesWidget activities={activityData?.recentActivities} />
          </div>
          
          {/* Widget notifications */}
          <div className={styles.dashboardCard}>
            <NotificationsWidget notifications={notifications} />
          </div>
          
          {/* Widget performance */}
          <div className={styles.dashboardCard}>
            <PerformanceWidget data={performanceData} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
