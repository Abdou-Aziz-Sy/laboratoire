import React, { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  // u00c9tats pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  // Gu00e9rer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Effacer l'erreur lorsque l'utilisateur commence u00e0 taper
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    // Validation du sujet
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    // Validation du message
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractu00e8res';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Gu00e9rer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simuler l'envoi du formulaire (dans une version ru00e9elle, cela serait une requu00eate API)
      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Votre message a u00e9tu00e9 envoyu00e9 avec succu00e8s! Nous vous ru00e9pondrons dans les plus brefs du00e9lais.'
      });
      
      // Ru00e9initialiser le formulaire apru00e8s succu00e8s
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Effacer le message de succu00e8s apru00e8s 5 secondes
      setTimeout(() => {
        setSubmitStatus({
          submitted: false,
          success: false,
          message: ''
        });
      }, 5000);
    }
  };
  
  return (
    <div className={styles.formWrapper}>
      {submitStatus.submitted && submitStatus.success && (
        <div className={styles.successMessage}>
          <i className={styles.successIcon}></i>
          <p>{submitStatus.message}</p>
        </div>
      )}
      
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
              placeholder="Votre nom"
            />
            <label htmlFor="name" className={styles.formLabel}>
              Nom complet
            </label>
          </div>
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
              placeholder="Votre email"
            />
            <label htmlFor="email" className={styles.formLabel}>
              Adresse email
            </label>
          </div>
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.subject ? styles.error : ''}`}
              placeholder="Sujet de votre message"
            />
            <label htmlFor="subject" className={styles.formLabel}>
              Sujet
            </label>
          </div>
          {errors.subject && <p className={styles.errorText}>{errors.subject}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`${styles.formTextarea} ${errors.message ? styles.error : ''}`}
              placeholder="Votre message"
              rows="6"
            ></textarea>
            <label htmlFor="message" className={styles.formLabel}>
              Message
            </label>
          </div>
          {errors.message && <p className={styles.errorText}>{errors.message}</p>}
        </div>
        
        <button type="submit" className={styles.submitButton}>
          <span className={styles.buttonText}>Envoyer</span>
          <span className={styles.buttonIcon}></span>
          <span className={styles.buttonShine}></span>
        </button>
      </form>
      
      <div className={styles.formFooter}>
        <p>Nous respectons votre vie privu00e9e et ne partagerons jamais vos informations.</p>
      </div>
    </div>
  );
};

export default ContactForm;
