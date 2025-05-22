// --- fichier: frontend/src/components/Dashboard/DashboardSidebar.js ---
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './DashboardSidebar.module.css';

const DashboardSidebar = ({ collapsed, isMobile }) => {
  // Liste des liens de navigation
  const navLinks = [
    {
      to: '/dashboard',
      label: 'Tableau de bord',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
        </svg>
      ),
      exact: true,
    },
    {
      to: '/tasks',
      label: 'Tâches',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
        </svg>
      ),
    },
    {
      to: '/projects',
      label: 'Projets',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V8H20V18Z" fill="currentColor"/>
        </svg>
      ),
    },
    {
      to: '/calendar',
      label: 'Calendrier',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="currentColor"/>
        </svg>
      ),
    },
    {
      to: '/team',
      label: 'Équipe',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
        </svg>
      ),
    },
    {
      to: '/analytics',
      label: 'Analytiques',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
        </svg>
      ),
    },
    {
      to: '/settings',
      label: 'Paramètres',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.78 5.35L14.42 2.81C14.39 2.57 14.18 2.4 13.94 2.4H10.06C9.82 2.4 9.62 2.57 9.59 2.81L9.23 5.35C8.65 5.59 8.12 5.91 7.63 6.29L5.24 5.33C5.02 5.26 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.07 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.82 11.69 4.82 12C4.82 12.31 4.84 12.64 4.89 12.94L2.86 14.52C2.66 14.66 2.62 14.93 2.74 15.13L4.65 18.45C4.77 18.67 5.02 18.74 5.24 18.67L7.63 17.71C8.13 18.09 8.65 18.41 9.23 18.65L9.59 21.19C9.62 21.43 9.82 21.6 10.06 21.6H13.94C14.18 21.6 14.39 21.43 14.42 21.19L14.78 18.65C15.36 18.41 15.89 18.09 16.38 17.71L18.77 18.67C18.99 18.74 19.24 18.67 19.36 18.45L21.28 15.13C21.39 14.91 21.34 14.66 21.16 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
        </svg>
      ),
    },
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {navLinks.map((link, index) => (
            <li key={index} className={styles.navItem}>
              <NavLink 
                to={link.to} 
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                end={link.exact}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                <span className={styles.navLabel}>{link.label}</span>
                
                {/* Indicateur d'élément actif */}
                <span className={styles.activeIndicator}></span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Section inférieure pour la déconnexion */}
      <div className={styles.sidebarFooter}>
        <div className={styles.helpSection}>
          <NavLink to="/help" className={styles.helpLink}>
            <span className={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="currentColor"/>
              </svg>
            </span>
            <span className={styles.navLabel}>Aide & Support</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
