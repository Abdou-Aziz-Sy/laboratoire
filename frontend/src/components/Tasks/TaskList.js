// frontend/src/components/Tasks/TaskList.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTasks } from '../../api/taskService';
import TaskItem from './TaskItem';
import TaskFilters from './TaskFilters';
import TaskPagination from './TaskPagination';
import { 
  loadFiltersFromSession, 
  saveFiltersToSession, 
  filtersToQueryString, 
  queryStringToFilters,
  formatApiQueryParams
} from '../../utils/filterUtils';
import styles from './TaskList.module.css';

const TaskList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Initialisation des filtres depuis l'URL ou sessionStorage
  const initialFilters = location.search 
    ? queryStringToFilters(searchParams)
    : loadFiltersFromSession();
  
  // États pour stocker les données et les états UI
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  
  // Séparer les filtres de tri et pagination pour plus de clarté
  const { page, size, sort } = filters;
  // Extraction du champ et de la direction de tri
  const [sortField, sortDirection] = sort?.split(',') || ['dateCreation', 'desc'];
  
  // Définition des colonnes triables
  const sortableColumns = [
    { field: 'titre', label: 'Titre' },
    { field: 'priorite', label: 'Priorité' },
    { field: 'status', label: 'Statut' },
    { field: 'dateEcheance', label: 'Échéance' },
    { field: 'dateCreation', label: 'Date de création' },
    { field: 'dateMaj', label: 'Dernière modification' }
  ];
  
  // État pour la pagination
  const [pagination, setPagination] = useState({
    page,
    size,
    totalElements: 0,
    totalPages: 0
  });

  // Mettre à jour l'URL lorsque les filtres changent
  useEffect(() => {
    // Sauvegarde en session
    saveFiltersToSession(filters);
    
    // Mise à jour de l'URL
    const queryString = filtersToQueryString(filters);
    navigate(`${location.pathname}?${queryString}`, { replace: true });
    
    // Appel à l'API avec les nouveaux filtres
    fetchTasks();
  }, [filters]);

  // Fonction pour récupérer les tâches depuis l'API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Formater les paramètres pour l'API
      const queryParams = formatApiQueryParams(filters);
      
      // Appel à l'API
      const response = await getTasks(queryParams);
      
      // Mise à jour des états
      setTasks(response.content || []);
      setPagination({
        page: response.number || 0,
        size: response.size || 10,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      });
      
      // Si la page est vide (sauf page 0) et qu'il y a des éléments, revenir à la première page
      if (response.content?.length === 0 && filters.page > 0 && response.totalElements > 0) {
        setFilters(prev => ({
          ...prev,
          page: 0
        }));
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des tâches:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer le changement de tri
  const handleSort = (field) => {
    // Vérifier si on clique sur la même colonne pour alterner entre asc et desc
    let newDirection = 'asc'; // Direction par défaut
    
    if (field === sortField) {
      // Si c'est la même colonne, inverser la direction
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si c'est une nouvelle colonne, commencer par asc (sauf pour les dates)
      newDirection = field.startsWith('date') ? 'desc' : 'asc';
    }
    
    // Mettre à jour les filtres
    setFilters(prev => ({
      ...prev,
      sort: `${field},${newDirection}`,
      page: 0 // Retour à la première page lors du changement de tri
    }));
  };
  
  // Fonction pour afficher la flèche de tri
  const renderSortIcon = (field) => {
    if (field !== sortField) return null;
    
    return (
      <span className={styles.sortIcon}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  // Fonction pour appliquer les filtres
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0 // Retour à la première page lors du changement de filtres
    }));
  };
  
  // Fonction pour gérer le changement de page
  const handlePageChange = (newPage) => {
    // Vérifier que la page est valide
    if (newPage < 0 || newPage >= pagination.totalPages) return;
    
    // Mise à jour des filtres avec la nouvelle page
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    
    // Faire défiler vers le haut pour indiquer le changement de page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Fonction pour gérer le changement de taille de page
  const handlePageSizeChange = (newSize) => {
    // Vérifier que la taille est valide
    if (newSize <= 0) return;
    
    // Mise à jour des filtres avec la nouvelle taille et retour à la première page
    setFilters(prev => ({
      ...prev,
      size: newSize,
      page: 0 // Retour à la première page lors du changement de taille
    }));
  };

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = () => {
    const defaultFilterValues = {
      status: '',
      priorite: '',
      dateDebut: '',
      dateFin: '',
      searchText: '',
      page: 0,
      size: 10,
      sort: 'dateEcheance,asc'
    };
    
    setFilters(defaultFilterValues);
  };

  // Filtres spécifiques pour le composant de filtrage
  const filterComponentProps = {
    status: filters.status,
    priorite: filters.priorite,
    dateDebut: filters.dateDebut,
    dateFin: filters.dateFin,
    searchText: filters.searchText
  };

  // Rendu du composant
  return (
    <div className={styles.taskListContainer}>
      {/* Filtres */}
      <TaskFilters 
        filters={filterComponentProps} 
        onFilterChange={handleFilterChange}
        onResetFilters={resetAllFilters}
      />
      
      {/* État de chargement */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des tâches...</p>
        </div>
      )}
      
      {/* Gestion des erreurs */}
      {error && !loading && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>!</div>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            onClick={fetchTasks} 
            className={styles.retryButton}
          >
            Réessayer
          </button>
        </div>
      )}
      
      {/* Affichage des tâches */}
      {!loading && !error && (
        <>
          {tasks.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.taskTable}>
                <thead>
                  <tr>
                    {sortableColumns.slice(0, 4).map(column => (
                      <th 
                        key={column.field}
                        onClick={() => handleSort(column.field)}
                        className={sortField === column.field ? styles.activeSortColumn : ''}
                        title={`Trier par ${column.label}`}
                      >
                        {column.label}
                        {renderSortIcon(column.field)}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onTaskUpdated={fetchTasks}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📋</div>
              <h3>Aucune tâche trouvée</h3>
              <p>Aucune tâche ne correspond à vos critères de recherche.</p>
              {Object.values(filterComponentProps).some(v => v) && (
                <button 
                  onClick={resetAllFilters} 
                  className={styles.resetFiltersButton}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {tasks.length > 0 && (
            <TaskPagination 
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.size}
              totalElements={pagination.totalElements}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;