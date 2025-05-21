// --- fichier: frontend/src/components/common/ProtectedNavbar.js ---
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './ProtectedNavbar.module.css';

const ProtectedNavbar = () => {
  const { user, logoutContext } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fonction de du00e9connexion
  const handleLogout = () => {
    logoutContext();
    navigate('/login');
  };

  // Du00e9termine si le lien est actif
  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  // Bascule le menu mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo et nom de l'application */}
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>ud83duddd3ufe0f</span>
          <span className={styles.logoText}>TaskHandler</span>
        </Link>

        {/* Bouton du menu mobile */}
        <button 
          className={styles.menuToggle} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.menuIcon}></span>
        </button>

        {/* Liens de navigation */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.menuOpen : ''}`}>
          <Link 
            to="/dashboard" 
            className={`${styles.navLink} ${isActive('/dashboard')}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className={styles.navIcon}>ud83dudcca</span>
            Tableau de bord
          </Link>
          
          <Link 
            to="/tasks" 
            className={`${styles.navLink} ${isActive('/tasks')}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className={styles.navIcon}>ud83dudcc3</span>
            Mes tu00e2ches
          </Link>
          
          <Link 
            to="/create-task" 
            className={`${styles.navLink} ${isActive('/create-task')}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className={styles.navIcon}>u2795</span>
            Cru00e9er une tu00e2che
          </Link>
          
          {/* Dropdown pour le profil utilisateur */}
          <div className={styles.profileDropdown}>
            <button className={styles.profileButton}>
              <span className={styles.profileIcon}>ud83dudc64</span>
              <span className={styles.userName}>{user?.nom || 'Utilisateur'}</span>
              <span className={styles.dropdownArrow}>u25bc</span>
            </button>
            
            <div className={styles.dropdownContent}>
              <Link 
                to="/profile" 
                className={styles.dropdownItem}
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.dropdownIcon}>ud83dudd10</span>
                Mon profil
              </Link>
              
              <button 
                className={styles.dropdownItem} 
                onClick={handleLogout}
              >
                <span className={styles.dropdownIcon}>ud83dudeaa</span>
                Se du00e9connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProtectedNavbar;
