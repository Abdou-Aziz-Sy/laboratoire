// --- fichier: frontend/src/components/Dashboard/Widgets/StatCard.js ---
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './StatCard.module.css';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  color = 'default',
  isLoading = false 
}) => {
  const [counter, setCounter] = useState(0);
  
  // Animation du compteur
  useEffect(() => {
    if (isLoading) return;
    
    let start = 0;
    const end = parseInt(value);
    
    // Durée de l'animation plus courte pour les petites valeurs
    const duration = Math.min(2000, Math.max(1000, end * 50));
    
    // Pas pour l'animation (minimum 1)
    const step = Math.max(1, Math.floor(end / 30));
    
    if (start === end) return;
    
    let timer = setInterval(() => {
      start += step;
      if (start > end) {
        setCounter(end);
        clearInterval(timer);
      } else {
        setCounter(start);
      }
    }, duration / (end / step));
    
    return () => clearInterval(timer);
  }, [value, isLoading]);
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.4 }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <motion.div 
      className={`${styles.statCard} ${styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingPulse}></div>
        </div>
      ) : (
        <>
          <motion.div 
            className={styles.iconContainer}
            variants={iconVariants}
          >
            {icon}
          </motion.div>
          
          <motion.div 
            className={styles.contentContainer}
            variants={contentVariants}
          >
            <motion.h3 
              className={styles.title}
              variants={itemVariants}
            >
              {title}
            </motion.h3>
            
            <motion.div 
              className={styles.valueContainer}
              variants={itemVariants}
            >
              <span className={styles.value}>{counter}</span>
              
              {change && (
                <div className={`${styles.change} ${styles[changeType]}`}>
                  <span className={styles.changeValue}>{change > 0 ? '+' : ''}{change}%</span>
                </div>
              )}
            </motion.div>
          </motion.div>
          
          <div className={styles.highlight}></div>
        </>
      )}
    </motion.div>
  );
};

export default StatCard;
