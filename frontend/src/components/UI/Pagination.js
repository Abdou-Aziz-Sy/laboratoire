// --- fichier: frontend/src/components/ui/Pagination.js ---
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Composant de contrôles de pagination pour les listes de données
 * Respecte le thème moderne avec fond dégradé sombre et accents orange
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange = null,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showPageInfo = true
}) => {
  // Calculer les pages à afficher dans la pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si leur nombre est inférieur à la limite
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sinon, créer une pagination dynamique avec ellipsis
      const leftSide = Math.floor(maxVisiblePages / 2);
      const rightSide = maxVisiblePages - leftSide;
      
      // Si la page courante est proche du début
      if (currentPage <= leftSide) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } 
      // Si la page courante est proche de la fin
      else if (currentPage > totalPages - rightSide) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } 
      // Si la page courante est au milieu
      else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Gérer le changement de page
  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Gérer le changement de taille de page
  const handlePageSizeChange = (e) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(e.target.value));
    }
  };

  // Calculer les informations sur les éléments affichés
  const getItemsInfo = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return `${start}-${end} sur ${totalItems}`;
  };

  return (
    <PaginationContainer>
      {showPageInfo && totalItems > 0 && (
        <PageInfo>
          <span>Affichage {getItemsInfo()}</span>
          {showPageSizeSelector && onPageSizeChange && (
            <PageSizeSelector>
              <span>Éléments par page:</span>
              <Select value={pageSize} onChange={handlePageSizeChange}>
                {pageSizeOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </PageSizeSelector>
          )}
        </PageInfo>
      )}

      {totalPages > 1 && (
        <PageControls>
          <PageButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
            aria-label="Page précédente"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PageButton>

          <PagesContainer>
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
              ) : (
                <PageNumber
                  key={`page-${page}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  active={page === currentPage}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </PageNumber>
              )
            ))}
          </PagesContainer>

          <PageButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
            aria-label="Page suivante"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </PageButton>
        </PageControls>
      )}
    </PaginationContainer>
  );
};

// Styled components
const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  color: white;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const PageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Select = styled.select`
  background: rgba(30, 30, 40, 0.7);
  border: 1px solid rgba(253, 126, 20, 0.3);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  padding-right: 28px;
  
  &:focus {
    outline: none;
    border-color: rgba(253, 126, 20, 0.6);
    box-shadow: 0 0 0 2px rgba(253, 126, 20, 0.2);
  }
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PageButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 4px;
  background: rgba(30, 30, 40, 0.7);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: rgba(40, 40, 50, 0.9);
  }
`;

const PagesContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const PageNumber = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 4px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(253, 126, 20, 0.8), rgba(253, 126, 20, 0.6))' 
    : 'rgba(30, 30, 40, 0.7)'};
  color: white;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.active ? '0 0 10px rgba(253, 126, 20, 0.4)' : 'none'};
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, rgba(253, 126, 20, 0.9), rgba(253, 126, 20, 0.7))' 
      : 'rgba(40, 40, 50, 0.9)'};
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: white;
  opacity: 0.7;
`;

export default Pagination;
