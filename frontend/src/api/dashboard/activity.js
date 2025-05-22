// --- fichier: frontend/src/api/dashboard/activity.js ---
import dashboardClient, { delay } from './client';
import moment from 'moment';
import 'moment/locale/fr';

// Configuration de moment.js en français
moment.locale('fr');

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
 * Génère des activités récentes simulées
 * @param {number} limit - Nombre d'activités à générer
 * @returns {Array} Liste d'activités récentes
 */
const generateRecentActivity = (limit = 10) => {
  const activities = [];
  const activityTypes = ['tâche_créée', 'tâche_terminée', 'commentaire', 'modification', 'assignation'];
  const users = ['Jean Dupont', 'Marie Martin', 'Lucas Bernard', 'Sophie Petit', 'Thomas Lefebvre'];
  const now = moment();
  
  for (let i = 0; i < limit; i++) {
    const minutesAgo = Math.floor(Math.random() * 60 * 24); // Dans les dernières 24h
    const timestamp = moment(now).subtract(minutesAgo, 'minutes');
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    let title, description;
    
    switch (type) {
      case 'tâche_créée':
        title = 'Nouvelle tâche créée';
        description = `${user} a créé une nouvelle tâche: "Implémenter la fonctionnalité X"`;
        break;
      case 'tâche_terminée':
        title = 'Tâche terminée';
        description = `${user} a marqué la tâche "Corriger le bug Y" comme terminée`;
        break;
      case 'commentaire':
        title = 'Nouveau commentaire';
        description = `${user} a commenté sur la tâche "Améliorer la performance Z"`;
        break;
      case 'modification':
        title = 'Tâche modifiée';
        description = `${user} a modifié la priorité de la tâche "Revue de code"`;
        break;
      case 'assignation':
        title = 'Tâche assignée';
        description = `${user} a assigné la tâche "Documentation" à Sophie Petit`;
        break;
      default:
        title = 'Activité';
        description = `${user} a effectué une action sur une tâche`;
    }
    
    activities.push({
      id: `activity-${i}`,
      type,
      title,
      description,
      user,
      timestamp: timestamp.format('YYYY-MM-DD HH:mm:ss'),
      timeAgo: timestamp.fromNow(),
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    });
  }
  
  // Trier par timestamp (du plus récent au plus ancien)
  return activities.sort((a, b) => {
    return moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf();
  });
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
  
  return dataGenerator(options.days || options.limit);
};

/**
 * API des données d'activité
 */
export default {
  /**
   * Récupère les données d'activité pour la timeline
   * @param {number} days - Nombre de jours à récupérer
   * @param {Object} options - Options pour la requête
   * @returns {Promise<Array>} Données d'activité
   */
  getActivityData: async (days = 14, options = {}) => {
    try {
      // Dans une version production, on utiliserait:
      // return await dashboardClient.get('/activity', { params: { days }, ...options });
      
      // Version simulée pour le développement:
      return await simulateResponse(generateActivityData, { ...options, days });
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'activité:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les activités récentes
   * @param {number} limit - Nombre d'activités à récupérer
   * @param {Object} options - Options pour la requête
   * @returns {Promise<Array>} Liste d'activités
   */
  getRecentActivity: async (limit = 10, options = {}) => {
    try {
      // Dans une version production, on utiliserait:
      // return await dashboardClient.get('/recent-activity', { params: { limit }, ...options });
      
      // Version simulée pour le développement:
      return await simulateResponse(generateRecentActivity, { ...options, limit });
    } catch (error) {
      console.error('Erreur lors de la récupération des activités récentes:', error);
      throw error;
    }
  }
};
