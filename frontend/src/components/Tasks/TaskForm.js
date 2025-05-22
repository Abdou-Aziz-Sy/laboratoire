// --- fichier: frontend/src/components/Tasks/TaskForm.js ---
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, updateTask } from '../../api/taskService';
import { InputField } from '../common/InputField';
import { useToast } from '../../context/ToastContext';
import styles from './TaskForm.module.css';

const TaskForm = ({ onSuccess, initialData = null, isEditMode = false, taskId = null }) => {
  const navigate = useNavigate();
  const { error: showError } = useToast();

  // État initial du formulaire (vide ou avec les données existantes)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    priorite: 'MOYENNE', // Valeur par défaut
    dateEcheance: '',
    status: 'A_FAIRE' // Valeur par défaut
  });

  // États de validation et d'interface
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [descriptionCharsLeft, setDescriptionCharsLeft] = useState(500);

  // Options pour les sélecteurs
  const priorityOptions = [
    { value: 'BASSE', label: 'Basse' },
    { value: 'MOYENNE', label: 'Moyenne' },
    { value: 'HAUTE', label: 'Haute' },
    { value: 'URGENTE', label: 'Urgente' }
  ];

  const statusOptions = [
    { value: 'A_FAIRE', label: 'À faire' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'TERMINEE', label: 'Terminée' }
  ];

  // Pré-remplir le formulaire avec les données existantes en mode édition
  useEffect(() => {
    if (isEditMode && initialData) {
      // Adapter le format de la date si nécessaire
      let formattedDate = initialData.dateEcheance;
      if (formattedDate && !formattedDate.includes('T')) {
        formattedDate = formattedDate; // Déjà au format YYYY-MM-DD
      } else if (formattedDate) {
        // Convertir du format ISO au format YYYY-MM-DD
        formattedDate = new Date(formattedDate).toISOString().split('T')[0];
      }

      // Mise à jour de l'état du formulaire avec les données existantes
      setFormData({
        titre: initialData.titre || '',
        description: initialData.description || '',
        priorite: initialData.priorite || 'MOYENNE',
        dateEcheance: formattedDate || '',
        status: initialData.status || 'A_FAIRE'
      });

      // Mise à jour du compteur de caractères pour la description
      setDescriptionCharsLeft(500 - (initialData.description ? initialData.description.length : 0));
    }
  }, [isEditMode, initialData]);

  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Met à jour les données du formulaire
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Met à jour le compteur de caractères pour la description
    if (name === 'description') {
      setDescriptionCharsLeft(500 - value.length);
    }
    
    // Réinitialise l'erreur pour ce champ si l'utilisateur commence à le modifier
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
      newErrors.titre = 'Le titre doit contenir au moins 3 caractères';
      isValid = false;
    } else if (formData.titre.trim().length > 100) {
      newErrors.titre = 'Le titre ne doit pas dépasser 100 caractères';
      isValid = false;
    }

    // Validation de la description (obligatoire)
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
      isValid = false;
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'La description ne doit pas dépasser 500 caractères';
      isValid = false;
    }

    // Validation de la date d'échéance (obligatoire et doit être dans le futur)
    if (!formData.dateEcheance) {
      newErrors.dateEcheance = 'La date d\'échéance est obligatoire';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.dateEcheance);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today && !isEditMode) {
        // En mode création, la date doit être dans le futur
        newErrors.dateEcheance = 'La date d\'échéance doit être aujourd\'hui ou dans le futur';
        isValid = false;
      }
      // En mode édition, on permet de conserver la date d'origine même si elle est dans le passé
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
      let response;
      
      if (isEditMode && taskId) {
        // Mode édition: Appel à l'API pour mettre à jour la tâche
        response = await updateTask(taskId, formData);
        console.log('Tâche mise à jour avec succès:', response);
      } else {
        // Mode création: Appel à l'API pour créer la tâche
        response = await createTask(formData);
        console.log('Tâche créée avec succès:', response);
      }
      
      // Affiche le message de succès
      setShowSuccessMessage(true);
      
      // Si une fonction de callback est fournie, l'appeler avec la réponse
      if (onSuccess) {
        onSuccess(response);
      }
      
      // En mode création, réinitialiser le formulaire
      if (!isEditMode) {
        setFormData({
          titre: '',
          description: '',
          priorite: 'MOYENNE',
          dateEcheance: '',
          status: 'A_FAIRE'
        });
      }
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (error) {
      console.error(`Erreur lors de ${isEditMode ? 'la mise à jour' : 'la création'} de la tâche:`, error);
      setApiError(error.message || `Une erreur est survenue lors de ${isEditMode ? 'la mise à jour' : 'la création'} de la tâche`);
      showError(`Erreur: ${error.message || `Une erreur est survenue lors de ${isEditMode ? 'la mise à jour' : 'la création'} de la tâche`}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Textes dynamiques selon le mode (création ou édition)
  const modeTexts = {
    title: isEditMode ? 'Modifier la tâche' : 'Créer une nouvelle tâche',
    button: isEditMode ? 'Enregistrer les modifications' : 'Créer la tâche',
    loading: isEditMode ? 'Mise à jour en cours...' : 'Création en cours...',
    success: isEditMode ? 'Tâche mise à jour avec succès!' : 'Tâche créée avec succès!'
  };

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm}>
      {/* Message d'erreur API */}
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      
      {/* Message de succès */}
      {showSuccessMessage && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          {modeTexts.success}
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
          placeholder="Titre de la tâche"
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
          placeholder="Description détaillée de la tâche"
          required
          disabled={isLoading}
          className={`${styles.formInput} ${styles.textarea} ${errors.description ? styles.errorInput : ''}`}
          rows={5}
        />
        <div className={styles.charCount}>
          {descriptionCharsLeft} caractères restants
        </div>
        {errors.description && <div className={styles.errorText}>{errors.description}</div>}
      </div>

      {/* Sélecteur de priorité */}
      <div className={styles.inputGroup}>
        <label htmlFor="task-priority" className={styles.label}>
          Priorité
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

      {/* Champ de la date d'échéance */}
      <div className={styles.inputGroup}>
        <InputField
          label="Date d'échéance"
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

      {/* Sélecteur de statut */}
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
            <span>{modeTexts.loading}</span>
          </div>
        ) : (
          modeTexts.button
        )}
      </button>
      
      {/* Bouton d'annulation en mode édition */}
      {isEditMode && (
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => navigate('/tasks')}
          disabled={isLoading}
        >
          Annuler
        </button>
      )}
    </form>
  );
};

export default TaskForm;