// --- fichier: frontend/src/components/Home/TestimonialsSection.js ---
import React, { useState, useEffect, useRef } from 'react';
import styles from './TestimonialsSection.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Chef de projet',
    company: 'DigitalFlow',
    content: 'TaskHandler a révolutionné notre gestion de projets. L\'interface intuitive et les fonctionnalités de collaboration nous ont permis d\'augmenter notre productivité de 40% en seulement trois mois.',
    rating: 5
  },
  {
    id: 2,
    name: 'Thomas Dupont',
    role: 'Entrepreneur',
    company: 'StartupLab',
    content: 'En tant qu\'entrepreneur, je jongle avec des dizaines de tâches quotidiennes. TaskHandler m\'a permis de mettre de l\'ordre dans ce chaos et de prioriser efficacement mes activités. Je ne pourrais plus m\'en passer !',
    rating: 5
  },
  {
    id: 3,
    name: 'Julie Leclerc',
    role: 'Responsable marketing',
    company: 'MediaGroup',
    content: 'Grâce à TaskHandler, notre équipe marketing coordonne ses campagnes avec une précision impressionnante. Les rappels automatiques et les tableaux de bord personnalisés sont particulièrement utiles.',
    rating: 4
  },
  {
    id: 4,
    name: 'Alexandre Petit',
    role: 'Développeur freelance',
    company: 'CodeCraft',
    content: 'J\'utilise TaskHandler quotidiennement pour suivre mes projets clients. La possibilité de créer des workflows personnalisés et d\'automatiser certaines tâches m\'a fait gagner des heures précieuses chaque semaine.',
    rating: 5
  },
  {
    id: 5,
    name: 'Camille Rousseau',
    role: 'Étudiante en master',
    company: 'Université de Paris',
    content: 'TaskHandler m\'aide à organiser mes études, mes projets de recherche et même ma vie personnelle. L\'application est suffisamment flexible pour s\'adapter à tous mes besoins.',
    rating: 4
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  
  // Animation au défilement
  useEffect(() => {
    const options = {
      threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    }, options);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  const goToPrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };
  
  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };
  
  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };
  
  // Génération des étoiles pour la notation
  const renderStars = (rating) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${styles.star} ${i <= rating ? styles.starFilled : styles.starEmpty}`}
        ></span>
      );
    }
    
    return stars;
  };
  
  return (
    <section className={styles.testimonialsSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nos utilisateurs témoignent</h2>
          <p className={styles.sectionSubtitle}>
            Découvrez comment TaskHandler transforme la gestion des tâches de nos utilisateurs
          </p>
        </div>
        
        <div className={styles.sliderContainer}>
          <div 
            className={styles.sliderWrapper}
            ref={sliderRef}
          >
            <div 
              className={styles.sliderTrack} 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div className={styles.testimonialCard} key={testimonial.id}>
                  <div className={styles.quoteIcon}></div>
                  <div className={styles.testimonialContent}>
                    {testimonial.content}
                  </div>
                  <div className={styles.testimonialRating}>
                    {renderStars(testimonial.rating)}
                  </div>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorInitial}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>{testimonial.name}</div>
                      <div className={styles.authorRole}>
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.sliderControls}>
            <button 
              className={`${styles.sliderArrow} ${styles.sliderArrowPrev}`}
              onClick={goToPrev}
              aria-label="Témoignage précédent"
            ></button>
            
            <div className={styles.sliderDots}>
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  className={`${styles.sliderDot} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Témoignage ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <button 
              className={`${styles.sliderArrow} ${styles.sliderArrowNext}`}
              onClick={goToNext}
              aria-label="Témoignage suivant"
            ></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;