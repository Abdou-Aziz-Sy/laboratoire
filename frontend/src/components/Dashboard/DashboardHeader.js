// --- fichier: frontend/src/components/Dashboard/DashboardHeader.js ---
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardHeader.module.css';

const DashboardHeader = ({ toggleSidebar, sidebarCollapsed, isMobile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Nombre fictif de notifications (à remplacer par données réelles)
  const notificationsCount = 3;
  
  // Toggle du menu profil
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  // Toggle des notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Bouton de toggle pour la sidebar */}
        <button 
          className={styles.sidebarToggle} 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <div className={`${styles.hamburger} ${sidebarCollapsed ? '' : styles.active}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Logo de l'application */}
        <div className={styles.logoContainer}>
          <Link to="/dashboard" className={styles.logo}>
            <span className={styles.logoText}>Task<span className={styles.highlight}>Handler</span></span>
          </Link>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Bouton de notifications avec indicateur */}
        <div className={styles.notificationContainer}>
          <button 
            className={styles.notificationButton} 
            onClick={toggleNotifications}
            aria-label="Notifications"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
            </svg>
            {notificationsCount > 0 && (
              <span className={styles.notificationBadge}>{notificationsCount}</span>
            )}
          </button>
          
          {/* Menu déroulant des notifications */}
          {showNotifications && (
            <div className={styles.notificationsDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Notifications</h3>
                <button className={styles.clearButton}>Tout marquer comme lu</button>
              </div>
              <div className={styles.notificationList}>
                <div className={styles.notificationItem}>
                  <div className={styles.notificationIcon}></div>
                  <div className={styles.notificationContent}>
                    <p>Nouvelle tâche assignée : "Mettre à jour la documentation"</p>
                    <span className={styles.notificationTime}>Il y a 20 minutes</span>
                  </div>
                </div>
                <div className={styles.notificationItem}>
                  <div className={styles.notificationIcon}></div>
                  <div className={styles.notificationContent}>
                    <p>Un commentaire a été ajouté à "Refonte de l'interface"</p>
                    <span className={styles.notificationTime}>Il y a 1 heure</span>
                  </div>
                </div>
                <div className={styles.notificationItem}>
                  <div className={styles.notificationIcon}></div>
                  <div className={styles.notificationContent}>
                    <p>Réunion d'équipe prévue pour demain à 10h</p>
                    <span className={styles.notificationTime}>Il y a 3 heures</span>
                  </div>
                </div>
              </div>
              <div className={styles.notificationFooter}>
                <Link to="/notifications" className={styles.viewAllLink}>
                  Voir toutes les notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Menu de profil utilisateur */}
        <div className={styles.profileContainer}>
          <button 
            className={styles.profileButton} 
            onClick={toggleProfileMenu}
            aria-label="User profile"
          >
            <div className={styles.profileAvatar}>
              <span>JD</span>
            </div>
          </button>
          
          {/* Menu déroulant du profil */}
          {showProfileMenu && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  <span>JD</span>
                </div>
                <div className={styles.profileInfo}>
                  <h4>John Doe</h4>
                  <p>john.doe@example.com</p>
                </div>
              </div>
              <div className={styles.profileMenu}>
                <Link to="/profile" className={styles.profileMenuItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                  </svg>
                  <span>Mon Profil</span>
                </Link>
                <Link to="/settings" className={styles.profileMenuItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.78 5.35L14.42 2.81C14.39 2.57 14.18 2.4 13.94 2.4H10.06C9.82 2.4 9.62 2.57 9.59 2.81L9.23 5.35C8.65 5.59 8.12 5.91 7.63 6.29L5.24 5.33C5.02 5.26 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.07 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.82 11.69 4.82 12C4.82 12.31 4.84 12.64 4.89 12.94L2.86 14.52C2.66 14.66 2.62 14.93 2.74 15.13L4.65 18.45C4.77 18.67 5.02 18.74 5.24 18.67L7.63 17.71C8.13 18.09 8.65 18.41 9.23 18.65L9.59 21.19C9.62 21.43 9.82 21.6 10.06 21.6H13.94C14.18 21.6 14.39 21.43 14.42 21.19L14.78 18.65C15.36 18.41 15.89 18.09 16.38 17.71L18.77 18.67C18.99 18.74 19.24 18.67 19.36 18.45L21.28 15.13C21.39 14.91 21.34 14.66 21.16 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
                  </svg>
                  <span>Paramètres</span>
                </Link>
                <div className={styles.divider}></div>
                <button className={styles.profileMenuItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                  </svg>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
