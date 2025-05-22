// --- fichier: frontend/src/components/Dashboard/DashboardContent.js ---
import React from 'react';
import styles from './DashboardContent.module.css';

const DashboardContent = ({ children, sidebarCollapsed }) => {
  return (
    <main className={`${styles.content} ${sidebarCollapsed ? styles.expanded : ''}`}>
      <div className={styles.contentInner}>
        {/* Contenu principal */}
        <div className={styles.contentWrapper}>
          {children || (
            <div className={styles.placeholderContent}>
              <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>
                  Bienvenue sur votre tableau de bord
                  <span className={styles.highlightDot}></span>
                </h1>
                <p className={styles.welcomeText}>
                  Gérez vos tâches, suivez votre progression et optimisez votre productivité
                  avec TaskHandler.
                </p>
              </div>
              
              {/* Grille de widgets par défaut */}
              <div className={styles.widgetsGrid}>
                <div className={`${styles.widget} ${styles.widgetLarge}`}>
                  <div className={styles.widgetHeader}>
                    <h3 className={styles.widgetTitle}>Vue d'ensemble</h3>
                    <div className={styles.widgetActions}>
                      <button className={styles.widgetAction}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.widgetContent}>
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>12</span>
                        <span className={styles.statLabel}>Tâches en cours</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>5</span>
                        <span className={styles.statLabel}>Tâches en retard</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>8</span>
                        <span className={styles.statLabel}>Tâches complétées</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statValue}>3</span>
                        <span className={styles.statLabel}>Projets actifs</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.widget}>
                  <div className={styles.widgetHeader}>
                    <h3 className={styles.widgetTitle}>Tâches récentes</h3>
                    <div className={styles.widgetActions}>
                      <button className={styles.widgetAction}>Voir tout</button>
                    </div>
                  </div>
                  <div className={styles.widgetContent}>
                    <div className={styles.tasksList}>
                      <div className={styles.taskItem}>
                        <div className={styles.taskStatus}></div>
                        <div className={styles.taskInfo}>
                          <h4 className={styles.taskTitle}>Mise à jour documentation</h4>
                          <span className={styles.taskDue}>Échéance: Aujourd'hui</span>
                        </div>
                        <div className={styles.taskPriority}>Haute</div>
                      </div>
                      
                      <div className={styles.taskItem}>
                        <div className={`${styles.taskStatus} ${styles.completed}`}></div>
                        <div className={styles.taskInfo}>
                          <h4 className={styles.taskTitle}>Réunion d'équipe hebdomadaire</h4>
                          <span className={styles.taskDue}>Terminée</span>
                        </div>
                        <div className={styles.taskPriority}>Moyenne</div>
                      </div>
                      
                      <div className={styles.taskItem}>
                        <div className={styles.taskStatus}></div>
                        <div className={styles.taskInfo}>
                          <h4 className={styles.taskTitle}>Revue de code du sprint</h4>
                          <span className={styles.taskDue}>Échéance: Demain</span>
                        </div>
                        <div className={styles.taskPriority}>Moyenne</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.widget}>
                  <div className={styles.widgetHeader}>
                    <h3 className={styles.widgetTitle}>Activité récente</h3>
                    <div className={styles.widgetActions}>
                      <button className={styles.widgetAction}>Rafraîchir</button>
                    </div>
                  </div>
                  <div className={styles.widgetContent}>
                    <div className={styles.activityList}>
                      <div className={styles.activityItem}>
                        <div className={styles.activityIcon}></div>
                        <div className={styles.activityContent}>
                          <p className={styles.activityText}>
                            <strong>Sophie Dubois</strong> a commenté sur la tâche <strong>"Refonte de l'interface"</strong>
                          </p>
                          <span className={styles.activityTime}>Il y a 10 minutes</span>
                        </div>
                      </div>
                      
                      <div className={styles.activityItem}>
                        <div className={styles.activityIcon}></div>
                        <div className={styles.activityContent}>
                          <p className={styles.activityText}>
                            <strong>Marc Lefèvre</strong> a complété la tâche <strong>"Mise en place des tests unitaires"</strong>
                          </p>
                          <span className={styles.activityTime}>Il y a 45 minutes</span>
                        </div>
                      </div>
                      
                      <div className={styles.activityItem}>
                        <div className={styles.activityIcon}></div>
                        <div className={styles.activityContent}>
                          <p className={styles.activityText}>
                            <strong>Julie Moreau</strong> a créé un nouveau projet <strong>"Lancement mobile"</strong>
                          </p>
                          <span className={styles.activityTime}>Il y a 2 heures</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.widget}>
                  <div className={styles.widgetHeader}>
                    <h3 className={styles.widgetTitle}>Événements à venir</h3>
                    <div className={styles.widgetActions}>
                      <button className={styles.widgetAction}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.widgetContent}>
                    <div className={styles.eventsList}>
                      <div className={styles.eventItem}>
                        <div className={styles.eventDate}>
                          <span className={styles.eventDay}>25</span>
                          <span className={styles.eventMonth}>Mai</span>
                        </div>
                        <div className={styles.eventInfo}>
                          <h4 className={styles.eventTitle}>Réunion d'équipe</h4>
                          <span className={styles.eventTime}>10:00 - 11:30</span>
                        </div>
                      </div>
                      
                      <div className={styles.eventItem}>
                        <div className={styles.eventDate}>
                          <span className={styles.eventDay}>28</span>
                          <span className={styles.eventMonth}>Mai</span>
                        </div>
                        <div className={styles.eventInfo}>
                          <h4 className={styles.eventTitle}>Présentation client</h4>
                          <span className={styles.eventTime}>14:00 - 15:30</span>
                        </div>
                      </div>
                      
                      <div className={styles.eventItem}>
                        <div className={styles.eventDate}>
                          <span className={styles.eventDay}>01</span>
                          <span className={styles.eventMonth}>Juin</span>
                        </div>
                        <div className={styles.eventInfo}>
                          <h4 className={styles.eventTitle}>Début du sprint 7</h4>
                          <span className={styles.eventTime}>09:00 - 10:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
