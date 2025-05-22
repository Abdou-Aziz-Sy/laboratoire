// --- fichier: frontend/src/api/dashboard/performance.js ---
import dashboardClient, { delay } from './client';
import moment from 'moment';
import 'moment/locale/fr';

// Configuration de moment.js en français
moment.locale('fr');

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
 * Génère des données de performance d'équipe simulées
 * @returns {object} Données de performance d'équipe
 */
const generateTeamPerformance = () => {
  const members = [
    { name: 'Jean Dupont', role: 'Développeur Frontend' },
    { name: 'Marie Martin', role: 'Développeur Backend' },
    { name: 'Lucas Bernard', role: 'Designer UI/UX' },
    { name: 'Sophie Petit', role: 'Chef de Projet' },
    { name: 'Thomas Lefebvre', role: 'DevOps' }
  ];
  
  return members.map(member => ({
    ...member,
    tasksCompleted: Math.floor(Math.random() * 20) + 5,
    efficiency: Math.floor(Math.random() * 30) + 70, // 70-100
    timeSpent: Math.floor(Math.random() * 40) + 10, // heures
    overdue: Math.floor(Math.random() * 3), // 0-2 tâches en retard
    satisfaction: Math.floor(Math.random() * 2) + 3, // 3-5 étoiles
  }));
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
  
  return dataGenerator(options.period);
};

/**
 * API des données de performance
 */
export default {
  /**
   * Récupère les données de performance par période
   * @param {string} period - Période ('day', 'week', 'month', 'year')
   * @param {Object} options - Options pour la requête
   * @returns {Promise<object>} Données de performance
   */
  getPerformanceData: async (period = 'week', options = {}) => {
    try {
      // Dans une version production, on utiliserait:
      // return await dashboardClient.get('/performance', { params: { period }, ...options });
      
      // Version simulée pour le développement:
      return await simulateResponse(generatePerformanceData, { ...options, period });
    } catch (error) {
      console.error('Erreur lors de la récupération des données de performance:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les données de performance de l'équipe
   * @param {Object} options - Options pour la requête
   * @returns {Promise<Array>} Données de performance de l'équipe
   */
  getTeamPerformance: async (options = {}) => {
    try {
      // Dans une version production, on utiliserait:
      // return await dashboardClient.get('/team', options);
      
      // Version simulée pour le développement:
      return await simulateResponse(generateTeamPerformance, options);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de performance de l\'équipe:', error);
      throw error;
    }
  }
};
