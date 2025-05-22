// --- fichier: frontend/src/context/DashboardContext.js ---
import React, { createContext, useState, useContext, useEffect, useCallback, useReducer } from 'react';
import dashboardApi from '../api/dashboard';

// Contexte pour le dashboard
const DashboardContext = createContext(null);

// Valeurs par défaut pour les préférences utilisateur
const defaultUserPreferences = {
  refreshInterval: 300000, // 5 minutes en ms
  activePeriod: 'week',
  favoriteWidgets: ['taskProgress', 'activityTimeline', 'recentActivity'],
  widgetLayout: 'grid', // 'grid' ou 'list'
  theme: 'dark', // 'dark' ou 'light'
  autoRefresh: true,
  chartType: 'area', // 'area', 'line', 'bar'
};

// Clé pour le stockage des préférences dans localStorage
const PREFS_STORAGE_KEY = 'taskhandler_dashboard_prefs';

// Reducer pour la gestion des données du dashboard
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_STATS':
      return { ...state, stats: action.payload, isLoading: false, error: null };
    case 'SET_ACTIVITY':
      return { ...state, activity: action.payload, isLoading: false, error: null };
    case 'SET_PERFORMANCE':
      return { ...state, performance: action.payload, isLoading: false, error: null };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload, isLoading: false, error: null };
    case 'SET_RECENT_ACTIVITY':
      return { ...state, recentActivity: action.payload, isLoading: false, error: null };
    case 'SET_TASK_DISTRIBUTION':
      return { ...state, taskDistribution: action.payload, isLoading: false, error: null };
    case 'SET_TEAM_PERFORMANCE':
      return { ...state, teamPerformance: action.payload, isLoading: false, error: null };
    case 'RESET_DATA':
      return {
        ...state,
        stats: null,
        activity: null,
        performance: null,
        summary: null,
        recentActivity: null,
        taskDistribution: null,
        teamPerformance: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

// État initial du dashboard
const initialDashboardState = {
  stats: null,
  activity: null,
  performance: null,
  summary: null,
  recentActivity: null,
  taskDistribution: null,
  teamPerformance: null,
  isLoading: false,
  error: null,
};

export const DashboardProvider = ({ children }) => {
  // Réduire pour gérer les données
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  
  // État pour les préférences utilisateur
  const [userPreferences, setUserPreferences] = useState(() => {
    // Récupérer les préférences depuis localStorage lors de l'initialisation
    const storedPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
    return storedPrefs ? JSON.parse(storedPrefs) : defaultUserPreferences;
  });
  
  // État pour suivre la dernière mise à jour
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Référence pour le timer de rafraîchissement
  const refreshTimerRef = React.useRef(null);

  // Sauvegarder les préférences dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Fonction pour mettre à jour les préférences utilisateur
  const updatePreferences = useCallback((newPrefs) => {
    setUserPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      return updated;
    });
  }, []);

  // Gérer le rafraîchissement automatique
  useEffect(() => {
    // Nettoyer le timer précédent si existant
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    // Configurer un nouveau timer si l'auto-refresh est activé
    if (userPreferences.autoRefresh) {
      refreshTimerRef.current = setInterval(() => {
        loadAllDashboardData();
      }, userPreferences.refreshInterval);
    }

    // Nettoyer à la désinstallation
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [userPreferences.autoRefresh, userPreferences.refreshInterval]);

  // Fonction pour charger les statistiques des tâches
  const loadTaskStats = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await dashboardApi.getTaskStats();
      dispatch({ type: 'SET_STATS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, []);

  // Fonction pour charger les données d'activité
  const loadActivityData = useCallback(async (days = 14) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await dashboardApi.getActivityData(days);
      dispatch({ type: 'SET_ACTIVITY', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, []);

  // Fonction pour charger les données de performance
  const loadPerformanceData = useCallback(async (period = userPreferences.activePeriod) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await dashboardApi.getPerformanceData(period);
      dispatch({ type: 'SET_PERFORMANCE', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, [userPreferences.activePeriod]);

  // Fonction pour charger le résumé des tâches
  const loadTaskSummary = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await dashboardApi.getTaskSummary();
      dispatch({ type: 'SET_SUMMARY', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, []);

  // Fonction pour charger les activités récentes
  const loadRecentActivity = useCallback(async (limit = 10) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await dashboardApi.getRecentActivity(limit);
      dispatch({ type: 'SET_RECENT_ACTIVITY', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, []);

  // Fonction pour charger la distribution des tâches
  const loadTaskDistribution = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await dashboardApi.getTaskDistribution();
      dispatch({ type: 'SET_TASK_DISTRIBUTION', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, []);

  // Fonction pour charger les performances de l'équipe
  const loadTeamPerformance = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await dashboardApi.getTeamPerformance();
      dispatch({ type: 'SET_TEAM_PERFORMANCE', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  }, []);

  // Fonction pour charger toutes les données du dashboard
  const loadAllDashboardData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Indicateur pour suivre si des erreurs se sont produites
    let hasErrors = false;
    let errorMessage = '';
    
    try {
      // Charger en parallèle pour optimiser les performances
      const promises = [
        dashboardApi.getTaskStats(),
        dashboardApi.getActivityData(),
        dashboardApi.getPerformanceData(userPreferences.activePeriod),
        dashboardApi.getTaskSummary(),
        dashboardApi.getRecentActivity(),
        dashboardApi.getTaskDistribution(),
        dashboardApi.getTeamPerformance()
      ];
      
      const results = await Promise.allSettled(promises);
      
      // Traiter les résultats
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          switch (index) {
            case 0: dispatch({ type: 'SET_STATS', payload: result.value }); break;
            case 1: dispatch({ type: 'SET_ACTIVITY', payload: result.value }); break;
            case 2: dispatch({ type: 'SET_PERFORMANCE', payload: result.value }); break;
            case 3: dispatch({ type: 'SET_SUMMARY', payload: result.value }); break;
            case 4: dispatch({ type: 'SET_RECENT_ACTIVITY', payload: result.value }); break;
            case 5: dispatch({ type: 'SET_TASK_DISTRIBUTION', payload: result.value }); break;
            case 6: dispatch({ type: 'SET_TEAM_PERFORMANCE', payload: result.value }); break;
          }
        } else {
          hasErrors = true;
          errorMessage += `${result.reason.message}. `;
        }
      });
      
      // Mettre à jour l'horodatage de la dernière mise à jour
      setLastUpdated(new Date());
      
      // Si des erreurs se sont produites, les signaler
      if (hasErrors) {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      
      return !hasErrors;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, [userPreferences.activePeriod]);

  // Fonction pour forcer le rafraîchissement manuel
  const refreshDashboard = useCallback(() => {
    return loadAllDashboardData();
  }, [loadAllDashboardData]);

  // Fonction pour réinitialiser les données du dashboard
  const resetDashboard = useCallback(() => {
    dispatch({ type: 'RESET_DATA' });
  }, []);

  // Charger les données au montage initial
  useEffect(() => {
    loadAllDashboardData();
  }, [loadAllDashboardData]);

  // Valeur du contexte à fournir
  const value = {
    // État des données
    ...state,
    lastUpdated,
    
    // Préférences utilisateur
    userPreferences,
    updatePreferences,
    
    // Fonctions de chargement de données
    loadTaskStats,
    loadActivityData,
    loadPerformanceData,
    loadTaskSummary,
    loadRecentActivity,
    loadTaskDistribution,
    loadTeamPerformance,
    loadAllDashboardData,
    
    // Fonctions utilitaires
    refreshDashboard,
    resetDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook personnalisé pour consommer le contexte
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (context === null) {
    throw new Error('useDashboard doit être utilisé à l\'intérieur d\'un DashboardProvider');
  }
  
  return context;
};
