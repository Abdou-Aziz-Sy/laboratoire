// frontend/src/components/Tasks/TaskPagination.js
import React, { useState, useEffect } from 'react';
import styles from './TaskPagination.module.css';

const TaskPagination = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  totalElements, 
  onPageChange, 
  onPageSizeChange 
}) => {
  // Options de taille de page
  const pageSizeOptions = [5, 10, 20, 50];
  
  // État local pour animer le changement de page
  const [animating, setAnimating] = useState(false);
  const [previousPage, setPreviousPage] = useState(currentPage);
  
  // Suivi des changements de page pour les animations
  useEffect(() => {
    if (previousPage !== currentPage) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 300);
      setPreviousPage(currentPage);
      return () => clearTimeout(timer);
    }
  }, [currentPage, previousPage]);
  
  // Calcul des pages à afficher (maximum 5)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    // Si nombre total de pages <= maxPagesToShow, afficher toutes les pages
    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sinon, afficher un sous-ensemble de pages avec la page courante au milieu
      let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
      
      // Ajuster si on est proche de la fin
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(0, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Ajouter des ellipses si nécessaire
      if (startPage > 0) {
        pageNumbers.unshift('first-ellipsis');
        pageNumbers.unshift(0);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('last-ellipsis');
        pageNumbers.push(totalPages - 1);
      }
    }
    
    return pageNumbers;
  };
  
  // Calcul de l'intervalle d'éléments affichés
  const getDisplayedRange = () => {
    if (totalElements === 0) return '0-0 sur 0';
    
    const firstItem = currentPage * pageSize + 1;
    const lastItem = Math.min((currentPage + 1) * pageSize, totalElements);
    return `${firstItem}-${lastItem} sur ${totalElements}`;
  };
  
  // Fonction pour aller directement à une page spécifique
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const input = e.target.elements.pageNumber;
    const pageNumber = parseInt(input.value, 10) - 1; // -1 car l'index commence à 0
    
    if (!isNaN(pageNumber) && pageNumber >= 0 && pageNumber < totalPages) {
      onPageChange(pageNumber);
      input.value = '';
    }
  };
  
  return (
    <div className={`${styles.paginationContainer} ${animating ? styles.animating : ''}`}>
      <div className={styles.paginationInfo}>
        <span className={styles.displayedRange}>
          Affichage : {getDisplayedRange()}
        </span>
        
        <div className={styles.pageSizeSelector}>
          <label htmlFor="page-size" className={styles.pageSizeLabel}>
            Tâches par page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.paginationControls}>
        {/* Bouton première page */}
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0 || totalPages === 0}
          className={`${styles.pageButton} ${styles.navButton}`}
          title="Première page"
          aria-label="Aller à la première page"
        >
          <span className={styles.navButtonIcon}>&#8676;</span>
        </button>
        
        {/* Bouton page précédente */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || totalPages === 0}
          className={`${styles.pageButton} ${styles.navButton}`}
          title="Page précédente"
          aria-label="Aller à la page précédente"
        >
          <span>&#9664;</span>
        </button>
        
        {/* Pages numérotées */}
        <div className={styles.pageNumbersContainer}>
          {getPageNumbers().map((page, index) => {
            if (page === 'first-ellipsis' || page === 'last-ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  ${styles.pageButton}
                  ${currentPage === page ? styles.activePage : ''}
                `}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`Page ${page + 1}`}
              >
                {page + 1}
              </button>
            );
          })}
        </div>
        
        {/* Bouton page suivante */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          className={`${styles.pageButton} ${styles.navButton}`}
          title="Page suivante"
          aria-label="Aller à la page suivante"
        >
          <span>&#9654;</span>
        </button>
        
        {/* Bouton dernière page */}
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          className={`${styles.pageButton} ${styles.navButton}`}
          title="Dernière page"
          aria-label="Aller à la dernière page"
        >
          <span className={styles.navButtonIcon}>&#8677;</span>
        </button>
      </div>
      
      {/* Formulaire pour sauter directement à une page */}
      {totalPages > 5 && (
        <form onSubmit={handleJumpToPage} className={styles.jumpToPageForm}>
          <label htmlFor="pageNumber" className={styles.jumpToPageLabel}>
            Aller à la page:
          </label>
          <input 
            type="number" 
            id="pageNumber" 
            name="pageNumber" 
            min="1" 
            max={totalPages} 
            className={styles.jumpToPageInput} 
            aria-label="Numéro de page"
          />
          <button 
            type="submit" 
            className={styles.jumpToPageButton}
            aria-label="Aller à la page spécifiée"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskPagination;