// --- fichier: frontend/src/api/taskService.js ---

// Base URL pour les endpoints liés aux tâches
const BASE_URL = 'http://localhost:8081/api/tasks';

/**
 * Effectue une requête fetch en ajoutant le token d'authentification.
 * Gère les erreurs de base et le parsing JSON.
 * @param {string} url - L'URL de l'API à appeler.
 * @param {object} options - Options de Fetch (method, body, headers, etc.).
 * @returns {Promise<any>} La réponse JSON parsée.
 * @throws {Error} Lance une erreur en cas de réponse non-OK ou d'échec du parsing.
 */
export async function fetchWithAuthTask(url, options = {}) {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
    };

    // Ajoute le token d'authentification aux en-têtes
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        // Si aucun token n'est trouvé, l'utilisateur n'est probablement pas connecté
        throw new Error('Vous devez être connecté pour effectuer cette action.');
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            // Tente de récupérer un message d'erreur JSON si disponible
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `Erreur serveur ${response.status}`;
            } catch (e) {
                errorMessage = `Erreur serveur ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        // Vérifie si la réponse est au format JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text(); // Retourne le texte brut si ce n'est pas du JSON
        }
    } catch (error) {
        console.error('Erreur lors de la requête API:', error);
        throw error; // Propage l'erreur pour la gestion dans les composants
    }
}

/**
 * Crée une nouvelle tâche.
 * @param {object} taskData - Données de la tâche (titre, description, priorité, dateEcheance, etc.)
 * @returns {Promise<object>} La tâche créée, retournée par l'API.
 */
export const createTask = async (taskData) => {
    try {
        const response = await fetchWithAuthTask(`${BASE_URL}`, {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
        console.log('Tâche créée avec succès:', response);
        return response;
    } catch (error) {
        console.error('Erreur lors de la création de la tâche:', error);
        throw error;
    }
};

/**
 * Récupère toutes les tâches de l'utilisateur.
 * @param {object} queryParams - Paramètres de requête optionnels (filtres, pagination, etc.)
 * @returns {Promise<Array>} Liste des tâches.
 */
export const getTasks = async (queryParams = {}) => {
    try {
        // Construction de l'URL avec les paramètres de requête
        let url = BASE_URL;
        if (Object.keys(queryParams).length > 0) {
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(queryParams)) {
                params.append(key, value);
            }
            url = `${url}?${params.toString()}`;
        }

        const response = await fetchWithAuthTask(url, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        throw error;
    }
};

/**
 * Récupère une tâche spécifique par son ID.
 * @param {string} taskId - L'ID de la tâche à récupérer.
 * @returns {Promise<object>} La tâche demandée.
 */
export const getTaskById = async (taskId) => {
    try {
        const response = await fetchWithAuthTask(`${BASE_URL}/${taskId}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la tâche ${taskId}:`, error);
        throw error;
    }
};

/**
 * Met à jour une tâche existante.
 * @param {string} taskId - L'ID de la tâche à mettre à jour.
 * @param {object} updatedData - Les nouvelles données de la tâche.
 * @returns {Promise<object>} La tâche mise à jour.
 */
export const updateTask = async (taskId, updatedData) => {
    try {
        const response = await fetchWithAuthTask(`${BASE_URL}/${taskId}`, {
            method: 'PUT', // ou 'PATCH' selon votre API
            body: JSON.stringify(updatedData),
        });
        console.log('Tâche mise à jour avec succès:', response);
        return response;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
        throw error;
    }
};

/**
 * Change le statut d'une tâche.
 * @param {string} taskId - L'ID de la tâche à mettre à jour.
 * @param {string} newStatus - Le nouveau statut (ex: 'EN_COURS', 'TERMINEE').
 * @param {boolean} [silentErrors=false] - Si true, retourne un objet avec {success: false, error} au lieu de lancer une erreur.
 * @returns {Promise<object>} La tâche mise à jour ou un objet d'erreur {success: false, error, originalTask}.
 */
export const updateTaskStatus = async (taskId, newStatus, silentErrors = false) => {
    try {
        const startTime = performance.now();
        
        const response = await fetchWithAuthTask(`${BASE_URL}/${taskId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
        });
        
        const endTime = performance.now();
        console.log(`Statut de la tâche ${taskId} mis à jour avec succès en ${Math.round(endTime - startTime)}ms:`, response);
        
        // Validation supplémentaire pour s'assurer que la réponse contient bien une tâche valide
        if (!response || !response.id) {
            const validationError = new Error('Réponse du serveur invalide après mise à jour du statut');
            if (silentErrors) {
                return { success: false, error: validationError };
            }
            throw validationError;
        }
        
        return response;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut de la tâche ${taskId}:`, error);
        
        if (silentErrors) {
            return { 
                success: false, 
                error: error,
                message: error.message || 'Erreur lors de la mise à jour du statut'
            };
        }
        
        throw error;
    }
};

/**
 * Supprime une tâche.
 * @param {string} taskId - L'ID de la tâche à supprimer.
 * @returns {Promise<void>} Confirmation de suppression.
 */
export const deleteTask = async (taskId) => {
    try {
        await fetchWithAuthTask(`${BASE_URL}/${taskId}`, {
            method: 'DELETE',
        });
        console.log(`Tâche ${taskId} supprimée avec succès`);
        return { success: true };
    } catch (error) {
        console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
        throw error;
    }
};

/**
 * Assigne une tâche à un ou plusieurs utilisateurs.
 * @param {string} taskId - L'ID de la tâche à assigner.
 * @param {Array<string>} userIds - Tableau d'IDs des utilisateurs à qui assigner la tâche.
 * @returns {Promise<object>} Résultat de l'opération d'assignation.
 */
export const assignTask = async (taskId, userIds) => {
    try {
        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new Error('Vous devez fournir au moins un utilisateur pour l\'assignation.');
        }

        const response = await fetchWithAuthTask(`${BASE_URL}/${taskId}/assign`, {
            method: 'POST',
            body: JSON.stringify({ userIds }),
        });
        console.log(`Tâche ${taskId} assignée avec succès aux utilisateurs:`, userIds);
        return response;
    } catch (error) {
        console.error(`Erreur lors de l'assignation de la tâche ${taskId}:`, error);
        throw error;
    }
};

/**
 * Récupère la liste des utilisateurs assignés à une tâche spécifique.
 * @param {string} taskId - L'ID de la tâche.
 * @returns {Promise<Array>} Liste des utilisateurs assignés à la tâche.
 */
export const getTaskAssignees = async (taskId) => {
    try {
        const response = await fetchWithAuthTask(`${BASE_URL}/${taskId}/assignees`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error(`Erreur lors de la récupération des assignés pour la tâche ${taskId}:`, error);
        throw error;
    }
};


/**
 * Récupère les statistiques des tâches de l'utilisateur.
 * @returns {Promise<object>} Statistiques des tâches (nombre par statut, priorité, etc.).
 */
export const getTaskStats = async () => {
    try {
        const response = await fetchWithAuthTask(`${BASE_URL}/stats`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des tâches:', error);
        throw error;
    }
};
