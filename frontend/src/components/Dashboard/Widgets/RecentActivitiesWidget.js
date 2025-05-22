// --- fichier: frontend/src/components/Dashboard/Widgets/RecentActivitiesWidget.js ---
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiEdit, FiCheckSquare, FiMessageSquare, FiPlus, FiTrash2, FiLink } from 'react-icons/fi';
import styles from './RecentActivitiesWidget.module.css';

// Données simulées
const mockActivities = [
  {
    id: 1,
    type: 'comment',
    user: {
      name: 'Thomas Martin',
      avatar: null,
      initials: 'TM',
      color: '#4F46E5'
    },
    content: 'a ajouté un commentaire sur',
    target: 'Optimisation des requêtes API',
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    icon: <FiMessageSquare />
  },
  {
    id: 2,
    type: 'completion',
    user: {
      name: 'Sophie Dubois',
      avatar: null,
      initials: 'SD',
      color: '#0EA5E9'
    },
    content: 'a terminé la tâche',
    target: 'Mise à jour documentation technique',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    icon: <FiCheckSquare />
  },
  {
    id: 3,
    type: 'update',
    user: {
      name: 'Marc Lefèvre',
      avatar: null,
      initials: 'ML',
      color: '#F59E0B'
    },
    content: 'a mis à jour',
    target: 'Refonte page d\'authentification',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    icon: <FiEdit />
  },
  {
    id: 4,
    type: 'creation',
    user: {
      name: 'Camille Laurent',
      avatar: null,
      initials: 'CL',
      color: '#10B981'
    },
    content: 'a créé une nouvelle tâche',
    target: 'Implémentation analytics',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    icon: <FiPlus />
  },
  {
    id: 5,
    type: 'deletion',
    user: {
      name: 'Alexandre Durand',
      avatar: null,
      initials: 'AD',
      color: '#EF4444'
    },
    content: 'a supprimé',
    target: 'Test d\'intégration obsolète',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    icon: <FiTrash2 />
  },
  {
    id: 6,
    type: 'link',
    user: {
      name: 'Julie Moreau',
      avatar: null,
      initials: 'JM',
      color: '#8B5CF6'
    },
    content: 'a lié le projet',
    target: 'Application mobile',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    icon: <FiLink />
  }
];

const RecentActivitiesWidget = ({ isLoading = false, limit = 5 }) => {
  const [activities, setActivities] = useState(mockActivities);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simuler un rafraîchissement des données
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      // On pourrait modifier les données ici pour simuler un vrai refresh
      setActivities([...activities]);
      setIsRefreshing(false);
    }, 1500);
  };
  
  // Formater les timestamps
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const refreshIconVariants = {
    initial: { rotate: 0 },
    animate: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: "linear" } }
  };
  
  return (
    <motion.div 
      className={styles.widget}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Activités récentes</h2>
        <div className={styles.actions}>
          <button 
            className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Rafraîchir"
          >
            <motion.div
              variants={refreshIconVariants}
              animate={isRefreshing ? "animate" : "initial"}
            >
              <FiRefreshCw />
            </motion.div>
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Chargement des activités...</p>
          </div>
        ) : activities.length > 0 ? (
          <AnimatePresence>
            <motion.ul className={styles.activityList}>
              {activities.slice(0, limit).map((activity) => (
                <motion.li 
                  key={activity.id} 
                  className={`${styles.activityItem} ${styles[activity.type]}`}
                  variants={itemVariants}
                >
                  <div className={styles.activityTime}>
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                  
                  <div className={styles.activityContent}>
                    <div className={styles.activityIconContainer}>
                      <div className={styles.activityIcon}>
                        {activity.icon}
                      </div>
                      <div className={styles.timelineLine}></div>
                    </div>
                    
                    <div className={styles.activityDetails}>
                      <div className={styles.userInfo}>
                        {activity.user.avatar ? (
                          <img 
                            src={activity.user.avatar} 
                            alt={activity.user.name} 
                            className={styles.userAvatar}
                          />
                        ) : (
                          <div 
                            className={styles.userInitials}
                            style={{ backgroundColor: activity.user.color }}
                          >
                            {activity.user.initials}
                          </div>
                        )}
                        <span className={styles.userName}>{activity.user.name}</span>
                      </div>
                      
                      <div className={styles.activityDescription}>
                        <span className={styles.activityText}>
                          {activity.content}
                        </span>
                        <span className={styles.activityTarget}>
                          {activity.target}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <p>Aucune activité récente</p>
            <span>Les activités de votre équipe apparaîtront ici</span>
          </div>
        )}
      </div>
      
      <div className={styles.footer}>
        <button className={styles.viewAllButton}>
          Voir toutes les activités
        </button>
      </div>
    </motion.div>
  );
};

export default RecentActivitiesWidget;
