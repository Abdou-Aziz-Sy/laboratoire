// --- fichier: frontend/src/components/Tasks/TaskForm.js ---
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../../api/taskService';
import { InputField } from '../common/InputField';
import styles from './TaskForm.module.css';

const TaskForm = ({ onSuccess }) => {
  const navigate = useNavigate();

  // u00c9tats du formulaire
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    priorite: 'MOYENNE', // Valeur par du00e9faut
    dateEcheance: '',
    status: 'A_FAIRE' // Valeur par du00e9faut
  });

  // u00c9tats de validation et d'interface
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Options pour les su00e9lecteurs
  const priorityOptions = [
    { value: 'BASSE', label: 'Basse' },
    { value: 'MOYENNE', label: 'Moyenne' },
    { value: 'HAUTE', label: 'Haute' },
    { value: 'URGENTE', label: 'Urgente' }
  ];

  const statusOptions = [
    { value: 'A_FAIRE', label: 'u00c0 faire' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'TERMINEE', label: 'Terminu00e9e' }
  ];

  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Met u00e0 jour les donnu00e9es du formulaire
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Ru00e9initialise l'erreur pour ce champ si l'utilisateur commence u00e0 le modifier
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validation du titre (obligatoire)
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire';
      isValid = false;
    } else if (formData.titre.trim().length < 3) {
      newErrors.titre = 'Le titre doit contenir au moins 3 caractu00e8res';
      isValid = false;
    } else if (formData.titre.trim().length > 100) {
      newErrors.titre = 'Le titre ne doit pas du00e9passer 100 caractu00e8res';
      isValid = false;
    }

    // Validation de la description (obligatoire)
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
      isValid = false;
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'La description ne doit pas du00e9passer 500 caractu00e8res';
      isValid = false;
    }

    // Validation de la date d'u00e9chu00e9ance (obligatoire et doit u00eatre dans le futur)
    if (!formData.dateEcheance) {
      newErrors.dateEcheance = 'La date d\'u00e9chu00e9ance est obligatoire';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.dateEcheance);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dateEcheance = 'La date d\'u00e9chu00e9ance doit u00eatre aujourd\'hui ou dans le futur';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // Validation du formulaire
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Appel u00e0 l'API pour cru00e9er la tu00e2che
      const response = await createTask(formData);
      
      // Affiche le message de succu00e8s
      setShowSuccessMessage(true);
      
      // Ru00e9initialise le formulaire apru00e8s succu00e8s
      setFormData({
        titre: '',
        description: '',
        priorite: 'MOYENNE',
        dateEcheance: '',
        status: 'A_FAIRE'
      });
      
      // Attend 2 secondes avant de rediriger ou d'exu00e9cuter la callback de succu00e8s
      setTimeout(() => {
        setShowSuccessMessage(false);
        if (onSuccess) {
          onSuccess(response);
        } else {
          // Redirige vers la page des tu00e2ches (ajustez selon votre routage)
          navigate('/tasks');
        }
      }, 2000);
      
    } catch (error) {
      setApiError(error.message || 'Une erreur est survenue lors de la cru00e9ation de la tu00e2che');
      console.error('Erreur lors de la cru00e9ation de la tu00e2che:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul du nombre de caractu00e8res restants pour la description
  const descriptionCharsLeft = 500 - formData.description.length;

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm} noValidate>
      <h2 className={styles.formTitle}>Cru00e9er une nouvelle tu00e2che</h2>
      
      {/* Message d'erreur API */}
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      
      {/* Message de succu00e8s */}
      {showSuccessMessage && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          Tu00e2che cru00e9u00e9e avec succu00e8s!
        </div>
      )}

      {/* Champ du titre */}
      <div className={styles.inputGroup}>
        <InputField
          label="Titre"
          type="text"
          name="titre"
          id="task-title"
          value={formData.titre}
          onChange={handleChange}
          placeholder="Titre de la tu00e2che"
          required
          disabled={isLoading}
          className={styles.formInput}
          error={errors.titre}
        />
      </div>

      {/* Champ de la description */}
      <div className={styles.inputGroup}>
        <label htmlFor="task-description" className={styles.label}>
          Description
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id="task-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description du00e9taillu00e9e de la tu00e2che"
          required
          disabled={isLoading}
          className={`${styles.formInput} ${styles.textarea} ${errors.description ? styles.errorInput : ''}`}
          rows={5}
        />
        <div className={styles.charCount}>
          {descriptionCharsLeft} caractu00e8res restants
        </div>
        {errors.description && <div className={styles.errorText}>{errors.description}</div>}
      </div>

      {/* Su00e9lecteur de prioritu00e9 */}
      <div className={styles.inputGroup}>
        <label htmlFor="task-priority" className={styles.label}>
          Prioritu00e9
          <span className={styles.required}>*</span>
        </label>
        <select
          id="task-priority"
          name="priorite"
          value={formData.priorite}
          onChange={handleChange}
          disabled={isLoading}
          className={`${styles.formInput} ${styles.select}`}
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Champ de la date d'u00e9chu00e9ance */}
      <div className={styles.inputGroup}>
        <InputField
          label="Date d'u00e9chu00e9ance"
          type="date"
          name="dateEcheance"
          id="task-due-date"
          value={formData.dateEcheance}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={styles.formInput}
          error={errors.dateEcheance}
        />
      </div>

      {/* Su00e9lecteur de statut */}
      <div className={styles.inputGroup}>
        <label htmlFor="task-status" className={styles.label}>
          Statut
          <span className={styles.required}>*</span>
        </label>
        <select
          id="task-status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={isLoading}
          className={`${styles.formInput} ${styles.select}`}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner}>
            <span className={styles.spinner}></span>
            <span>Cru00e9ation en cours...</span>
          </div>
        ) : (
          "Cru00e9er la tu00e2che"
        )}
      </button>
    </form>
  );
};

export default TaskForm;
