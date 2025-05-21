// --- fichier: frontend/src/components/Home/HeroSection.js ---
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';
import WaveBackground from './WaveBackground';

const HeroSection = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Animation du titre avec effet de machine à écrire
    const titleElement = titleRef.current;
    const subtitleElement = subtitleRef.current;
    
    if (titleElement && subtitleElement) {
      // Classe pour déclencher l'animation
      setTimeout(() => {
        titleElement.classList.add(styles.animate);
      }, 300);
      
      // Animation séquentielle pour le sous-titre
      setTimeout(() => {
        subtitleElement.classList.add(styles.animate);
      }, 1200);
    }
    
    // Animation de scroll au clic sur l'indicateur
    const scrollIndicator = document.querySelector(`.${styles.scrollIndicator}`);
    scrollIndicator?.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
    
    return () => {
      scrollIndicator?.removeEventListener('click', () => {});
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      <WaveBackground />
      
      <div className={styles.heroContent}>
        <h1 ref={titleRef} className={styles.heroTitle}>
          <span className={styles.titleLine}>Gérez vos tâches</span>
          <span className={styles.titleLine}>comme <span className={styles.highlight}>jamais</span> auparavant</span>
        </h1>
        
        <p ref={subtitleRef} className={styles.heroSubtitle}>
          TaskHandler simplifie l'organisation de vos projets en vous offrant 
          une solution complète pour suivre, prioriser et accomplir vos tâches.
        </p>
        
        <div className={styles.heroCta}>
          <Link to="/register" className={styles.primaryButton}>
            <span className={styles.buttonContent}>Commencer gratuitement</span>
            <span className={styles.buttonIcon}></span>
          </Link>
          
          <Link to="/features" className={styles.secondaryButton}>
            <span className={styles.buttonContent}>Découvrir les fonctionnalités</span>
          </Link>
        </div>
        
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>10k+</span>
            <span className={styles.statLabel}>Utilisateurs</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>1M+</span>
            <span className={styles.statLabel}>Tâches gérées</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>99%</span>
            <span className={styles.statLabel}>Satisfaction</span>
          </div>
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  );
};

export default HeroSection;