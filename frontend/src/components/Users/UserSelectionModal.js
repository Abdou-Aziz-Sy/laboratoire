import React, { useState, useEffect, useRef } from 'react';
import UserAvatar from './UserAvatar';
import { searchUsers } from '../../api/userService';
import styles from './UserSelectionModal.module.css';

/**
 * Modal pour rechercher et su00e9lectionner des utilisateurs u00e0 assigner u00e0 une tu00e2che
 * @param {boolean} show - Indique si le modal doit u00eatre affichu00e9
 * @param {Function} onClose - Fonction appelu00e9e pour fermer le modal
 * @param {Array} selectedUsers - Liste des utilisateurs du00e9ju00e0 su00e9lectionnu00e9s
 * @param {Function} onSelectUsers - Fonction appelu00e9e avec la liste des utilisateurs su00e9lectionnu00e9s
 * @param {Array} excludeUsers - Liste des IDs d'utilisateurs u00e0 exclure des ru00e9sultats
 */
const UserSelectionModal = ({ 
  show, 
  onClose, 
  selectedUsers = [], 
  onSelectUsers,
  excludeUsers = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState([...selectedUsers]);
  
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus sur le champ de recherche u00e0 l'ouverture du modal
  useEffect(() => {
    if (show && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [show]);

  // Initialise la su00e9lection avec les utilisateurs du00e9ju00e0 su00e9lectionnu00e9s
  useEffect(() => {
    setSelection([...selectedUsers]);
  }, [selectedUsers]);

  // Ferme le modal si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  // Effectue la recherche des utilisateurs
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchUsers(searchTerm);
      
      // Filtre les utilisateurs exclus
      const filteredResults = Array.isArray(results) 
        ? results.filter(user => !excludeUsers.includes(user.id))
        : [];
        
      setSearchResults(filteredResults);
    } catch (err) {
      setError('Erreur lors de la recherche des utilisateurs');
      console.error('Erreur de recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  // Gu00e8re la saisie dans le champ de recherche
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lance la recherche quand on appuie sur Entu00e9e
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Gu00e8re la su00e9lection/du00e9su00e9lection d'un utilisateur
  const toggleUserSelection = (user) => {
    const isSelected = selection.some(u => u.id === user.id);
    
    if (isSelected) {
      setSelection(selection.filter(u => u.id !== user.id));
    } else {
      setSelection([...selection, user]);
    }
  };

  // Confirme la su00e9lection et ferme le modal
  const handleConfirm = () => {
    onSelectUsers(selection);
    onClose();
  };

  // Si le modal n'est pas visible, ne rien afficher
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        {/* Effet de vagues en arriu00e8re-plan */}
        <div className={styles.backgroundEffect}>
          <div className={styles.wave1}></div>
          <div className={styles.wave2}></div>
        </div>

        <h2 className={styles.modalTitle}>Su00e9lectionner des assignu00e9s</h2>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            ref={searchInputRef}
          />
          <button 
            className={styles.searchButton} 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loader}></span>
            ) : (
              'Rechercher'
            )}
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <ul className={styles.userList}>
              {searchResults.map(user => {
                const isSelected = selection.some(u => u.id === user.id);
                return (
                  <li 
                    key={user.id} 
                    className={`${styles.userItem} ${isSelected ? styles.selected : ''}`}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <UserAvatar user={user} size="medium" />
                    <div className={styles.selectionIndicator}></div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={styles.noResults}>
              {searchTerm && !loading 
                ? 'Aucun utilisateur trouvé' 
                : 'Utilisez la recherche pour trouver des utilisateurs'}
            </div>
          )}
        </div>

        {selection.length > 0 && (
          <div className={styles.selectionSummary}>
            <h3>Utilisateurs sélectionnés ({selection.length})</h3>
            <div className={styles.selectedUsers}>
              {selection.map(user => (
                <div key={user.id} className={styles.selectedUserItem}>
                  <UserAvatar user={user} size="small" showName={true} />
                  <button 
                    className={styles.removeButton}
                    onClick={() => toggleUserSelection(user)}
                    aria-label={`Retirer ${user.name}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Annuler
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={handleConfirm}
            disabled={loading}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionModal;
