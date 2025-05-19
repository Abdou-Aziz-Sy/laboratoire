// --- fichier: frontend/src/components/Home/FeaturesSection.js ---
import React, { useEffect, useRef } from 'react';
import styles from './FeaturesSection.module.css';
import FeatureCard from './FeatureCard';
import StatisticCounter from './StatisticCounter';

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  
  // Observer pour les animations au scroll
  useEffect(() => {
    const options = {
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    }, options);
    
    // Observer le conteneur principal
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    // Observer chaque carte de fonctionnalité
    const cards = document.querySelectorAll(`.${styles.featureCard}`);
    cards.forEach(card => observer.observe(card));
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <section className={styles.featuresSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pourquoi TaskHandler?</h2>
          <p className={styles.sectionSubtitle}>
            Une solution complète pour gérer tous vos projets et tâches avec simplicité et efficacité
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          <FeatureCard 
            iconClass={styles.iconOrganize}
            title="Organisation intuitive"
            description="Structurez vos tâches avec une interface intuitive. Créez des projets, des listes et des sous-tâches avec facilité."
            delay={0}
          />
          
          <FeatureCard 
            iconClass={styles.iconCollaboration}
            title="Collaboration d'équipe"
            description="Partagez vos projets, assignez des tâches et collaborez en temps réel avec votre équipe."
            delay={200}
          />
          
          <FeatureCard 
            iconClass={styles.iconAutomation}
            title="Automatisation avancée"
            description="Automatisez les tâches répétitives, programmez des rappels et gagnez en productivité."
            delay={400}
          />
          
          <FeatureCard 
            iconClass={styles.iconAnalytics}
            title="Suivi et analyses"
            description="Visualisez votre progression avec des graphiques interactifs et des tableaux de bord personnalisés."
            delay={600}
          />
        </div>
        
        <div className={styles.statisticsContainer}>
          <div className={styles.statisticsCard}>
            <div className={styles.statisticsHeader}>
              <h3>TaskHandler en chiffres</h3>
              <p>Des milliers d'utilisateurs nous font confiance chaque jour</p>
            </div>
            
            <div className={styles.statisticsList}>
              <StatisticCounter 
                value={25000} 
                suffix="+" 
                label="Utilisateurs actifs" 
                duration={2000}
              />
              
              <div className={styles.statsLine}></div>
              
              <StatisticCounter 
                value={1500000} 
                suffix="+" 
                label="Tâches complétées" 
                duration={2500}
              />
              
              <div className={styles.statsLine}></div>
              
              <StatisticCounter 
                value={98} 
                suffix="%" 
                label="Satisfaction client" 
                duration={1500}
              />
              
              <div className={styles.statsLine}></div>
              
              <StatisticCounter 
                value={42} 
                suffix="%" 
                label="Productivité améliorée" 
                duration={1800}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;