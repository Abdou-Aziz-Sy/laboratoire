// --- fichier: frontend/src/api/dashboard.js ---
import moment from 'moment';
import 'moment/locale/fr';

// Configuration de moment.js en français
moment.locale('fr');

// URL de base pour les futurs endpoints liés au dashboard
const BASE_URL = 'http://localhost:8081/api/dashboard';

/**
 * Simule un délai réseau pour les appels API
 * @param {number} ms - Délai en millisecondes
 * @returns {Promise<void>} Une promesse qui se résout après le délai spécifié
 */
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Effectue une requête fetch simulée avec le token d'authentification
 * @param {string} endpoint - Le point de terminaison API à appeler
 * @param {object} options - Options de la requête (method, body, etc.)
 * @returns {Promise<any>} La réponse simulée
 */
const simulatedFetch = async (endpoint, options = {}) => {
  // Vérifier si l'utilisateur est authentifié
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Vous devez être connecté pour accéder au tableau de bord.');
  }

  // Simuler un délai réseau
  await delay(options.delay || 800);

  // Simuler un taux d'erreur de 5%
  if (Math.random() < 0.05 && !options.noError) {
    throw new Error('Erreur de connexion au serveur. Veuillez réessayer.');
  }

  // Déterminer quelle donnée simulée retourner en fonction de l'endpoint
  switch (endpoint) {
    case 'stats':
      return generateTaskStats();
    case 'activity':
      return generateActivityData(options.days || 14);
    case 'performance':
      return generatePerformanceData(options.period || 'week');
    case 'summary':
      return generateTaskSummary();
    case 'recent-activity':
      return generateRecentActivity(options.limit || 10);
    case 'task-distribution':
      return generateTaskDistribution();
    case 'team-performance':
      return generateTeamPerformance();
    default:
      throw new Error(`Endpoint non reconnu: ${endpoint}`);
  }
};

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
 * Génère des données d'activité chronologiques simulées
 * @param {number} days - Nombre de jours à générer
 * @returns {Array} Données d'activité
 */
const generateActivityData = (days = 14) => {
  const data = [];
  const now = moment();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = moment(now).subtract(i, 'days');
    
    data.push({
      date: date.format('YYYY-MM-DD'),
      label: i === 0 ? "Aujourd'hui" : i === 1 ? 'Hier' : date.format('D MMM'),
      tâchesCreées: Math.floor(Math.random() * 6) + 1,
      tâchesComplétées: Math.floor(Math.random() * 8),
      commentaires: Math.floor(Math.random() * 12),
    });
  }
  
  return data;
};

/**
 * Génère des données de performance simulées par période
 * @param {string} period - Période ('day', 'week', 'month', 'year')
 * @returns {object} Données de performance
 */
const generatePerformanceData = (period = 'week') => {
  let timeUnits;
  let format;
  
  switch (period) {
    case 'day':
      timeUnits = 24; // heures
      format = 'HH:mm';
      break;
    case 'week':
      timeUnits = 7; // jours
      format = 'ddd';
      break;
    case 'month':
      timeUnits = moment().daysInMonth(); // jours dans le mois
      format = 'D MMM';
      break;
    case 'year':
      timeUnits = 12; // mois
      format = 'MMM';
      break;
    default:
      timeUnits = 7;
      format = 'ddd';
  }
  
  const data = [];
  const now = moment();
  
  for (let i = 0; i < timeUnits; i++) {
    let date;
    
    if (period === 'day') {
      date = moment(now).subtract(timeUnits - 1 - i, 'hours');
    } else if (period === 'week') {
      date = moment(now).subtract(timeUnits - 1 - i, 'days');
    } else if (period === 'month') {
      date = moment(now).date(i + 1);
    } else {
      date = moment(now).month(i);
    }
    
    const productivity = Math.floor(Math.random() * 60) + 40; // 40-100
    const efficiency = Math.floor(Math.random() * 40) + 60; // 60-100
    
    data.push({
      date: date.format('YYYY-MM-DD HH:mm'),
      label: date.format(format),
      productivity,
      efficiency,
      score: Math.floor((productivity + efficiency) / 2),
    });
  }
  
  return data;
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
 * Génère des activités récentes simulées
 * @param {number} limit - Nombre d'activités à générer
 * @returns {Array} Liste d'activités récentes
 */
const generateRecentActivity = (limit = 10) => {
  const activities = [];
  const activityTypes = ['task_created', 'task_completed', 'task_updated', 'comment_added', 'user_assigned'];
  const users = [
    { id: 1, name: 'Thomas Dupont', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Lucie Martin', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Olivier Bernard', avatar: 'https://randomuser.me/api/portraits/men/59.jpg' },
    { id: 4, name: 'Sophie Lambert', avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
  ];
  
  const taskTitles = [
    'Mise à jour de la documentation API',
    'Correction du bug #4587',
    'Implémenter la nouvelle fonctionnalité de filtrage',
    'Optimiser les requêtes de la base de données',
    'Mettre à jour les dépendances du projet',
    'Refactoriser le module d\'authentification',
    'Ajouter des tests unitaires pour le module de paiement',
    'Créer les maquettes pour la nouvelle interface mobile',
  ];
  
  for (let i = 0; i < limit; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const time = moment().subtract(Math.floor(Math.random() * 24 * 5), 'hours'); // Dernières 5 jours
    const taskTitle = taskTitles[Math.floor(Math.random() * taskTitles.length)];
    
    let action;
    switch (type) {
      case 'task_created':
        action = `a créé la tâche "${taskTitle}"`;
        break;
      case 'task_completed':
        action = `a terminé la tâche "${taskTitle}"`;
        break;
      case 'task_updated':
        action = `a mis à jour la tâche "${taskTitle}"`;
        break;
      case 'comment_added':
        action = `a commenté sur la tâche "${taskTitle}"`;
        break;
      case 'user_assigned':
        const assignee = users[Math.floor(Math.random() * users.length)];
        action = `a assigné ${assignee.name} à la tâche "${taskTitle}"`;
        break;
    }
    
    activities.push({
      id: i + 1,
      type,
      user,
      action,
      timestamp: time.format(),
      relativeTime: time.fromNow(),
      taskId: Math.floor(Math.random() * 1000) + 1000,
      taskTitle
    });
  }
  
  // Trier par heure, le plus récent d'abord
  activities.sort((a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf());
  
  return activities;
};

/**
 * Génère une distribution des tâches simulée
 * @returns {object} Distribution des tâches
 */
const generateTaskDistribution = () => {
  return {
    byStatus: [
      { name: 'Terminées', value: Math.floor(Math.random() * 30) + 20, color: '#4caf50' },
      { name: 'En cours', value: Math.floor(Math.random() * 20) + 10, color: '#2196f3' },
      { name: 'En attente', value: Math.floor(Math.random() * 15) + 5, color: '#ff9800' },
      { name: 'En retard', value: Math.floor(Math.random() * 10) + 1, color: '#f44336' },
    ],
    byPriority: [
      { name: 'Haute', value: Math.floor(Math.random() * 15) + 10, color: '#f44336' },
      { name: 'Moyenne', value: Math.floor(Math.random() * 25) + 15, color: '#ff9800' },
      { name: 'Basse', value: Math.floor(Math.random() * 20) + 10, color: '#4caf50' },
    ],
    byAssignee: [
      { name: 'Thomas D.', value: Math.floor(Math.random() * 15) + 8, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { name: 'Lucie M.', value: Math.floor(Math.random() * 15) + 8, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { name: 'Olivier B.', value: Math.floor(Math.random() * 15) + 8, avatar: 'https://randomuser.me/api/portraits/men/59.jpg' },
      { name: 'Sophie L.', value: Math.floor(Math.random() * 15) + 8, avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
      { name: 'Non assignées', value: Math.floor(Math.random() * 10) + 5, avatar: null },
    ]
  };
};

/**
 * Génère des données de performance d'équipe simulées
 * @returns {object} Données de performance d'équipe
 */
const generateTeamPerformance = () => {
  const members = [
    { id: 1, name: 'Thomas Dupont', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Lucie Martin', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Olivier Bernard', avatar: 'https://randomuser.me/api/portraits/men/59.jpg' },
    { id: 4, name: 'Sophie Lambert', avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
  ];
  
  return members.map(member => ({
    ...member,
    tasksCompleted: Math.floor(Math.random() * 15) + 5,
    tasksInProgress: Math.floor(Math.random() * 5) + 1,
    efficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
    responseTime: Math.floor(Math.random() * 5) + 1, // 1-6 heures
    lastActive: moment().subtract(Math.floor(Math.random() * 48), 'hours').fromNow(),
  }));
};

/**
 * API du tableau de bord - Simulateur d'API pour le développement frontend
 */
export default {
  /**
   * Récupère les statistiques générales des tâches
   * @returns {Promise<object>} Statistiques des tâches
   * @api {GET} /api/dashboard/stats
   */
  getTaskStats: async () => {
    return simulatedFetch('stats');
  },
  
  /**
   * Récupère les données d'activité pour la timeline
   * @param {number} days - Nombre de jours à récupérer
   * @returns {Promise<Array>} Données d'activité
   * @api {GET} /api/dashboard/activity
   */
  getActivityData: async (days = 14) => {
    return simulatedFetch('activity', { days });
  },
  
  /**
   * Récupère les données de performance par période
   * @param {string} period - Période ('day', 'week', 'month', 'year')
   * @returns {Promise<object>} Données de performance
   * @api {GET} /api/dashboard/performance
   */
  getPerformanceData: async (period = 'week') => {
    return simulatedFetch('performance', { period });
  },
  
  /**
   * Récupère un résumé des tâches
   * @returns {Promise<object>} Résumé des tâches
   * @api {GET} /api/dashboard/summary
   */
  getTaskSummary: async () => {
    return simulatedFetch('summary');
  },
  
  /**
   * Récupère les activités récentes
   * @param {number} limit - Nombre d'activités à récupérer
   * @returns {Promise<Array>} Liste d'activités
   * @api {GET} /api/dashboard/recent-activity
   */
  getRecentActivity: async (limit = 10) => {
    return simulatedFetch('recent-activity', { limit });
  },
  
  /**
   * Récupère la distribution des tâches
   * @returns {Promise<object>} Distribution des tâches
   * @api {GET} /api/dashboard/distribution
   */
  getTaskDistribution: async () => {
    return simulatedFetch('task-distribution');
  },
  
  /**
   * Récupère les données de performance de l'équipe
   * @returns {Promise<Array>} Données de performance de l'équipe
   * @api {GET} /api/dashboard/team
   */
  getTeamPerformance: async () => {
    return simulatedFetch('team-performance');
  }
};
