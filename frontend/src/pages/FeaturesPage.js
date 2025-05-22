// --- fichier: frontend/src/pages/FeaturesPage.js ---
import React, { useEffect, useRef } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WaveBackground from '../components/Home/WaveBackground';
import { Button } from '../components/common/Button';
import styles from './FeaturesPage.module.css';

const FeaturesPage = () => {
  // Référence pour les animations au scroll
  const featuresRef = useRef(null);
  const secondaryFeaturesRef = useRef(null);
  
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
    
    // Observer les éléments animés
    const animatedElements = document.querySelectorAll(`.${styles.featureGroup}`);
    animatedElements.forEach(el => observer.observe(el));
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    if (secondaryFeaturesRef.current) {
      observer.observe(secondaryFeaturesRef.current);
    }
    
    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
      if (secondaryFeaturesRef.current) {
        observer.unobserve(secondaryFeaturesRef.current);
      }
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Données des fonctionnalités principales
  const mainFeatures = [
    {
      id: 1,
      icon: 'dashboard',
      title: 'Tableau de bord intuitif',
      description: 'Visualisez toutes vos tâches et projets en un coup d\'œil grâce à notre interface claire et personnalisable.',
      color: 'blue'
    },
    {
      id: 2,
      icon: 'project',
      title: 'Gestion de projets avancée',
      description: 'Organisez vos projets avec des jalons, des échéances et des dépendances. Suivez la progression en temps réel.',
      color: 'purple'
    },
    {
      id: 3,
      icon: 'team',
      title: 'Collaboration d\'équipe',
      description: 'Travaillez efficacement avec votre équipe grâce au partage de tâches, aux commentaires et aux notifications en temps réel.',
      color: 'orange'
    }
  ];

  // Données des fonctionnalités secondaires
  const secondaryFeatures = [
    {
      id: 1,
      icon: 'calendar',
      title: 'Planification intelligente',
      description: 'Planifiez vos tâches avec notre calendrier interactif qui s\'adapte à votre charge de travail et vos priorités.'
    },
    {
      id: 2,
      icon: 'automation',
      title: 'Automatisation des tâches',
      description: 'Gagnez du temps en automatisant les tâches répétitives et les flux de travail récurrents.'
    },
    {
      id: 3,
      icon: 'analytics',
      title: 'Analyses et rapports',
      description: 'Obtenez des insights précieux sur votre productivité et celle de votre équipe avec nos outils d\'analyse avancés.'
    },
    {
      id: 4,
      icon: 'integration',
      title: 'Intégrations multiples',
      description: 'Connectez TaskHandler à vos outils préférés pour un flux de travail sans interruption.'
    },
    {
      id: 5,
      icon: 'mobile',
      title: 'Applications mobiles',
      description: 'Restez productif où que vous soyez grâce à nos applications mobiles pour iOS et Android.'
    },
    {
      id: 6,
      icon: 'security',
      title: 'Sécurité renforcée',
      description: 'Vos données sont protégées par un chiffrement de bout en bout et des contrôles d\'accès granulaires.'
    }
  ];

  return (
    <div className={styles.featuresContainer}>
      {/* Background animé */}
      <div className={styles.backgroundWrapper}>
        <WaveBackground />
      </div>
      
      <Navbar />
      
      <main className={styles.mainContent}>
        {/* En-tête de la page */}
        <header className={styles.featuresHeader}>
          <h1 className={styles.title}>Fonctionnalités puissantes et intuitives</h1>
          <p className={styles.subtitle}>
            Découvrez comment TaskHandler peut transformer votre productivité et celle de votre équipe
          </p>
        </header>
        
        {/* Section des fonctionnalités principales */}
        <section className={styles.mainFeaturesSection} ref={featuresRef}>
          <div className={styles.container}>
            {mainFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                className={`${styles.featureGroup} ${index % 2 !== 0 ? styles.reversed : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={styles.featureContent}>
                  <div className={styles.featureIcon}>
                    <i className={`${styles.icon} ${styles[`icon${feature.icon}`]}`}></i>
                  </div>
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                  <Button 
                    variant="highlight"
                    size="medium"
                    className={styles.featureButton}
                  >
                    En savoir plus
                  </Button>
                </div>
                <div className={styles.featureVisualWrapper}>
                  <div className={`${styles.featureVisual} ${styles[`visual${feature.color}`]}`}>
                    <div className={styles.visualIcon}>
                      <i className={`${styles.icon} ${styles[`icon${feature.icon}`]}`}></i>
                    </div>
                    <div className={styles.visualElements}>
                      <div className={`${styles.visualElement} ${styles.element1}`}></div>
                      <div className={`${styles.visualElement} ${styles.element2}`}></div>
                      <div className={`${styles.visualElement} ${styles.element3}`}></div>
                      <div className={`${styles.visualElement} ${styles.element4}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Section des fonctionnalités secondaires */}
        <section className={styles.secondaryFeaturesSection} ref={secondaryFeaturesRef}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Plus de fonctionnalités exceptionnelles</h2>
            <div className={styles.featureGrid}>
              {secondaryFeatures.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className={styles.featureCard}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={styles.featureCardIcon}>
                    <i className={`${styles.icon} ${styles[`icon${feature.icon}`]}`}></i>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Section d'appel à l'action */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2>Prêt à transformer votre manière de travailler ?</h2>
              <p>Essayez TaskHandler gratuitement pendant 14 jours et découvrez comment nous pouvons améliorer votre productivité.</p>
              <div className={styles.ctaButtons}>
                <Button 
                  variant="primary" 
                  size="large"
                  className={styles.ctaButton}
                >
                  Commencer gratuitement
                </Button>
                <Button 
                  variant="secondary" 
                  size="large"
                  className={styles.ctaButton}
                >
                  Voir la démo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FeaturesPage;
