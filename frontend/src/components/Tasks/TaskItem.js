// frontend/src/components/Tasks/TaskItem.js
import React, { useState, useRef, useEffect } from 'react';
import { updateTaskStatus, deleteTask, updateTask } from '../../api/taskService';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, onTaskUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // 'delete', 'edit', null
  const [editData, setEditData] = useState({
    titre: task.titre,
    description: task.description,
    priorite: task.priorite,
    dateEcheance: task.dateEcheance ? task.dateEcheance.split('T')[0] : ''
  });
  const statusDropdownRef = useRef(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const editFormRef = useRef(null);
  
  // Gestionnaire de clic en dehors des dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fermer le dropdown de statut si on clique en dehors
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
      
      // Fermer le formulaire d'édition si on clique en dehors et qu'il est ouvert
      if (actionType === 'edit' && editFormRef.current && !editFormRef.current.contains(event.target)) {
        setActionType(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionType]);
  
  // Formatage de la date d'échéance
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Traduire les priorités en français et obtenir la classe CSS correspondante
  const getPriorityInfo = (priority) => {
    const priorityMap = {
      'BASSE': { label: 'Basse', className: styles.lowPriority },
      'MOYENNE': { label: 'Moyenne', className: styles.mediumPriority },
      'HAUTE': { label: 'Haute', className: styles.highPriority },
      'URGENTE': { label: 'Urgente', className: styles.urgentPriority }
    };
    
    return priorityMap[priority] || { label: priority, className: '' };
  };
  
  // Traduire les statuts en français et obtenir la classe CSS correspondante
  const getStatusInfo = (status) => {
    const statusMap = {
      'A_FAIRE': { label: 'À faire', className: styles.todoStatus },
      'EN_COURS': { label: 'En cours', className: styles.inProgressStatus },
      'TERMINEE': { label: 'Terminée', className: styles.completedStatus }
    };
    
    return statusMap[status] || { label: status, className: '' };
  };
  
  // Mise à jour du statut de la tâche avec feedback visuel
  const handleStatusChange = async (newStatus) => {
    if (task.status === newStatus || loading) return;
    
    setLoading(true);
    try {
      await updateTaskStatus(task.id, newStatus);
      setStatusDropdownOpen(false); // Fermer le dropdown
      onTaskUpdated(); // Rafraîchir la liste des tâches
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert(`Erreur: ${error.message || 'Impossible de mettre à jour le statut'}`); 
    } finally {
      setLoading(false);
    }
  };
  
  // Suppression de la tâche avec confirmation
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(task.id);
      onTaskUpdated(); // Rafraîchir la liste des tâches
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      alert(`Erreur: ${error.message || 'Impossible de supprimer la tâche'}`); 
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };
  
  // Mise à jour rapide de la tâche
  const handleQuickEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateTask(task.id, editData);
      setActionType(null); // Fermer le formulaire
      onTaskUpdated(); // Rafraîchir la liste des tâches
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      alert(`Erreur: ${error.message || 'Impossible de mettre à jour la tâche'}`); 
    } finally {
      setLoading(false);
    }
  };
  
  // Gestion du changement dans le formulaire d'édition
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Priorité de la tâche formatée
  const priorityInfo = getPriorityInfo(task.priorite);
  
  // Statut de la tâche formaté
  const statusInfo = getStatusInfo(task.status);

  return (
    <tr className={styles.taskRow}>
      <td className={styles.titleCell}>
        <div className={styles.taskTitle}>{task.titre}</div>
        <div className={styles.taskDescription}>
          {task.description.length > 50 
            ? `${task.description.substring(0, 50)}...` 
            : task.description}
        </div>
      </td>
      <td>
        <span className={`${styles.badge} ${priorityInfo.className}`}>
          {priorityInfo.label}
        </span>
      </td>
      <td>
        <div 
          className={`${styles.statusDropdown} ${statusDropdownOpen ? styles.active : ''}`}
          ref={statusDropdownRef}
        >
          <div 
            className={`${styles.statusBadge} ${statusInfo.className}`}
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
          >
            {statusInfo.label}
            <span className={styles.dropdownArrow}>u25BC</span>
          </div>
          
          {/* Menu déroulant pour changer de statut */}
          <div className={`${styles.statusOptions} ${statusDropdownOpen ? styles.visible : ''}`}>
            <div 
              className={`${styles.statusOption} ${styles.todoStatus} ${task.status === 'A_FAIRE' ? styles.currentStatus : ''}`}
              onClick={() => handleStatusChange('A_FAIRE')}
            >
              À faire
            </div>
            <div 
              className={`${styles.statusOption} ${styles.inProgressStatus} ${task.status === 'EN_COURS' ? styles.currentStatus : ''}`}
              onClick={() => handleStatusChange('EN_COURS')}
            >
              En cours
            </div>
            <div 
              className={`${styles.statusOption} ${styles.completedStatus} ${task.status === 'TERMINEE' ? styles.currentStatus : ''}`}
              onClick={() => handleStatusChange('TERMINEE')}
            >
              Terminée
            </div>
          </div>
        </div>
      </td>
      <td>{formatDate(task.dateEcheance)}</td>
      <td>
        <div className={styles.actions}>
          {actionType === 'delete' ? (
            <div className={styles.confirmDelete}>
              <span>Confirmer ?</span>
              <button 
                onClick={handleDelete} 
                className={styles.confirmYesBtn} 
                disabled={loading}
              >
                {loading ? '...' : 'Oui'}
              </button>
              <button 
                onClick={() => setActionType(null)} 
                className={styles.confirmNoBtn}
              >
                Non
              </button>
            </div>
          ) : actionType === 'edit' ? (
            <div className={styles.quickEditForm} ref={editFormRef}>
              <form onSubmit={handleQuickEdit}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="titre"
                    value={editData.titre}
                    onChange={handleEditChange}
                    placeholder="Titre"
                    className={styles.editInput}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                    className={styles.editTextarea}
                    rows="2"
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <select
                      name="priorite"
                      value={editData.priorite}
                      onChange={handleEditChange}
                      className={styles.editSelect}
                    >
                      <option value="BASSE">Basse</option>
                      <option value="MOYENNE">Moyenne</option>
                      <option value="HAUTE">Haute</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="date"
                      name="dateEcheance"
                      value={editData.dateEcheance}
                      onChange={handleEditChange}
                      className={styles.editInput}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className={styles.saveBtn}
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActionType(null)}
                    className={styles.cancelBtn}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <button
                className={`${styles.actionBtn} ${styles.viewBtn}`}
                title="Voir les détails"
                onClick={() => window.location.href = `/tasks/${task.id}`}
              >
                <span className={styles.actionIcon}>ud83dudc41ufe0f</span>
              </button>
              <button
                className={`${styles.actionBtn} ${styles.editBtn}`}
                title="Modifier"
                onClick={() => setActionType('edit')}
              >
                <span className={styles.actionIcon}>u270fufe0f</span>
              </button>
              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                title="Supprimer"
                onClick={() => setActionType('delete')}
              >
                <span className={styles.actionIcon}>ud83duddd1ufe0f</span>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TaskItem;