import React from 'react';
import styles from './WaveBackground.module.css';

const WaveBackground = () => {
  return (
    <div className={styles.waveContainer}>
      {/* Plusieurs couches de vagues avec différentes animations */}
      <div className={`${styles.wave} ${styles.wave1}`}></div>
      <div className={`${styles.wave} ${styles.wave2}`}></div>
      <div className={`${styles.wave} ${styles.wave3}`}></div>
      <div className={`${styles.wave} ${styles.wave4}`}></div>
      
      {/* Effet de particules/étoiles */}
      <div className={styles.particles}>
        {Array(20).fill().map((_, index) => (
          <div 
            key={index} 
            className={styles.particle} 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: Math.random() * 0.5 + 0.2,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WaveBackground;
