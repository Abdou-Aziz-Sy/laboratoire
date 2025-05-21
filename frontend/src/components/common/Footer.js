// --- fichier: frontend/src/components/common/Footer.js ---
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <h2 className={styles.footerTitle}>TaskHandler</h2>
            <p className={styles.footerDescription}>
              Simplifiez la gestion de vos tâches et augmentez votre productivité avec notre solution intuitive.
            </p>
            <div className={styles.socialLinks}>
              {/* Icônes sociales en CSS pur */}
              <a href="https://twitter.com" className={`${styles.socialLink} ${styles.twitter}`} aria-label="Twitter">
                <span className={styles.socialIcon}></span>
              </a>
              <a href="https://facebook.com" className={`${styles.socialLink} ${styles.facebook}`} aria-label="Facebook">
                <span className={styles.socialIcon}></span>
              </a>
              <a href="https://linkedin.com" className={`${styles.socialLink} ${styles.linkedin}`} aria-label="LinkedIn">
                <span className={styles.socialIcon}></span>
              </a>
              <a href="https://instagram.com" className={`${styles.socialLink} ${styles.instagram}`} aria-label="Instagram">
                <span className={styles.socialIcon}></span>
              </a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h3 className={styles.footerSubtitle}>Liens rapides</h3>
            <ul className={styles.linksList}>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/features">Fonctionnalités</Link></li>
              <li><Link to="/pricing">Tarifs</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className={styles.footerLinks}>
            <h3 className={styles.footerSubtitle}>Légal</h3>
            <ul className={styles.linksList}>
              <li><Link to="/terms">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy">Politique de confidentialité</Link></li>
              <li><Link to="/cookies">Cookies</Link></li>
            </ul>
          </div>

          <div className={styles.footerLinks}>
            <h3 className={styles.footerSubtitle}>Contact</h3>
            <ul className={styles.linksList}>
              <li className={styles.contactItem}>
                <span className={`${styles.contactIcon} ${styles.emailIcon}`}></span>
                <a href="mailto:contact@taskhandler.com">contact@taskhandler.com</a>
              </li>
              <li className={styles.contactItem}>
                <span className={`${styles.contactIcon} ${styles.phoneIcon}`}></span>
                <a href="tel:+33123456789">+33 1 23 45 67 89</a>
              </li>
              <li className={styles.contactItem}>
                <span className={`${styles.contactIcon} ${styles.addressIcon}`}></span>
                <span>12 Rue de l'Innovation, 75000 Paris</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; {currentYear} TaskHandler. Tous droits réservés.</p>
          <p className={styles.credits}>Conçu avec <span className={styles.heart}></span> pour une productivité optimale</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;