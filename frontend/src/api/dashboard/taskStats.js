// --- fichier: frontend/src/api/dashboard/taskStats.js ---
import dashboardClient, { delay } from './client';
import moment from 'moment';
import 'moment/locale/fr';

// Configuration de moment.js en français
moment.locale('fr');

/**
 * Génère des statistiques de tâches simulées
 * @returns {object} Statistiques des tâches
 */
const generateTaskStats = () => {
  const totalTasks = Math.floor(Math.random() * 50) + 30;
  const completedTasks = Math.floor(totalTasks * (Math.random() * 0.3 + 0.4)); // 40-70% de complétion
  const inProgressTasks = Math.floor((totalTasks - completedTasks) * 0.6);
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;
  const lateTasks = Math.floor(pendingTasks * (Math.random() * 0.3 + 0.1)); // 10-40% des tâches en attente sont en retard
  
  return {
    total: totalTasks,
    completed: completedTasks,
    inProgress: inProgressTasks,
    pending: pendingTasks,
    late: lateTasks,
    completionRate: Math.round((completedTasks / totalTasks) * 100),
    weeklyProgress: Math.floor(Math.random() * 20) - 5, // Progression par rapport à la semaine précédente (-5% à +15%)
    priorityDistribution: {
      high: Math.floor(totalTasks * (Math.random() * 0.2 + 0.2)), // 20-40%
      medium: Math.floor(totalTasks * (Math.random() * 0.3 + 0.3)), // 30-60%
      low: Math.floor(totalTasks * (Math.random() * 0.2 + 0.1)), // 10-30%
    }
  };
};

/**
 * Génère un résumé des tâches simulé
 * @returns {object} Résumé des tâches
 */
const generateTaskSummary = () => {
  return {
    totalTasks: Math.floor(Math.random() * 50) + 30,
    completedToday: Math.floor(Math.random() * 5) + 1,
    createdToday: Math.floor(Math.random() * 7) + 2,
    nearingDeadline: Math.floor(Math.random() * 4) + 1,
    overdue: Math.floor(Math.random() * 3),
    averageCompletionTime: Math.floor(Math.random() * 24) + 48, // en heures
    tasksPerCategory: {
      développement: Math.floor(Math.random() * 15) + 10,
      design: Math.floor(Math.random() * 10) + 5,
      documentation: Math.floor(Math.random() * 8) + 3,
      réunions: Math.floor(Math.random() * 6) + 2,
      divers: Math.floor(Math.random() * 5) + 1,
    }
  };
};

/**
 * Génère une distribution des tâches simulée
 * @returns {object} Distribution des tâches
 */
const generateTaskDistribution = () => {
  return {
    byStatus: {
      completées: Math.floor(Math.random() * 40) + 20,
      enCours: Math.floor(Math.random() * 30) + 10,
      enAttente: Math.floor(Math.random() * 20) + 5,
      enRetard: Math.floor(Math.random() * 10) + 1,
    },
    byPriority: {
      haute: Math.floor(Math.random() * 25) + 10,
      moyenne: Math.floor(Math.random() * 35) + 15,
      basse: Math.floor(Math.random() * 20) + 5,
    },
    byAssignee: {
      'Jean Dupont': Math.floor(Math.random() * 15) + 5,
      'Marie Martin': Math.floor(Math.random() * 15) + 5,
      'Lucas Bernard': Math.floor(Math.random() * 15) + 5,
      'Sophie Petit': Math.floor(Math.random() * 15) + 5,
      'Autres': Math.floor(Math.random() * 10) + 3,
    }
  };
};

/**
 * Simule une réponse API avec possibilité d'erreurs aléatoires
 * @param {Function} dataGenerator - Fonction qui génère les données
 * @param {Object} options - Options pour la simulation
 * @returns {Promise<any>} Données simulées
 */
const simulateResponse = async (dataGenerator, options = {}) => {
  // Simuler un délai réseau
  await delay(options.delay || 800);
  
  // Simuler un taux d'erreur de 5%
  if (Math.random() < 0.05 && !options.noError) {
    throw new Error('Erreur de connexion au serveur. Veuillez réessayer.');
  }
  
  return dataGenerator(options);
};

/**
 * API des statistiques de tâches
 */
export default {
  /**
   * Récupère les statistiques générales des tâches
   * @param {Object} options - Options pour la requête
   * @returns {Promise<object>} Statistiques des tâches
   */
  getTaskStats: async (options = {}) => {
    try {
      // Dans une version production, on utiliserait:
      // return await dashboardClient.get('/stats', options);
      
      // Version simulée pour le développement:
      return await simulateResponse(generateTaskStats, options);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de tâches:', error);
      throw error;
    }
  },
  
  /**
   * Récupère un résumé des tâches
   * @param {Object} options - Options pour la requête
   * @returns {Promise<object>} Résumé des tâches
   */
  getTaskSummary: async (options = {}) => {
    try {
      // Dans une version production, on utiliserait:
      // return await dashboardClient.get('/summary', options);
      
      // Version simulée pour le développement:
      return await simulateResponse(generateTaskSummary, options);
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé des tâches:', error);
      throw error;
    }
  },
  
  /**
   * Récupère la distribution des tâches
   * @param {Object} options - Options pour la requête
   * @returns {Promise<object>} Distribution des tâches
   */
  getTaskDistribution: async (options = {}) => {
    try {
      // Dans une version production, on utiliserait:
      // return await dashboardClient.get('/distribution', options);
      
      // Version simulée pour le développement:
      return await simulateResponse(generateTaskDistribution, options);
    } catch (error) {
      console.error('Erreur lors de la récupération de la distribution des tâches:', error);
      throw error;
    }
  }
};
