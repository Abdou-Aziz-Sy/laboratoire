// --- fichier: frontend/src/components/Home/WaveBackground.js ---
import React from 'react';
import styles from './WaveBackground.module.css';

const WaveBackground = () => {
  return (
    <div className={styles.waveBackground}>
      {/* Couche de dégradé de base */}
      <div className={styles.gradientBackground}></div>
      
      {/* Vagues avec animation */}
      <div className={styles.waveContainer}>
        <div className={`${styles.wave} ${styles.wave1}`}></div>
        <div className={`${styles.wave} ${styles.wave2}`}></div>
        <div className={`${styles.wave} ${styles.wave3}`}></div>
      </div>
      
      {/* Particules flottantes */}
      <div className={styles.particles}>
        <div className={`${styles.particle} ${styles.particle1}`}></div>
        <div className={`${styles.particle} ${styles.particle2}`}></div>
        <div className={`${styles.particle} ${styles.particle3}`}></div>
        <div className={`${styles.particle} ${styles.particle4}`}></div>
        <div className={`${styles.particle} ${styles.particle5}`}></div>
        <div className={`${styles.particle} ${styles.particle6}`}></div>
        <div className={`${styles.particle} ${styles.particle7}`}></div>
        <div className={`${styles.particle} ${styles.particle8}`}></div>
      </div>
      
      {/* Effet de grille */}
      <div className={styles.grid}></div>
    </div>
  );
};

export default WaveBackground;