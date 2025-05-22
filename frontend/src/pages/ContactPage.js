import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // État des messages de validation/erreur
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Réinitialiser les erreurs lors de la saisie
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Valider le formulaire
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    
    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = 'Veuillez entrer votre nom';
      valid = false;
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'Veuillez entrer votre email';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
      valid = false;
    }
    
    // Validation du sujet
    if (!formData.subject.trim()) {
      newErrors.subject = 'Veuillez entrer un sujet';
      valid = false;
    }
    
    // Validation du message
    if (!formData.message.trim()) {
      newErrors.message = 'Veuillez entrer votre message';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simuler l'envoi du message (à remplacer par un appel API réel)
      console.log('Formulaire soumis:', formData);
      
      // Afficher le message de succès
      setSubmitSuccess(true);
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <Navbar />
      
      <div className={styles.waveTop}></div>
      
      <div className={styles.pageContent}>
        <div className={styles.contactWrapper}>
          <div className={styles.contactHeader}>
            <h1>Contactez-nous</h1>
            <p>Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question ou information.</p>
          </div>
          
          <div className={styles.contactMainContent}>
            <div className={styles.contactFormContainer}>
              {submitSuccess && (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <div>
                    <h3>Merci pour votre message !</h3>
                    <p>Nous vous répondrons dans les meilleurs délais.</p>
                  </div>
                </div>
              )}
              
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nom complet</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? styles.inputError : ''}
                    />
                    {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? styles.inputError : ''}
                    />
                    {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Sujet</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? styles.inputError : ''}
                  />
                  {errors.subject && <p className={styles.errorMessage}>{errors.subject}</p>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="6" 
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? styles.inputError : ''}
                  ></textarea>
                  {errors.message && <p className={styles.errorMessage}>{errors.message}</p>}
                </div>
                
                <button type="submit" className={styles.submitButton}>
                  <span className={styles.btnContent}>Envoyer le message</span>
                  <span className={styles.btnShine}></span>
                </button>
              </form>
            </div>
            
            <div className={styles.contactInfo}>
              <div className={styles.infoCard}>
                <h2>Informations de contact</h2>
                <p className={styles.infoDesc}>N'hésitez pas à nous contacter par les moyens suivants :</p>
                
                <ul className={styles.infoList}>
                  <li>
                    <div className={styles.infoIcon}>✉</div>
                    <div className={styles.infoContent}>
                      <h3>Email</h3>
                      <p><a href="mailto:contact@taskhandler.com">contact@taskhandler.com</a></p>
                    </div>
                  </li>
                  
                  <li>
                    <div className={styles.infoIcon}>📞</div>
                    <div className={styles.infoContent}>
                      <h3>Téléphone</h3>
                      <p><a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
                    </div>
                  </li>
                  
                  <li>
                    <div className={styles.infoIcon}>📍</div>
                    <div className={styles.infoContent}>
                      <h3>Adresse</h3>
                      <p>12 Rue de l'Innovation<br />75000 Paris, France</p>
                    </div>
                  </li>
                </ul>
                
                <div className={styles.socialLinks}>
                  <h3>Suivez-nous</h3>
                  <div className={styles.socialIcons}>
                    <a href="#" className={styles.socialIcon} aria-label="Facebook">
                      <span>f</span>
                    </a>
                    <a href="#" className={styles.socialIcon} aria-label="Twitter">
                      <span>𝕏</span>
                    </a>
                    <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                      <span>in</span>
                    </a>
                    <a href="#" className={styles.socialIcon} aria-label="Instagram">
                      <span>📷</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.waveBottom}></div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
