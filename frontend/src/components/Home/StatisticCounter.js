// --- fichier: frontend/src/components/Home/StatisticCounter.js ---
import React, { useState, useEffect, useRef } from 'react';
import styles from './StatisticCounter.module.css';

const StatisticCounter = ({ value, suffix = '', label, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const startTimestampRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  
  // Utiliser Intersection Observer pour déclencher l'animation au scroll
  useEffect(() => {
    const options = {
      threshold: 0.5,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);
  
  const startAnimation = () => {
    // Animation avec requestAnimationFrame pour une meilleure performance
    const step = (timestamp) => {
      if (!startTimestampRef.current) startTimestampRef.current = timestamp;
      const progress = Math.min((timestamp - startTimestampRef.current) / duration, 1);
      
      // Courbe d'accélération-décélération pour une animation plus naturelle
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      setCount(Math.floor(easedProgress * value));
      
      if (progress < 1) {
        animationFrameIdRef.current = requestAnimationFrame(step);
      } else {
        setCount(value); // Assurer que la valeur finale est exacte
      }
    };
    
    animationFrameIdRef.current = requestAnimationFrame(step);
  };
  
  // Formater le nombre avec des séparateurs de milliers
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  return (
    <div className={styles.statisticItem} ref={counterRef}>
      <span className={styles.statValue}>
        {formatNumber(count)}{suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

export default StatisticCounter;