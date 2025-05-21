// frontend/src/components/Tasks/TaskFilters.js
import React, { useState, useEffect } from 'react';
import styles from './TaskFilters.module.css';

const TaskFilters = ({ filters, onFilterChange, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Mettre à jour les filtres locaux lorsque les props changent
  useEffect(() => {
    setLocalFilters(filters);
    setHasChanges(false);
  }, [filters]);
  
  // Options pour les statuts
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'A_FAIRE', label: 'À faire' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'TERMINEE', label: 'Terminée' }
  ];
  
  // Options pour les priorités
  const priorityOptions = [
    { value: '', label: 'Toutes les priorités' },
    { value: 'BASSE', label: 'Basse' },
    { value: 'MOYENNE', label: 'Moyenne' },
    { value: 'HAUTE', label: 'Haute' },
    { value: 'URGENTE', label: 'Urgente' }
  ];
  
  // Mise à jour des filtres locaux
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };
  
  // Application des filtres
  const handleApplyFilters = (e) => {
    e && e.preventDefault();
    
    // Vérifier si des changements ont été effectués
    if (hasChanges) {
      onFilterChange(localFilters);
      setHasChanges(false);
    }
  };
  
  // Recherche rapide (s'applique immédiatement)
  const handleQuickSearch = () => {
    if (hasChanges) {
      onFilterChange(localFilters);
      setHasChanges(false);
    }
  };
  
  // Réinitialisation des filtres
  const handleResetFilters = () => {
    // Réinitialiser les filtres locaux
    const resetFilters = {
      status: '',
      priorite: '',
      dateDebut: '',
      dateFin: '',
      searchText: ''
    };
    setLocalFilters(resetFilters);
    setHasChanges(false);
    
    // Appliquer la réinitialisation
    onResetFilters();
  };
  
  // Vérifier si des filtres avancés sont actifs
  const hasAdvancedFilters = 
    localFilters.status || 
    localFilters.priorite || 
    localFilters.dateDebut || 
    localFilters.dateFin;
  
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.basicSearch}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            name="searchText"
            value={localFilters.searchText}
            onChange={handleInputChange}
            placeholder="Rechercher une tâche..."
            className={styles.searchInput}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
          />
          <button 
            className={styles.searchButton}
            onClick={handleQuickSearch}
            disabled={!hasChanges}
          >
            🔍
          </button>
        </div>
        
        <div className={styles.filterIndicators}>
          {hasAdvancedFilters && (
            <div className={styles.filterBadge} title="Filtres actifs">
              <span className={styles.filterBadgeIcon}>🔍</span>
              <span className={styles.filterBadgeText}>Filtres actifs</span>
            </div>
          )}
          
          <button 
            className={`${styles.expandButton} ${hasAdvancedFilters ? styles.activeExpandButton : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Moins de filtres ▲' : 'Plus de filtres ▼'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <form className={styles.advancedFilters} onSubmit={handleApplyFilters}>
          <div className={styles.filtersGrid}>
            {/* Filtre par statut */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Statut</label>
              <select
                name="status"
                value={localFilters.status}
                onChange={handleInputChange}
                className={styles.filterSelect}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtre par priorité */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Priorité</label>
              <select
                name="priorite"
                value={localFilters.priorite}
                onChange={handleInputChange}
                className={styles.filterSelect}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtre par date de début */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Date début</label>
              <input
                type="date"
                name="dateDebut"
                value={localFilters.dateDebut}
                onChange={handleInputChange}
                className={styles.filterInput}
              />
            </div>
            
            {/* Filtre par date de fin */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Date fin</label>
              <input
                type="date"
                name="dateFin"
                value={localFilters.dateFin}
                onChange={handleInputChange}
                className={styles.filterInput}
                min={localFilters.dateDebut || ''}
              />
            </div>
          </div>
          
          <div className={styles.filterActions}>
            <button 
              type="submit" 
              className={styles.applyButton}
              disabled={!hasChanges}
            >
              Appliquer les filtres
            </button>
            
            <button 
              type="button" 
              className={styles.resetButton}
              onClick={handleResetFilters}
              disabled={!Object.values(localFilters).some(v => v)}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskFilters;