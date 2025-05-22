// --- fichier: frontend/src/components/Dashboard/Widgets/NotificationsWidget.js ---
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiEye, FiTrash2, FiX, FiCheck, FiAlertCircle, FiInfo, FiCalendar } from 'react-icons/fi';
import styles from './NotificationsWidget.module.css';

// Données simulées
const mockNotifications = [
  {
    id: 1,
    type: 'info',
    title: 'Mise à jour du système',
    message: 'Une nouvelle version du système sera déployée ce soir à 22h.',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: 2,
    type: 'alert',
    title: 'Tâche en retard',
    message: 'La tâche "Mise à jour documentation API" est en retard de 2 jours.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false
  },
  {
    id: 3,
    type: 'success',
    title: 'Tâche complétée',
    message: 'La tâche "Configuration serveur prod" a été marquée comme terminée.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true
  },
  {
    id: 4,
    type: 'event',
    title: 'Réunion à venir',
    message: 'Rappel: Réunion d\'équipe demain à 10h00.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: true
  },
  {
    id: 5,
    type: 'info',
    title: 'Nouveau membre',
    message: 'Marie Dupont a rejoint votre équipe.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false
  },
  {
    id: 6,
    type: 'alert',
    title: 'Problème de serveur',
    message: 'Le serveur de développement est actuellement instable.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day and 2 hours ago
    read: true
  }
];

const NotificationsWidget = ({ isLoading = false, limit = 5 }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showRead, setShowRead] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Filtrer les notifications selon l'état lu/non lu
  const filteredNotifications = notifications.filter(notification => {
    if (showRead) return true;
    return !notification.read;
  }).slice(0, limit);
  
  // Nombre de notifications non lues
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Supprimer une notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Supprimer toutes les notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowConfirmClear(false);
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
  
  // Icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <FiInfo />;
      case 'alert':
        return <FiAlertCircle />;
      case 'success':
        return <FiCheck />;
      case 'event':
        return <FiCalendar />;
      default:
        return <FiBell />;
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
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 10,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.div 
      className={styles.widget}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>
          Notifications
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </h2>
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={() => setShowRead(!showRead)}
            aria-label={showRead ? "Montrer non lues" : "Montrer toutes"}
            title={showRead ? "Montrer non lues" : "Montrer toutes"}
          >
            <FiEye />
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setShowConfirmClear(true)}
            aria-label="Effacer tout"
            title="Effacer tout"
            disabled={notifications.length === 0}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Chargement des notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiBell size={40} />
            </div>
            <p>Aucune notification</p>
            <span>Vous êtes à jour !</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiCheck size={40} />
            </div>
            <p>Aucune notification non lue</p>
            <button 
              className={styles.showAllButton}
              onClick={() => setShowRead(true)}
            >
              Afficher toutes les notifications
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.ul className={styles.notificationsList}>
              {filteredNotifications.map((notification) => (
                <motion.li 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${notification.read ? styles.read : ''} ${styles[notification.type]}`}
                  variants={itemVariants}
                  layout
                >
                  <div className={styles.notificationIconContainer}>
                    <div className={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <h3 className={styles.notificationTitle}>{notification.title}</h3>
                      <span className={styles.notificationTime}>
                        {formatTimeAgo(notification.time)}
                      </span>
                    </div>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                  </div>
                  
                  <div className={styles.notificationActions}>
                    {!notification.read && (
                      <button 
                        className={styles.notificationAction}
                        onClick={() => markAsRead(notification.id)}
                        aria-label="Marquer comme lu"
                        title="Marquer comme lu"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button 
                      className={styles.notificationAction}
                      onClick={() => deleteNotification(notification.id)}
                      aria-label="Supprimer"
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className={styles.footer}>
          <button 
            className={styles.markAllButton}
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            Tout marquer comme lu
          </button>
          
          <button 
            className={styles.viewAllButton}
            onClick={() => setShowRead(!showRead)}
          >
            {showRead ? 'Masquer lues' : 'Voir toutes'}
          </button>
        </div>
      )}
      
      {/* Confirmation de suppression */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div 
            className={styles.confirmOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.confirmDialog}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button 
                className={styles.closeButton}
                onClick={() => setShowConfirmClear(false)}
              >
                <FiX />
              </button>
              
              <div className={styles.confirmIcon}>
                <FiAlertCircle size={40} />
              </div>
              
              <h3 className={styles.confirmTitle}>Effacer toutes les notifications ?</h3>
              <p className={styles.confirmText}>
                Cette action ne peut pas être annulée.
              </p>
              
              <div className={styles.confirmActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowConfirmClear(false)}
                >
                  Annuler
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={clearAllNotifications}
                >
                  Effacer tout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationsWidget;
