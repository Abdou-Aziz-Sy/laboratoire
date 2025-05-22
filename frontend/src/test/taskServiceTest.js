// --- fichier: frontend/src/test/taskServiceTest.js ---

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} from '../api/taskService';

/**
 * Classe utilitaire pour tester les appels API liu00e9s aux tu00e2ches.
 * Cet outil permet de tester chaque fonction individuellement et de vu00e9rifier
 * que les appels au backend fonctionnent comme pru00e9vu.
 */
class TaskServiceTester {
  constructor() {
    this.taskId = null; // Pour stocker l'ID d'une tu00e2che cru00e9u00e9e pendant les tests
    this.consoleStyles = {
      success: 'color: green; font-weight: bold;',
      error: 'color: red; font-weight: bold;',
      info: 'color: blue; font-weight: bold;',
      title: 'color: purple; font-weight: bold; font-size: 14px;'
    };
  }

  /**
   * Affiche un message formatu00e9 dans la console.
   * @param {string} message - Le message u00e0 afficher
   * @param {string} type - Le type de message ('success', 'error', 'info', 'title')
   */
  log(message, type = 'info') {
    console.log(`%c${message}`, this.consoleStyles[type]);
  }

  /**
   * Teste la cru00e9ation d'une tu00e2che.
   * @param {object} taskData - Donnu00e9es de la tu00e2che u00e0 cru00e9er
   * @returns {Promise<void>}
   */
  async testCreateTask(taskData) {
    this.log('Test - Cru00e9ation d\'une tu00e2che', 'title');
    
    try {
      const task = await createTask(taskData);
      this.taskId = task.id || task._id; // Selon la structure de ru00e9ponse de votre API
      this.log(`Tu00e2che cru00e9u00e9e avec succu00e8s: ID ${this.taskId}`, 'success');
      console.log('Du00e9tails de la tu00e2che:', task);
      return task;
    } catch (error) {
      this.log(`u00c9chec de la cru00e9ation de tu00e2che: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Teste la ru00e9cupu00e9ration de toutes les tu00e2ches.
   * @param {object} queryParams - Paramu00e8tres de filtrage optionnels
   * @returns {Promise<void>}
   */
  async testGetTasks(queryParams = {}) {
    this.log('Test - Ru00e9cupu00e9ration de toutes les tu00e2ches', 'title');
    
    try {
      const tasks = await getTasks(queryParams);
      this.log(`${tasks.length} tu00e2ches ru00e9cupu00e9ru00e9es avec succu00e8s`, 'success');
      console.log('Liste des tu00e2ches:', tasks);
      return tasks;
    } catch (error) {
      this.log(`u00c9chec de la ru00e9cupu00e9ration des tu00e2ches: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Teste la ru00e9cupu00e9ration d'une tu00e2che spu00e9cifique.
   * @param {string} taskId - ID de la tu00e2che u00e0 ru00e9cupu00e9rer (utilise this.taskId si non spu00e9cifiu00e9)
   * @returns {Promise<void>}
   */
  async testGetTaskById(taskId = null) {
    const id = taskId || this.taskId;
    if (!id) {
      this.log('Aucun ID de tu00e2che disponible. Cru00e9ez une tu00e2che d\'abord.', 'error');
      return;
    }
    
    this.log(`Test - Ru00e9cupu00e9ration de la tu00e2che ${id}`, 'title');
    
    try {
      const task = await getTaskById(id);
      this.log(`Tu00e2che ru00e9cupu00e9ru00e9e avec succu00e8s`, 'success');
      console.log('Du00e9tails de la tu00e2che:', task);
      return task;
    } catch (error) {
      this.log(`u00c9chec de la ru00e9cupu00e9ration de la tu00e2che: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Teste la mise u00e0 jour d'une tu00e2che.
   * @param {object} updatedData - Nouvelles donnu00e9es pour la tu00e2che
   * @param {string} taskId - ID de la tu00e2che u00e0 mettre u00e0 jour (utilise this.taskId si non spu00e9cifiu00e9)
   * @returns {Promise<void>}
   */
  async testUpdateTask(updatedData, taskId = null) {
    const id = taskId || this.taskId;
    if (!id) {
      this.log('Aucun ID de tu00e2che disponible. Cru00e9ez une tu00e2che d\'abord.', 'error');
      return;
    }
    
    this.log(`Test - Mise u00e0 jour de la tu00e2che ${id}`, 'title');
    
    try {
      const task = await updateTask(id, updatedData);
      this.log(`Tu00e2che mise u00e0 jour avec succu00e8s`, 'success');
      console.log('Du00e9tails de la tu00e2che mise u00e0 jour:', task);
      return task;
    } catch (error) {
      this.log(`u00c9chec de la mise u00e0 jour de la tu00e2che: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Teste la mise u00e0 jour du statut d'une tu00e2che.
   * @param {string} newStatus - Nouveau statut pour la tu00e2che
   * @param {string} taskId - ID de la tu00e2che u00e0 mettre u00e0 jour (utilise this.taskId si non spu00e9cifiu00e9)
   * @returns {Promise<void>}
   */
  async testUpdateTaskStatus(newStatus, taskId = null) {
    const id = taskId || this.taskId;
    if (!id) {
      this.log('Aucun ID de tu00e2che disponible. Cru00e9ez une tu00e2che d\'abord.', 'error');
      return;
    }
    
    this.log(`Test - Mise u00e0 jour du statut de la tu00e2che ${id} vers '${newStatus}'`, 'title');
    
    try {
      const task = await updateTaskStatus(id, newStatus);
      this.log(`Statut de la tu00e2che mis u00e0 jour avec succu00e8s`, 'success');
      console.log('Du00e9tails de la tu00e2che mise u00e0 jour:', task);
      return task;
    } catch (error) {
      this.log(`u00c9chec de la mise u00e0 jour du statut de la tu00e2che: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Teste la suppression d'une tu00e2che.
   * @param {string} taskId - ID de la tu00e2che u00e0 supprimer (utilise this.taskId si non spu00e9cifiu00e9)
   * @returns {Promise<void>}
   */
  async testDeleteTask(taskId = null) {
    const id = taskId || this.taskId;
    if (!id) {
      this.log('Aucun ID de tu00e2che disponible. Cru00e9ez une tu00e2che d\'abord.', 'error');
      return;
    }
    
    this.log(`Test - Suppression de la tu00e2che ${id}`, 'title');
    
    try {
      await deleteTask(id);
      this.log(`Tu00e2che supprimu00e9e avec succu00e8s`, 'success');
      // Apru00e8s suppression, ru00e9initialise l'ID stocku00e9
      if (id === this.taskId) {
        this.taskId = null;
      }
      return { success: true };
    } catch (error) {
      this.log(`u00c9chec de la suppression de la tu00e2che: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Teste la ru00e9cupu00e9ration des statistiques des tu00e2ches.
   * @returns {Promise<void>}
   */
  async testGetTaskStats() {
    this.log('Test - Ru00e9cupu00e9ration des statistiques des tu00e2ches', 'title');
    
    try {
      const stats = await getTaskStats();
      this.log(`Statistiques ru00e9cupu00e9ru00e9es avec succu00e8s`, 'success');
      console.log('Statistiques des tu00e2ches:', stats);
      return stats;
    } catch (error) {
      this.log(`u00c9chec de la ru00e9cupu00e9ration des statistiques: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Exu00e9cute un scu00e9nario de test complet: cru00e9ation, ru00e9cupu00e9ration, mise u00e0 jour, changement de statut, suppression.
   * @returns {Promise<void>}
   */
  async runFullTestScenario() {
    this.log('Du00e9marrage du scu00e9nario de test complet', 'title');
    
    try {
      // Exemple de donnu00e9es de test
      const sampleTask = {
        titre: 'Tester l\'API de gestion des tu00e2ches',
        description: 'Tester toutes les fonctionnalitu00e9s CRUD du service de tu00e2ches',
        priorite: 'HAUTE',
        dateEcheance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dans 7 jours
        status: 'A_FAIRE'
      };

      // 1. Cru00e9er une tu00e2che
      const createdTask = await this.testCreateTask(sampleTask);
      
      // Pause de 1 seconde entre les appels pour u00e9viter la throttling
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. Ru00e9cupu00e9rer toutes les tu00e2ches
      await this.testGetTasks();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Ru00e9cupu00e9rer la tu00e2che spu00e9cifique
      await this.testGetTaskById();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 4. Mettre u00e0 jour la tu00e2che
      await this.testUpdateTask({ 
        description: 'Description mise u00e0 jour pendant le test' 
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 5. Mettre u00e0 jour le statut
      await this.testUpdateTaskStatus('EN_COURS');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 6. Ru00e9cupu00e9rer les statistiques
      await this.testGetTaskStats();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 7. Supprimer la tu00e2che
      await this.testDeleteTask();
      
      this.log('Scu00e9nario de test complet terminu00e9 avec succu00e8s!', 'success');
    } catch (error) {
      this.log(`u00c9chec du scu00e9nario de test: ${error.message}`, 'error');
      console.error(error);
    }
  }
}

// Cru00e9ation d'un exemple d'usage
window.TaskTester = new TaskServiceTester();

// Instructions d'utilisation 
console.log(`
%cTesteur de Service Tu00e2ches
%c----------------
Cet utilitaire a u00e9tu00e9 injectu00e9 dans votre application pour tester les appels API des tu00e2ches.
Vous pouvez l'utiliser dans la console du navigateur:

1. Pour exu00e9cuter l'ensemble du scu00e9nario de test:
   > TaskTester.runFullTestScenario()

2. Pour tester individuellement chaque fonction:
   > TaskTester.testCreateTask({ titre: 'Ma tu00e2che', description: 'Description', priorite: 'MOYENNE', dateEcheance: '2023-12-31', status: 'A_FAIRE' })
   > TaskTester.testGetTasks()
   > TaskTester.testGetTaskById('id-de-tache')
   > TaskTester.testUpdateTask({ description: 'Nouvelle description' })
   > TaskTester.testUpdateTaskStatus('TERMINEE')
   > TaskTester.testDeleteTask()
   > TaskTester.testGetTaskStats()
`,
  'color: purple; font-weight: bold; font-size: 16px;',
  'color: black; font-weight: bold;'
);

export default TaskServiceTester;
