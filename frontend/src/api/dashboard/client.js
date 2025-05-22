// --- fichier: frontend/src/api/dashboard/client.js ---
import { ApiClient, ApiCache } from '../../utils/apiUtils';

// URL de base pour les endpoints liés au dashboard
const BASE_URL = 'http://localhost:8081/api/dashboard';

/**
 * Client API spécifique au dashboard
 * Configuré avec un cache dédié et des options adaptées aux besoins du dashboard
 */
const dashboardCache = new ApiCache({
  ttl: 5 * 60 * 1000, // 5 minutes par défaut
  maxSize: 50, // Limité car données de dashboard moins nombreuses
});

/**
 * Client API configuré pour les endpoints du dashboard
 */
const dashboardClient = new ApiClient({
  baseUrl: BASE_URL,
  cache: dashboardCache,
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  headers: {
    'Content-Type': 'application/json',
    'X-Client': 'Dashboard',
  }
});

/**
 * Simule un délai réseau pour les appels API
 * @param {number} ms - Délai en millisecondes
 * @returns {Promise<void>} Une promesse qui se résout après le délai spécifié
 */
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export default dashboardClient;
