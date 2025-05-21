// --- fichier: frontend/src/components/Home/FeatureCard.js ---
import React, { useEffect, useRef } from 'react';
import styles from './FeaturesSection.module.css';

const FeatureCard = ({ iconClass, title, description, delay = 0 }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    // Ajouter une transition retardée pour l'effet d'apparition en cascade
    if (cardRef.current) {
      cardRef.current.style.transitionDelay = `${delay}ms`;
    }
  }, [delay]);
  
  return (
    <div className={styles.featureCard} ref={cardRef}>
      <div className={iconClass}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
};

export default FeatureCard;