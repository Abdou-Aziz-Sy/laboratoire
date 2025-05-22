// --- fichier: frontend/src/components/Dashboard/Widgets/TaskSummaryWidget.js ---
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiFilter } from 'react-icons/fi';
import styles from './TaskSummaryWidget.module.css';

// Données simulées
const mockData = {
  pending: 12,
  completed: 18,
  overdue: 4,
  efficiency: 74,
  recentTasks: [
    { id: 1, title: 'Mise à jour documentation API', status: 'pending', priority: 'high', dueDate: '2025-05-24', progress: 60 },
    { id: 2, title: 'Correction bugs interface mobile', status: 'pending', priority: 'medium', dueDate: '2025-05-23', progress: 30 },
    { id: 3, title: 'Optimisation requêtes backend', status: 'completed', priority: 'high', dueDate: '2025-05-21', progress: 100 },
    { id: 4, title: 'Implémentation authentification OAuth', status: 'overdue', priority: 'medium', dueDate: '2025-05-20', progress: 75 },
    { id: 5, title: 'Revue design sprint 6', status: 'completed', priority: 'low', dueDate: '2025-05-19', progress: 100 }
  ]
};

const TaskSummaryWidget = ({ isLoading = false }) => {
  const [filter, setFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filtrer les tâches selon le statut sélectionné
  const filteredTasks = mockData.recentTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });
  
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
    },
    exit: { 
      opacity: 0, 
      x: 10,
      transition: { duration: 0.2 }
    }
  };
  
  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
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
        <h2 className={styles.title}>Résumé des tâches</h2>
        <div className={styles.actions}>
          <button 
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Réduire" : "Agrandir"}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingRipple}>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          <motion.div 
            className={styles.statsContainer}
            variants={statsVariants}
          >
            <div className={`${styles.stat} ${styles.pending}`}>
              <FiClock className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{mockData.pending}</span>
                <span className={styles.statLabel}>En attente</span>
              </div>
            </div>
            
            <div className={`${styles.stat} ${styles.completed}`}>
              <FiCheckCircle className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{mockData.completed}</span>
                <span className={styles.statLabel}>Terminées</span>
              </div>
            </div>
            
            <div className={`${styles.stat} ${styles.overdue}`}>
              <FiAlertCircle className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{mockData.overdue}</span>
                <span className={styles.statLabel}>En retard</span>
              </div>
            </div>
            
            <div className={`${styles.stat} ${styles.efficiency}`}>
              <FiTrendingUp className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{mockData.efficiency}%</span>
                <span className={styles.statLabel}>Efficacité</span>
              </div>
            </div>
          </motion.div>
          
          <div className={styles.filterContainer}>
            <div className={styles.filterLabel}>
              <FiFilter size={14} />
              <span>Filtre:</span>
            </div>
            
            <div className={styles.filterOptions}>
              <button 
                className={`${styles.filterOption} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                Toutes
              </button>
              <button 
                className={`${styles.filterOption} ${filter === 'pending' ? styles.active : ''}`}
                onClick={() => setFilter('pending')}
              >
                En attente
              </button>
              <button 
                className={`${styles.filterOption} ${filter === 'completed' ? styles.active : ''}`}
                onClick={() => setFilter('completed')}
              >
                Terminées
              </button>
              <button 
                className={`${styles.filterOption} ${filter === 'overdue' ? styles.active : ''}`}
                onClick={() => setFilter('overdue')}
              >
                En retard
              </button>
            </div>
          </div>
          
          <motion.div 
            className={`${styles.tasksContainer} ${isExpanded ? styles.expanded : ''}`}
            animate={{ height: isExpanded ? 'auto' : '300px' }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {filteredTasks.length > 0 ? (
                <motion.ul 
                  className={styles.tasksList}
                  key="task-list"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {filteredTasks.map(task => (
                    <motion.li 
                      key={task.id} 
                      className={`${styles.taskItem} ${styles[task.status]} ${styles[`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]}`}
                      variants={itemVariants}
                    >
                      <div className={styles.taskHeader}>
                        <h3 className={styles.taskTitle}>{task.title}</h3>
                        <div className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                          {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </div>
                      </div>
                      
                      <div className={styles.taskMeta}>
                        <span className={styles.taskDueDate}>
                          {task.status === 'completed' 
                            ? 'Terminée' 
                            : `Échéance: ${new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
                          }
                        </span>
                        <span className={styles.taskStatus}>
                          {task.status === 'pending' 
                            ? 'En cours' 
                            : task.status === 'completed' 
                              ? 'Terminée' 
                              : 'En retard'
                          }
                        </span>
                      </div>
                      
                      <div className={styles.progressContainer}>
                        <div className={styles.progressTrack}>
                          <motion.div 
                            className={styles.progressBar}
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <span className={styles.progressValue}>{task.progress}%</span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div 
                  className={styles.emptyState}
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={styles.emptyIcon}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p>Aucune tâche trouvée avec ce filtre</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <div className={styles.footer}>
            <button className={styles.viewAllButton}>
              Voir toutes les tâches
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default TaskSummaryWidget;
