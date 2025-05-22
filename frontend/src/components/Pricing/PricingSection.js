// --- fichier: frontend/src/components/Pricing/PricingSection.js ---
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './PricingSection.module.css';

const PricingSection = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Animation du titre avec effet de fade-in
    const titleElement = titleRef.current;
    const subtitleElement = subtitleRef.current;
    
    if (titleElement && subtitleElement) {
      setTimeout(() => {
        titleElement.classList.add(styles.animate);
      }, 300);
      
      setTimeout(() => {
        subtitleElement.classList.add(styles.animate);
      }, 800);
    }

    // Animation des cartes de tarification
    const cards = cardsRef.current;
    if (cards.length) {
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add(styles.animate);
        }, 1000 + (index * 200));
      });
    }
  }, []);

  // Fonction pour ajouter des références aux cartes
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section className={styles.pricingSection}>
      <div className={styles.pricingContent}>
        <h1 ref={titleRef} className={styles.pricingTitle}>
          <span className={styles.titleLine}>Des forfaits adaptés à</span>
          <span className={styles.titleLine}>tous vos <span className={styles.highlight}>besoins</span></span>
        </h1>
        
        <p ref={subtitleRef} className={styles.pricingSubtitle}>
          Choisissez le plan qui correspond le mieux à votre façon de travailler.
          Tous nos plans incluent des mises à jour gratuites et un support premium.
        </p>
        
        <div className={styles.pricingCards}>
          {/* Forfait Gratuit */}
          <div ref={addToRefs} className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Gratuit</h3>
              <p className={styles.cardPrice}>
                <span className={styles.price}>0€</span>
                <span className={styles.period}>/mois</span>
              </p>
              <p className={styles.cardDescription}>
                Parfait pour découvrir les fonctionnalités de base
              </p>
            </div>
            
            <ul className={styles.cardFeatures}>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Jusqu'à 5 projets</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>30 tâches par projet</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Accès basique aux statistiques</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Application mobile</span>
              </li>
            </ul>
            
            <div className={styles.cardCta}>
              <Link to="/register" className={styles.secondaryButton}>
                <span className={styles.buttonContent}>Commencer gratuitement</span>
              </Link>
            </div>
          </div>
          
          {/* Forfait Pro */}
          <div ref={addToRefs} className={`${styles.pricingCard} ${styles.featuredCard}`}>
            <div className={styles.popularBadge}>Populaire</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Pro</h3>
              <p className={styles.cardPrice}>
                <span className={styles.price}>12€</span>
                <span className={styles.period}>/mois</span>
              </p>
              <p className={styles.cardDescription}>
                Idéal pour les professionnels et les petites équipes
              </p>
            </div>
            
            <ul className={styles.cardFeatures}>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Projets illimités</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Tâches illimitées</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Statistiques avancées</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Intégrations (Slack, Gmail)</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Collaboration jusqu'à 5 membres</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Support prioritaire</span>
              </li>
            </ul>
            
            <div className={styles.cardCta}>
              <Link to="/register" className={styles.primaryButton}>
                <span className={styles.buttonContent}>Essai gratuit de 14 jours</span>
              </Link>
            </div>
          </div>
          
          {/* Forfait Entreprise */}
          <div ref={addToRefs} className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Entreprise</h3>
              <p className={styles.cardPrice}>
                <span className={styles.price}>25€</span>
                <span className={styles.period}>/mois</span>
              </p>
              <p className={styles.cardDescription}>
                Solution complète pour les grandes équipes
              </p>
            </div>
            
            <ul className={styles.cardFeatures}>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Tout ce qui est inclus dans Pro</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Collaboration illimitée</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Gestion des permissions</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>SSO et authentification avancée</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>API dédiée</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>Gestionnaire de compte dédié</span>
              </li>
            </ul>
            
            <div className={styles.cardCta}>
              <Link to="/contact" className={styles.secondaryButton}>
                <span className={styles.buttonContent}>Contactez-nous</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className={styles.pricingFaq}>
          <h2 className={styles.faqTitle}>Questions fréquentes</h2>
          
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Puis-je changer de forfait à tout moment ?</h3>
              <p className={styles.faqAnswer}>
                Oui, vous pouvez mettre à niveau ou rétrograder votre forfait à tout moment. Les changements prennent effet immédiatement.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Comment fonctionne l'essai gratuit ?</h3>
              <p className={styles.faqAnswer}>
                Notre essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités Pro sans engagement. Aucune carte de crédit n'est requise.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Est-ce que je peux annuler à tout moment ?</h3>
              <p className={styles.faqAnswer}>
                Absolument ! Il n'y a pas de contrat à long terme. Vous pouvez annuler votre abonnement quand vous le souhaitez.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Proposez-vous des tarifs spéciaux pour les ONG ?</h3>
              <p className={styles.faqAnswer}>
                Oui, nous offrons des réductions pour les organisations à but non lucratif et les établissements d'enseignement. Contactez notre équipe commerciale pour plus d'informations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;