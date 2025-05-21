// --- fichier: frontend/src/components/Home/HowItWorksSection.js ---
import React, { useEffect, useRef } from 'react';
import styles from './HowItWorksSection.module.css';

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const timelineItemsRef = useRef([]);
  
  // Ajouter des éléments à la référence
  const addToRefs = (el) => {
    if (el && !timelineItemsRef.current.includes(el)) {
      timelineItemsRef.current.push(el);
    }
  };
  
  useEffect(() => {
    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    }, options);
    
    // Observer chaque élément de la timeline
    timelineItemsRef.current.forEach(item => observer.observe(item));
    
    return () => {
      timelineItemsRef.current.forEach(item => observer.unobserve(item));
    };
  }, []);
  
  return (
    <section className={styles.howItWorksSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Comment ça marche</h2>
          <p className={styles.sectionSubtitle}>
            Découvrez en 4 étapes simples comment TaskHandler peut transformer votre gestion de tâches
          </p>
        </div>
        
        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine}></div>
          
          <div className={styles.timelineItem} ref={addToRefs}>
            <div className={styles.timelineNumber}>1</div>
            <div className={styles.timelineContent}>
              <h3>Créez votre compte</h3>
              <p>Inscrivez-vous en quelques secondes et configurez votre profil personnel ou professionnel.</p>
              <div className={styles.timelineIconWrapper}>
                <div className={`${styles.timelineIcon} ${styles.iconRegister}`}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.timelineItem} ref={addToRefs}>
            <div className={styles.timelineNumber}>2</div>
            <div className={styles.timelineContent}>
              <h3>Créez votre premier projet</h3>
              <p>Organisez votre travail en projets avec des listes personnalisées pour chaque aspect de votre vie.</p>
              <div className={styles.timelineIconWrapper}>
                <div className={`${styles.timelineIcon} ${styles.iconProject}`}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.timelineItem} ref={addToRefs}>
            <div className={styles.timelineNumber}>3</div>
            <div className={styles.timelineContent}>
              <h3>Ajoutez et organisez vos tâches</h3>
              <p>Créez des tâches avec descriptions, dates d'échéance, priorités et tags pour une organisation optimale.</p>
              <div className={styles.timelineIconWrapper}>
                <div className={`${styles.timelineIcon} ${styles.iconTasks}`}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.timelineItem} ref={addToRefs}>
            <div className={styles.timelineNumber}>4</div>
            <div className={styles.timelineContent}>
              <h3>Suivez votre progression</h3>
              <p>Visualisez vos accomplissements avec des tableaux de bord interactifs et célébrez vos succès.</p>
              <div className={styles.timelineIconWrapper}>
                <div className={`${styles.timelineIcon} ${styles.iconProgress}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;