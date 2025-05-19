// --- fichier: frontend/src/components/Home/CtaSection.js ---
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './CtaSection.module.css';

const CtaSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  
  useEffect(() => {
    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          
          // Animation séquentielle des éléments internes
          if (entry.target === sectionRef.current) {
            if (titleRef.current) {
              setTimeout(() => {
                titleRef.current.classList.add(styles.visible);
              }, 300);
            }
            
            if (subtitleRef.current) {
              setTimeout(() => {
                subtitleRef.current.classList.add(styles.visible);
              }, 500);
            }
            
            if (ctaRef.current) {
              setTimeout(() => {
                ctaRef.current.classList.add(styles.visible);
              }, 700);
            }
          }
        }
      });
    }, options);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section className={styles.ctaSection} ref={sectionRef}>
      <div className={styles.ctaBackground}>
        <div className={styles.shapesContainer}>
          <div className={`${styles.shape} ${styles.shape1}`}></div>
          <div className={`${styles.shape} ${styles.shape2}`}></div>
          <div className={`${styles.shape} ${styles.shape3}`}></div>
          <div className={`${styles.shape} ${styles.shape4}`}></div>
          <div className={`${styles.shape} ${styles.shape5}`}></div>
        </div>
      </div>
      
      <div className={styles.ctaContainer}>
        <h2 className={styles.ctaTitle} ref={titleRef}>
          Prêt à transformer votre gestion de tâches ?
        </h2>
        
        <p className={styles.ctaSubtitle} ref={subtitleRef}>
          Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur productivité avec TaskHandler.
          <br />Commencez gratuitement dès aujourd'hui !
        </p>
        
        <div className={styles.ctaButtons} ref={ctaRef}>
          <Link to="/register" className={styles.primaryButton}>
            Créer un compte gratuit
          </Link>
          
          <div className={styles.orDivider}>
            <span>ou</span>
          </div>
          
          <Link to="/contact" className={styles.secondaryButton}>
            Demander une démo
          </Link>
        </div>
        
        <div className={styles.ctaFeatures}>
          <div className={styles.ctaFeatureItem}>
            <div className={styles.featureIcon}></div>
            <span>Configuration en 2 minutes</span>
          </div>
          
          <div className={styles.ctaFeatureItem}>
            <div className={styles.featureIcon}></div>
            <span>Pas de carte de crédit</span>
          </div>
          
          <div className={styles.ctaFeatureItem}>
            <div className={styles.featureIcon}></div>
            <span>Annulation à tout moment</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;