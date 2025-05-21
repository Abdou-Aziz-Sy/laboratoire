// frontend/src/utils/filterUtils.js
/**
 * Utilitaires pour gérer les filtres, leur persistance et leur transformation en paramètres d'URL
 */

// Clé utilisée pour stocker les filtres dans sessionStorage
export const FILTER_STORAGE_KEY = 'taskhandler_task_filters';

// Structure des filtres par défaut
export const defaultFilters = {
  status: '',
  priorite: '',
  dateDebut: '',
  dateFin: '',
  searchText: '',
  page: 0,
  size: 10,
  sort: 'dateEcheance,asc'
};

/**
 * Sauvegarde les filtres dans sessionStorage
 * @param {Object} filters - Les filtres à sauvegarder
 */
export const saveFiltersToSession = (filters) => {
  try {
    sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des filtres:', error);
  }
};

/**
 * Récupère les filtres depuis sessionStorage
 * @returns {Object} Les filtres récupérés ou les filtres par défaut
 */
export const loadFiltersFromSession = () => {
  try {
    const savedFilters = sessionStorage.getItem(FILTER_STORAGE_KEY);
    return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
  } catch (error) {
    console.error('Erreur lors de la récupération des filtres:', error);
    return defaultFilters;
  }
};

/**
 * Convertit les filtres en paramètres d'URL
 * @param {Object} filters - Les filtres à convertir
 * @returns {string} La chaîne de requête URL
 */
export const filtersToQueryString = (filters) => {
  const params = new URLSearchParams();
  
  // Ajout des filtres non vides uniquement
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  });
  
  return params.toString();
};

/**
 * Extrait les filtres des paramètres d'URL
 * @param {URLSearchParams} searchParams - L'objet URLSearchParams
 * @returns {Object} Les filtres extraits
 */
export const queryStringToFilters = (searchParams) => {
  const filters = { ...defaultFilters };
  
  // Extraction des paramètres connus
  for (const key of Object.keys(defaultFilters)) {
    const value = searchParams.get(key);
    if (value !== null) {
      // Conversion des nombres
      if (key === 'page' || key === 'size') {
        filters[key] = parseInt(value, 10);
      } else {
        filters[key] = value;
      }
    }
  }
  
  return filters;
};

/**
 * Formate les filtres pour l'API
 * @param {Object} filters - Les filtres à formater
 * @returns {Object} Les paramètres de requête pour l'API
 */
export const formatApiQueryParams = (filters) => {
  const { searchText, sort, ...restFilters } = filters;
  const queryParams = { ...restFilters };
  
  // Gestion du tri
  if (sort) {
    queryParams.sort = sort;
  }
  
  // Conversion de la recherche textuelle en paramètre de requête
  if (searchText) {
    queryParams.query = searchText;
  }
  
  return queryParams;
};