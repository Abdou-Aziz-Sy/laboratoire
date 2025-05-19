// --- fichier: frontend/src/pages/HomePage.js ---
import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/Home/HeroSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import HowItWorksSection from '../components/Home/HowItWorksSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import CtaSection from '../components/Home/CtaSection';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homeContainer}>
      <Navbar />
      
      <main className={styles.mainContent}>
        {/* Section Hero avec animation */}
        <HeroSection />
        
        {/* Section Fonctionnalités */}
        <FeaturesSection />
        
        {/* Section Comment ça marche */}
        <HowItWorksSection />
        
        {/* Section Témoignages */}
        <TestimonialsSection />
        
        {/* Section appel à l'action finale */}
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;