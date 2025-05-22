// --- fichier: frontend/src/hooks/useDashboardData.js ---
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import dashboardApi from '../api/dashboard';
import { useNavigate, useLocation } from 'react-router-dom';
import { ApiUIComponents } from '../utils/apiUtils';

/**
 * Hook personnalisé pour manipuler et optimiser les données du dashboard
 * Fournit des fonctions de filtrage, tri, mise en cache et gestion d'erreurs
 */
const useDashboardData = () => {
  // Navigation et location pour la gestion des paramètres d'URL
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer le contexte du dashboard
  const dashboard = useDashboard();
  
  // État local pour les filtres et les tris
  const [filters, setFilters] = useState(() => {
    // Initialiser les filtres à partir des paramètres d'URL
    return ApiUIComponents.getParamsFromUrl() || {};
  });
  
  const [sorting, setSorting] = useState(() => {
    const urlParams = new URLSearchParams(location.search);
    return {
      field: urlParams.get('sortField') || null,
      direction: urlParams.get('sortDir') || 'asc'
    };
  });
  
  // Cache pour les résultats et les données
  const cacheRef = useRef({
    activity: new Map(),
    performance: new Map(),
    recentActivity: new Map(),
    teamPerformance: new Map(),
    stats: null,
    summary: null,
    taskDistribution: null,
    lastUpdated: null,
    expiryTimes: {}
  });
  
  // Identifiants de requêtes pour éviter les conditions de concurrence
  const requestIdRef = useRef(0);
  
  // Compteur de tentatives pour les retry
  const retryCountRef = useRef({});
  
  // Timeout pour les retry automatiques
  const retryTimeoutRef = useRef({});
  
  // État pour les chargements en cours
  const [loadingStates, setLoadingStates] = useState({
    activity: false,
    performance: false,
    recentActivity: false,
    teamPerformance: false,
    stats: false,
    summary: false,
    taskDistribution: false
  });
  
  // État pour les erreurs
  const [errors, setErrors] = useState({
    activity: null,
    performance: null,
    recentActivity: null,
    teamPerformance: null,
    stats: null,
    summary: null,
    taskDistribution: null
  });
  
  // Durée de vie du cache par type de données (en ms)
  const cacheTTL = {
    activity: 5 * 60 * 1000, // 5 minutes
    performance: 5 * 60 * 1000,
    recentActivity: 1 * 60 * 1000, // 1 minute (se met à jour plus souvent)
    teamPerformance: 15 * 60 * 1000, // 15 minutes
    stats: 5 * 60 * 1000,
    summary: 3 * 60 * 1000,
    taskDistribution: 5 * 60 * 1000
  };
  
  // Configuration de retry
  const retryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 seconde
    maxDelay: 10000, // 10 secondes
  };

  // Vérifier si les données du cache sont périmées
  const isCacheStale = useCallback((cacheKey) => {
    const expiryTime = cacheRef.current.expiryTimes[cacheKey];
    if (!expiryTime) return true;
    
    return Date.now() > expiryTime;
  }, []);

  // Générer une clé de cache basée sur les filtres et les tris
  const generateCacheKey = useCallback((dataType, options = {}) => {
    const baseKey = dataType;
    const filterKey = JSON.stringify(filters);
    const sortKey = JSON.stringify(sorting);
    const optionsKey = JSON.stringify(options);
    return `${baseKey}:${filterKey}:${sortKey}:${optionsKey}`;
  }, [filters, sorting]);
  
  // Mettre à jour les paramètres d'URL
  const updateUrlParams = useCallback(() => {
    const urlParams = ApiUIComponents.generateUrlParams({
      ...filters,
      sortField: sorting.field,
      sortDir: sorting.direction
    });
    
    const newSearch = urlParams.toString() ? `?${urlParams.toString()}` : '';
    navigate({
      pathname: location.pathname,
      search: newSearch
    }, { replace: true });
  }, [filters, sorting, navigate, location.pathname]);
  
  // Mettre à jour l'URL lorsque les filtres ou le tri changent
  useEffect(() => {
    updateUrlParams();
  }, [filters, sorting, updateUrlParams]);

  // Fonction pour calculer le délai de retry avec backoff exponentiel
  const calculateRetryDelay = useCallback((retryCount) => {
    const delay = Math.min(
      retryConfig.baseDelay * Math.pow(2, retryCount),
      retryConfig.maxDelay
    );
    
    // Ajouter un peu de "jitter" pour éviter les requêtes synchronisées
    return delay + (Math.random() * 1000);
  }, []);
  
  // Gérer une requête API avec cache et retry
  const handleApiRequest = useCallback(async (
    apiFn,
    cacheKey,
    setLoadingFn,
    options = {}
  ) => {
    const requestId = ++requestIdRef.current;
    setLoadingFn(true);
    
    // Réinitialiser l'erreur pour ce type de données
    setErrors(prev => ({ ...prev, [cacheKey]: null }));
    
    try {
      // Exécuter la requête API
      const data = await apiFn();
      
      // Vérifier si la requête est toujours pertinente
      if (requestId !== requestIdRef.current) return null;
      
      // Mettre en cache les données
      cacheRef.current[cacheKey] = {
        data,
        timestamp: Date.now()
      };
      
      // Définir l'expiration du cache
      cacheRef.current.expiryTimes[cacheKey] = Date.now() + (cacheTTL[cacheKey] || 5 * 60 * 1000);
      
      // Réinitialiser le compteur de tentatives
      retryCountRef.current[cacheKey] = 0;
      
      // Annuler tout timeout de retry existant
      if (retryTimeoutRef.current[cacheKey]) {
        clearTimeout(retryTimeoutRef.current[cacheKey]);
        retryTimeoutRef.current[cacheKey] = null;
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la requête ${cacheKey}:`, error);
      
      // Stocker l'erreur dans l'état
      setErrors(prev => ({ ...prev, [cacheKey]: error.message }));
      
      // Incrémenter le compteur de tentatives
      retryCountRef.current[cacheKey] = (retryCountRef.current[cacheKey] || 0) + 1;
      
      // Vérifier si on peut retry
      if (retryCountRef.current[cacheKey] <= retryConfig.maxRetries && !options.noRetry) {
        const retryDelay = calculateRetryDelay(retryCountRef.current[cacheKey]);
        
        console.log(`Retry ${retryCountRef.current[cacheKey]}/${retryConfig.maxRetries} pour ${cacheKey} dans ${retryDelay}ms`);
        
        // Programmer un retry automatique
        retryTimeoutRef.current[cacheKey] = setTimeout(() => {
          handleApiRequest(apiFn, cacheKey, setLoadingFn, options);
        }, retryDelay);
      }
      
      // Retourner les données en cache si disponibles, sinon null
      return cacheRef.current[cacheKey]?.data || null;
    } finally {
      setLoadingFn(false);
    }
  }, [calculateRetryDelay]);

  // Fonction pour filtrer les données selon les critères fournis
  const filterData = useCallback((data, filterCriteria) => {
    if (!data || !filterCriteria || Object.keys(filterCriteria).length === 0) {
      return data;
    }

    return data.filter(item => {
      return Object.entries(filterCriteria).every(([key, value]) => {
        // Ignorer les filtres avec valeur null ou undefined
        if (value === null || value === undefined) return true;
        
        // Cas particulier: filtre de date
        if (key.includes('date') && item[key]) {
          const itemDate = new Date(item[key]);
          if (value.start && value.end) {
            return itemDate >= new Date(value.start) && itemDate <= new Date(value.end);
          } else if (value.start) {
            return itemDate >= new Date(value.start);
          } else if (value.end) {
            return itemDate <= new Date(value.end);
          }
          return true;
        }
        
        // Cas particulier: filtre d'interval numérique
        if (typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
          const itemValue = item[key];
          if (value.min !== undefined && value.max !== undefined) {
            return itemValue >= value.min && itemValue <= value.max;
          } else if (value.min !== undefined) {
            return itemValue >= value.min;
          } else if (value.max !== undefined) {
            return itemValue <= value.max;
          }
          return true;
        }
        
        // Filtre de texte (recherche partielle)
        if (typeof item[key] === 'string' && typeof value === 'string') {
          return item[key].toLowerCase().includes(value.toLowerCase());
        }
        
        // Égalité simple
        return item[key] === value;
      });
    });
  }, []);

  // Fonction pour trier les données selon un champ et une direction
  const sortData = useCallback((data, sortField, sortDirection = 'asc') => {
    if (!data || !sortField) {
      return data;
    }

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Gestion des dates
      if (typeof aValue === 'string' && (aValue.includes('-') || aValue.includes('/'))) {
        try {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } catch (e) {
          // Si échec de conversion en date, continuer avec les valeurs originales
        }
      }
      
      // Comparaison selon le type
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime() 
          : bValue.getTime() - aValue.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue || 0) - (bValue || 0) 
          : (bValue || 0) - (aValue || 0);
      }
    });
  }, []);

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Fonction pour réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Fonction pour mettre à jour le tri
  const updateSorting = useCallback((field, direction = 'asc') => {
    setSorting({ field, direction });
  }, []);

  // Fonction pour récupérer les données d'activité avec filtrage et tri
  const getActivityData = useCallback(async (options = { days: 14, forceRefresh: false }) => {
    const cacheKey = generateCacheKey('activity', options);
    
    if (!options.forceRefresh && cacheRef.current.activity.has(cacheKey) && !isCacheStale('activity')) {
      return cacheRef.current.activity.get(cacheKey);
    }
    
    const setActivityLoading = (isLoading) => {
      setLoadingStates(prev => ({ ...prev, activity: isLoading }));
    };
    
    try {
      const rawData = await handleApiRequest(
        () => dashboardApi.getActivityData(options.days),
        'activity',
        setActivityLoading,
        options
      );
      
      if (!rawData) return null;
      
      // Appliquer les filtres
      let result = filterData(rawData, filters);
      
      // Appliquer le tri
      if (sorting.field) {
        result = sortData(result, sorting.field, sorting.direction);
      }
      
      // Mettre en cache le résultat filtré et trié
      cacheRef.current.activity.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'activité:', error);
      return null;
    }
  }, [generateCacheKey, isCacheStale, handleApiRequest, filters, sorting, filterData, sortData]);

  // Fonction pour récupérer les données de performance avec filtrage et tri
  const getPerformanceData = useCallback(async (options = { period: 'week', forceRefresh: false }) => {
    const cacheKey = generateCacheKey('performance', options);
    
    if (!options.forceRefresh && cacheRef.current.performance.has(cacheKey) && !isCacheStale('performance')) {
      return cacheRef.current.performance.get(cacheKey);
    }
    
    const setPerformanceLoading = (isLoading) => {
      setLoadingStates(prev => ({ ...prev, performance: isLoading }));
    };
    
    try {
      const rawData = await handleApiRequest(
        () => dashboardApi.getPerformanceData(options.period),
        'performance',
        setPerformanceLoading,
        options
      );
      
      if (!rawData) return null;
      
      // Appliquer les filtres
      let result = filterData(rawData, filters);
      
      // Appliquer le tri
      if (sorting.field) {
        result = sortData(result, sorting.field, sorting.direction);
      }
      
      // Mettre en cache le résultat filtré et trié
      cacheRef.current.performance.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de performance:', error);
      return null;
    }
  }, [generateCacheKey, isCacheStale, handleApiRequest, filters, sorting, filterData, sortData]);

  // Fonction pour récupérer les statistiques des tâches
  const getTaskStats = useCallback(async (options = { forceRefresh: false }) => {
    const cacheKey = 'stats';
    
    if (!options.forceRefresh && cacheRef.current[cacheKey] && !isCacheStale(cacheKey)) {
      return cacheRef.current[cacheKey].data;
    }
    
    const setStatsLoading = (isLoading) => {
      setLoadingStates(prev => ({ ...prev, stats: isLoading }));
    };
    
    try {
      const data = await handleApiRequest(
        () => dashboardApi.getTaskStats(),
        cacheKey,
        setStatsLoading,
        options
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }, [isCacheStale, handleApiRequest]);

  // Fonction pour récupérer le résumé des tâches
  const getTaskSummary = useCallback(async (options = { forceRefresh: false }) => {
    const cacheKey = 'summary';
    
    if (!options.forceRefresh && cacheRef.current[cacheKey] && !isCacheStale(cacheKey)) {
      return cacheRef.current[cacheKey].data;
    }
    
    const setSummaryLoading = (isLoading) => {
      setLoadingStates(prev => ({ ...prev, summary: isLoading }));
    };
    
    try {
      const data = await handleApiRequest(
        () => dashboardApi.getTaskSummary(),
        cacheKey,
        setSummaryLoading,
        options
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé:', error);
      return null;
    }
  }, [isCacheStale, handleApiRequest]);

  // Fonction pour récupérer la distribution des tâches
  const getTaskDistribution = useCallback(async (options = { forceRefresh: false }) => {
    const cacheKey = 'taskDistribution';
    
    if (!options.forceRefresh && cacheRef.current[cacheKey] && !isCacheStale(cacheKey)) {
      return cacheRef.current[cacheKey].data;
    }
    
    const setDistributionLoading = (isLoading) => {
      setLoadingStates(prev => ({ ...prev, taskDistribution: isLoading }));
    };
    
    try {
      const data = await handleApiRequest(
        () => dashboardApi.getTaskDistribution(),
        cacheKey,
        setDistributionLoading,
        options
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la distribution:', error);
      return null;
    }
  }, [isCacheStale, handleApiRequest]);

  // Fonction pour récupérer les activités récentes
  const getRecentActivity = useCallback(async (options = { limit: 10, forceRefresh: false }) => {
    const cacheKey = generateCacheKey('recentActivity', options);
    
    if (!options.forceRefresh && cacheRef.current.recentActivity.has(cacheKey) && !isCacheStale('recentActivity')) {
      return cacheRef.current.recentActivity.get(cacheKey);
    }
    
    const setRecentActivityLoading = (isLoading) => {
      setLoadingStates(prev => ({ ...prev, recentActivity: isLoading }));
    };
    
    try {
      const rawData = await handleApiRequest(
        () => dashboardApi.getRecentActivity(options.limit),
        'recentActivity',
        setRecentActivityLoading,
        options
      );
      
      if (!rawData) return null;
      
      // Appliquer les filtres
      let result = filterData(rawData, filters);
      
      // Appliquer le tri
      if (sorting.field) {
        result = sortData(result, sorting.field, sorting.direction);
      }
      
      // Mettre en cache le résultat filtré et trié
      cacheRef.current.recentActivity.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des activités récentes:', error);
      return null;
    }
  }, [generateCacheKey, isCacheStale, handleApiRequest, filters, sorting, filterData, sortData]);

  // Fonction pour récupérer les performances de l'équipe
  const getTeamPerformance = useCallback(async (options = { forceRefresh: false }) => {
    const cacheKey = generateCacheKey('teamPerformance', options);
    
    if (!options.forceRefresh && cacheRef.current.teamPerformance.has(cacheKey) && !isCacheStale('teamPerformance')) {
      return cacheRef.current.teamPerformance.get(cacheKey);
    }
    
    const setTeamPerformanceLoading = (isLoading) => {
      setLoadingStates(prev => ({ ...prev, teamPerformance: isLoading }));
    };
    
    try {
      const rawData = await handleApiRequest(
        () => dashboardApi.getTeamPerformance(),
        'teamPerformance',
        setTeamPerformanceLoading,
        options
      );
      
      if (!rawData) return null;
      
      // Appliquer les filtres
      let result = filterData(rawData, filters);
      
      // Appliquer le tri
      if (sorting.field) {
        result = sortData(result, sorting.field, sorting.direction);
      }
      
      // Mettre en cache le résultat filtré et trié
      cacheRef.current.teamPerformance.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des performances de l\'équipe:', error);
      return null;
    }
  }, [generateCacheKey, isCacheStale, handleApiRequest, filters, sorting, filterData, sortData]);

  // Fonction pour forcer un rafraîchissement de toutes les données
  const refreshAllData = useCallback(async () => {
    // Invalider toutes les entrées du cache
    cacheRef.current = {
      activity: new Map(),
      performance: new Map(),
      recentActivity: new Map(),
      teamPerformance: new Map(),
      stats: null,
      summary: null,
      taskDistribution: null,
      lastUpdated: null,
      expiryTimes: {}
    };
    
    // Charger toutes les données en parallèle
    return Promise.all([
      getTaskStats({ forceRefresh: true }),
      getTaskSummary({ forceRefresh: true }),
      getTaskDistribution({ forceRefresh: true }),
      getActivityData({ forceRefresh: true }),
      getPerformanceData({ forceRefresh: true }),
      getRecentActivity({ forceRefresh: true }),
      getTeamPerformance({ forceRefresh: true })
    ]);
  }, [
    getTaskStats, 
    getTaskSummary, 
    getTaskDistribution, 
    getActivityData, 
    getPerformanceData, 
    getRecentActivity, 
    getTeamPerformance
  ]);

  // Fonction pour vider le cache
  const clearCache = useCallback(() => {
    cacheRef.current = {
      activity: new Map(),
      performance: new Map(),
      recentActivity: new Map(),
      teamPerformance: new Map(),
      stats: null,
      summary: null,
      taskDistribution: null,
      lastUpdated: null,
      expiryTimes: {}
    };
  }, []);

  // Fonction pour réessayer après une erreur
  const retryAfterError = useCallback((dataType) => {
    switch (dataType) {
      case 'activity':
        return getActivityData({ forceRefresh: true });
      case 'performance':
        return getPerformanceData({ forceRefresh: true });
      case 'recentActivity':
        return getRecentActivity({ forceRefresh: true });
      case 'teamPerformance':
        return getTeamPerformance({ forceRefresh: true });
      case 'stats':
        return getTaskStats({ forceRefresh: true });
      case 'summary':
        return getTaskSummary({ forceRefresh: true });
      case 'taskDistribution':
        return getTaskDistribution({ forceRefresh: true });
      default:
        return null;
    }
  }, [
    getActivityData,
    getPerformanceData,
    getRecentActivity,
    getTeamPerformance,
    getTaskStats,
    getTaskSummary,
    getTaskDistribution
  ]);

  // Exposer les données et fonctions
  return {
    // Données
    loadingStates,
    errors,
    filters,
    sorting,
    
    // Fonctions de filtrage et tri
    updateFilters,
    resetFilters,
    updateSorting,
    
    // Fonctions de récupération de données
    getActivityData,
    getPerformanceData,
    getTaskStats,
    getTaskSummary,
    getTaskDistribution,
    getRecentActivity,
    getTeamPerformance,
    
    // Fonctions utilitaires
    refreshAllData,
    clearCache,
    retryAfterError
  };
};

export default useDashboardData;