// --- fichier: frontend/src/pages/PricingPage.js ---
import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PricingSection from '../components/Pricing/PricingSection';
import WaveBackground from '../components/Home/WaveBackground';
import styles from './PricingPage.module.css';

const PricingPage = () => {
  return (
    <div className={styles.pricingPageContainer}>
      <Navbar />
      
      <main className={styles.mainContent}>
        <WaveBackground />
        <PricingSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;