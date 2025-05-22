// --- fichier: frontend/src/utils/apiUtils.js ---
/**
 * Utilitaires pour les appels API, la gestion d'erreurs et le cache
 */

/**
 * Classe de gestion du cache pour les appels API
 */
export class ApiCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes par défaut
    this.maxSize = options.maxSize || 100; // Nombre maximum d'entrées dans le cache
  }

  /**
   * Génère une clé de cache à partir d'un endpoint et de paramètres
   * @param {string} endpoint - Point de terminaison de l'API
   * @param {object} params - Paramètres de la requête
   * @returns {string} Clé de cache
   */
  generateKey(endpoint, params = {}) {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  /**
   * Vérifie si une entrée existe dans le cache et est toujours valide
   * @param {string} key - Clé de cache
   * @returns {boolean} True si l'entrée est valide
   */
  has(key) {
    if (!this.cache.has(key)) return false;
    
    const { expiry } = this.cache.get(key);
    const isExpired = expiry <= Date.now();
    
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Récupère une entrée du cache
   * @param {string} key - Clé de cache
   * @returns {any} Valeur en cache ou null
   */
  get(key) {
    if (!this.has(key)) return null;
    
    const { data } = this.cache.get(key);
    return data;
  }

  /**
   * Ajoute ou met à jour une entrée dans le cache
   * @param {string} key - Clé de cache
   * @param {any} data - Données à mettre en cache
   * @param {number} ttl - Durée de vie en millisecondes
   */
  set(key, data, ttl = this.defaultTTL) {
    // Nettoyer le cache si la limite est atteinte
    if (this.cache.size >= this.maxSize) {
      this._pruneCache();
    }
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
      timestamp: Date.now()
    });
  }

  /**
   * Supprime les entrées les plus anciennes pour maintenir la taille du cache
   * @private
   */
  _pruneCache() {
    // Convertir en tableau pour trier par timestamp
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Supprimer les 25% les plus anciens
    const toRemove = Math.ceil(this.maxSize * 0.25);
    entries.slice(0, toRemove).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  /**
   * Invalide une entrée spécifique du cache
   * @param {string} key - Clé de cache à invalider
   */
  invalidate(key) {
    this.cache.delete(key);
  }

  /**
   * Invalide toutes les entrées correspondant à un préfixe
   * @param {string} prefix - Préfixe de clé à invalider
   */
  invalidateByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Vide complètement le cache
   */
  clear() {
    this.cache.clear();
  }
}

/**
 * Classe de gestion des erreurs API
 */
export class ApiError extends Error {
  constructor(message, statusCode, endpoint, params = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.params = params;
    this.timestamp = new Date();
  }

  /**
   * Crée un message d'erreur convivial basé sur le code d'erreur
   * @returns {string} Message d'erreur formaté
   */
  getFriendlyMessage() {
    switch (this.statusCode) {
      case 401:
        return 'Votre session a expiré. Veuillez vous reconnecter.';
      case 403:
        return 'Vous n\'avez pas les permissions nécessaires pour cette action.';
      case 404:
        return 'La ressource demandée n\'a pas été trouvée.';
      case 422:
        return 'Les données fournies ne sont pas valides.';
      case 429:
        return 'Trop de requêtes. Veuillez réessayer plus tard.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Le serveur rencontre un problème. Veuillez réessayer plus tard.';
      default:
        return this.message || 'Une erreur s\'est produite. Veuillez réessayer.';
    }
  }
}

/**
 * Classe utilitaire pour les appels API avec retry et gestion d'erreurs
 */
export class ApiClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || '';
    this.defaultHeaders = options.headers || {
      'Content-Type': 'application/json'
    };
    this.cache = options.cache || new ApiCache();
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.retryStatusCodes = options.retryStatusCodes || [408, 429, 500, 502, 503, 504];
  }

  /**
   * Ajoute le token d'authentification aux en-têtes
   * @returns {object} En-têtes avec token d'authentification
   */
  _getAuthHeaders() {
    const headers = { ...this.defaultHeaders };
    const token = localStorage.getItem('authToken');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Détermine si une erreur doit déclencher une nouvelle tentative
   * @param {Error} error - Erreur rencontrée
   * @returns {boolean} True si l'erreur justifie une nouvelle tentative
   */
  _shouldRetry(error) {
    // Erreurs réseau (offline, timeout)
    if (!error.statusCode) return true;
    
    // Erreurs serveur spécifiques
    return this.retryStatusCodes.includes(error.statusCode);
  }

  /**
   * Effectue un appel API avec gestion des erreurs et retries
   * @param {string} endpoint - Point de terminaison de l'API
   * @param {object} options - Options de la requête
   * @returns {Promise<any>} Réponse de l'API
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      params = {},
      data = null,
      headers = {},
      useCache = true,
      cacheTTL,
      noRetry = false
    } = options;

    // Créer l'URL complète
    const url = this._buildUrl(endpoint, params);
    
    // Vérifier le cache pour les requêtes GET
    if (method === 'GET' && useCache) {
      const cacheKey = this.cache.generateKey(endpoint, params);
      const cachedData = this.cache.get(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Préparer les options fetch
    const fetchOptions = {
      method,
      headers: { ...this._getAuthHeaders(), ...headers }
    };
    
    // Ajouter le corps de la requête si nécessaire
    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    let lastError;
    let retries = 0;
    
    while (retries <= (noRetry ? 0 : this.maxRetries)) {
      try {
        // Effectuer la requête
        const response = await fetch(url, fetchOptions);
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || response.statusText,
            response.status,
            endpoint,
            params
          );
        }
        
        // Analyser la réponse JSON
        const responseData = await response.json();
        
        // Mettre en cache la réponse pour les requêtes GET
        if (method === 'GET' && useCache) {
          const cacheKey = this.cache.generateKey(endpoint, params);
          this.cache.set(cacheKey, responseData, cacheTTL);
        }
        
        return responseData;
      } catch (error) {
        lastError = error;
        
        // Déterminer s'il faut réessayer
        if (retries >= this.maxRetries || !this._shouldRetry(error) || noRetry) {
          break;
        }
        
        // Attendre avant de réessayer (avec délai exponentiel)
        const delay = this.retryDelay * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        retries++;
      }
    }
    
    // Propager l'erreur après les tentatives
    throw lastError;
  }

  /**
   * Construit l'URL complète avec les paramètres de requête
   * @param {string} endpoint - Point de terminaison de l'API
   * @param {object} params - Paramètres de la requête
   * @returns {string} URL complète
   */
  _buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    
    // Ajouter les paramètres de requête
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  }

  /**
   * Raccourci pour les requêtes GET
   * @param {string} endpoint - Point de terminaison
   * @param {object} options - Options de la requête
   * @returns {Promise<any>} Réponse de l'API
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Raccourci pour les requêtes POST
   * @param {string} endpoint - Point de terminaison
   * @param {object} data - Données à envoyer
   * @param {object} options - Options de la requête
   * @returns {Promise<any>} Réponse de l'API
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data, useCache: false });
  }

  /**
   * Raccourci pour les requêtes PUT
   * @param {string} endpoint - Point de terminaison
   * @param {object} data - Données à envoyer
   * @param {object} options - Options de la requête
   * @returns {Promise<any>} Réponse de l'API
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data, useCache: false });
  }

  /**
   * Raccourci pour les requêtes DELETE
   * @param {string} endpoint - Point de terminaison
   * @param {object} options - Options de la requête
   * @returns {Promise<any>} Réponse de l'API
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE', useCache: false });
  }

  /**
   * Invalide les entrées du cache correspondant à un endpoint
   * @param {string} endpoint - Point de terminaison à invalider
   */
  invalidateCache(endpoint) {
    this.cache.invalidateByPrefix(endpoint);
  }

  /**
   * Vide complètement le cache
   */
  clearCache() {
    this.cache.clear();
  }
}

/**
 * Crée des composants de chargement et d'erreur standardisés
 */
export const ApiUIComponents = {
  /**
   * Crée un composant de chargement
   * @param {string} message - Message de chargement
   * @returns {Object} Propriétés CSS pour le spinner
   */
  loadingSpinnerStyle: {
    display: 'inline-block',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(253, 126, 20, 0.6)',
    animation: 'spin 1s ease-in-out infinite',
  },

  /**
   * Crée un composant d'erreur avec retry
   * @param {Error} error - Erreur à afficher
   * @param {Function} onRetry - Fonction de retry
   * @returns {Object} Propriétés CSS pour le message d'erreur
   */
  errorContainerStyle: {
    background: 'rgba(30, 30, 35, 0.6)',
    backdropFilter: 'blur(8px)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    margin: '16px 0',
    color: 'white',
  },
};

/**
 * Fonctions utilitaires pour la pagination
 */
export const PaginationUtils = {
  /**
   * Génère les paramètres d'URL pour la pagination
   * @param {object} paginationState - État de pagination actuel
   * @returns {URLSearchParams} Paramètres d'URL
   */
  generateUrlParams(paginationState) {
    const params = new URLSearchParams();
    
    if (paginationState.page) {
      params.append('page', paginationState.page);
    }
    
    if (paginationState.pageSize) {
      params.append('size', paginationState.pageSize);
    }
    
    if (paginationState.sortBy) {
      params.append('sort', paginationState.sortBy);
      params.append('direction', paginationState.sortDirection || 'asc');
    }
    
    return params;
  },

  /**
   * Extrait les paramètres de pagination de l'URL
   * @returns {object} État de pagination
   */
  getParamsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    
    return {
      page: parseInt(params.get('page')) || 1,
      pageSize: parseInt(params.get('size')) || 10,
      sortBy: params.get('sort') || null,
      sortDirection: params.get('direction') || 'asc'
    };
  },

  /**
   * Met à jour l'URL avec les paramètres de pagination
   * @param {object} paginationState - État de pagination actuel
   */
  updateUrlWithPagination(paginationState) {
    const params = this.generateUrlParams(paginationState);
    const url = new URL(window.location.href);
    
    // Remplacer les paramètres existants
    Object.keys(paginationState).forEach(key => {
      url.searchParams.delete(key);
    });
    
    // Ajouter les nouveaux paramètres
    params.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    
    // Mettre à jour l'URL sans rechargement
    window.history.pushState({}, '', url.toString());
  }
};
