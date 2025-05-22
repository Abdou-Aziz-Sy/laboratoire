// --- fichier: frontend/src/components/Dashboard/Widgets/PerformanceWidget.js ---
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiClock, FiTarget, FiBarChart2 } from 'react-icons/fi';
import styles from './PerformanceWidget.module.css';

// Données simulées
const mockData = {
  productivityScore: 78,
  completionRate: 85,
  taskEfficiency: 92,
  onTimeDelivery: 73,
  weeklyProgress: [65, 70, 72, 78, 76, 80, 78],
  monthlyComparison: {
    current: 78,
    previous: 72
  }
};

const PerformanceWidget = ({ isLoading = false }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Simuler la fin de l'animation après 2 secondes
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  // Calculer le pourcentage d'amélioration par rapport au mois précédent
  const improvementPercentage = ((mockData.monthlyComparison.current - mockData.monthlyComparison.previous) / mockData.monthlyComparison.previous * 100).toFixed(1);
  
  return (
    <motion.div 
      className={styles.widget}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Performance</h2>
        <div className={styles.period}>
          <span className={styles.activePeriod}>Ce mois</span>
          <span className={styles.separator}>•</span>
          <span>Trimestre</span>
          <span className={styles.separator}>•</span>
          <span>Année</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Chargement des données...</p>
        </div>
      ) : (
        <>
          <div className={styles.overviewSection}>
            <div className={styles.scoreContainer}>
              <div className={styles.scoreRing}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle 
                    cx="70" 
                    cy="70" 
                    r="60" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.1)" 
                    strokeWidth="10"
                  />
                  <motion.circle 
                    cx="70" 
                    cy="70" 
                    r="60" 
                    fill="none" 
                    stroke="rgba(253, 126, 20, 0.7)" 
                    strokeWidth="10" 
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - mockData.productivityScore / 100)}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 60}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 60 * (1 - mockData.productivityScore / 100)}` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className={styles.scoreValue}>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {mockData.productivityScore}
                  </motion.span>
                </div>
                <div className={styles.scoreLabel}>
                  <FiTrendingUp />
                  <span>Score de productivité</span>
                </div>
              </div>
              
              <div className={styles.comparison}>
                <div className={styles.comparisonHeader}>
                  <span>Mois précédent</span>
                  <span className={`${styles.trend} ${improvementPercentage >= 0 ? styles.positive : styles.negative}`}>
                    {improvementPercentage > 0 ? '+' : ''}{improvementPercentage}%
                  </span>
                </div>
                <div className={styles.comparisonBar}>
                  <div className={styles.barContainer}>
                    <motion.div 
                      className={styles.previousBar}
                      initial={{ width: 0 }}
                      animate={{ width: `${mockData.monthlyComparison.previous}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <span className={styles.previousValue}>{mockData.monthlyComparison.previous}</span>
                </div>
                <div className={styles.comparisonBar}>
                  <div className={styles.barContainer}>
                    <motion.div 
                      className={styles.currentBar}
                      initial={{ width: 0 }}
                      animate={{ width: `${mockData.monthlyComparison.current}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <span className={styles.currentValue}>{mockData.monthlyComparison.current}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.metricsSection}>
            <motion.div 
              className={styles.metric}
              variants={itemVariants}
            >
              <div className={styles.metricIcon}>
                <FiBarChart2 />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricValue}>{mockData.completionRate}%</div>
                <div className={styles.metricLabel}>Taux de complétion</div>
              </div>
              <div className={styles.metricProgress}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${mockData.completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.metric}
              variants={itemVariants}
            >
              <div className={styles.metricIcon}>
                <FiTarget />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricValue}>{mockData.taskEfficiency}%</div>
                <div className={styles.metricLabel}>Efficacité des tâches</div>
              </div>
              <div className={styles.metricProgress}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${mockData.taskEfficiency}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.metric}
              variants={itemVariants}
            >
              <div className={styles.metricIcon}>
                <FiClock />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricValue}>{mockData.onTimeDelivery}%</div>
                <div className={styles.metricLabel}>Livraison à temps</div>
              </div>
              <div className={styles.metricProgress}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${mockData.onTimeDelivery}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Progression hebdomadaire</h3>
            </div>
            <div className={styles.chart}>
              {mockData.weeklyProgress.map((value, index) => (
                <div key={index} className={styles.chartColumn}>
                  <div className={styles.chartBar}>
                    <motion.div 
                      className={styles.chartFill}
                      style={{ height: `${value}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <div className={styles.chartLabel}>
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.footer}>
            <div className={`${styles.statusBadge} ${styles.active}`}>
              <span className={styles.statusDot}></span>
              <span>Mise à jour en temps réel</span>
            </div>
            <button className={styles.reportButton}>
              Rapport détaillé
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PerformanceWidget;
