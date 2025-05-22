// --- fichier: frontend/src/components/Dashboard/DashboardLayout.js ---
import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Gestion de la réactivité
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Si on passe en mobile, collapse automatiquement la sidebar
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // Gestion du toggle de la sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Panneau semi-transparent avec effet de flou */}
      <div className={styles.glassPanel}>
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
        />
        
        <div className={styles.mainSection}>
          <DashboardSidebar 
            collapsed={sidebarCollapsed} 
            isMobile={isMobile}
          />
          
          <DashboardContent 
            sidebarCollapsed={sidebarCollapsed}
          >
            {children}
          </DashboardContent>
        </div>
      </div>
      
      {/* Effet de fond animé */}
      <div className={styles.backgroundEffect}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.gridPattern}></div>
        <div className={styles.particles}>
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className={`${styles.particle} ${styles[`particle${index + 1}`]}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
