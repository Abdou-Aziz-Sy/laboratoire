// --- fichier: frontend/src/components/common/Navbar.js ---
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { getAuthToken } from '../../api/authService';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    // Écouter les changements d'authentification (si vous avez un système d'événements)
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  // Mettre à jour le style de la navbar au défilement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer la navigation mobile lors du changement de page
  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <Link to="/" className={styles.logo}>
            TaskHandler
          </Link>
        </div>

        <button 
          className={`${styles.menuToggle} ${isNavOpen ? styles.active : ''}`} 
          onClick={toggleNav}
          aria-label="Menu principal"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.navMenu} ${isNavOpen ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
                Accueil
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/features" className={location.pathname === '/features' ? styles.active : ''}>
                Fonctionnalités
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/pricing" className={location.pathname === '/pricing' ? styles.active : ''}>
                Tarifs
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
                Contact
              </Link>
            </li>
          </ul>

          <div className={styles.navAuth}>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={styles.navButton}>
                  Tableau de bord
                </Link>
                <Link to="/profile" className={styles.navLink}>
                  Profil
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.navLink}>
                  Connexion
                </Link>
                <Link to="/register" className={`${styles.navButton} ${styles.signUp}`}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;