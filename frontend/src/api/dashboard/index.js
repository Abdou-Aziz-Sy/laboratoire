// --- fichier: frontend/src/api/dashboard/index.js ---
import dashboardClient from './client';
import taskStats from './taskStats';
import activity from './activity';
import performance from './performance';

/**
 * API du tableau de bord - Point d'entrée centralisé
 * Regroupe toutes les fonctions liées au dashboard pour faciliter l'import
 */
export default {
  // Client API configuré pour le dashboard
  client: dashboardClient,
  
  // Statistiques des tâches
  getTaskStats: taskStats.getTaskStats,
  getTaskSummary: taskStats.getTaskSummary,
  getTaskDistribution: taskStats.getTaskDistribution,
  
  // Données d'activité
  getActivityData: activity.getActivityData,
  getRecentActivity: activity.getRecentActivity,
  
  // Données de performance
  getPerformanceData: performance.getPerformanceData,
  getTeamPerformance: performance.getTeamPerformance
};
