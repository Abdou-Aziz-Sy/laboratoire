// --- fichier: frontend/src/api/userService.js ---

// Base URL pour les endpoints liés aux utilisateurs
const BASE_URL = 'http://localhost:8081/api/users';

/**
 * Effectue une requête fetch en ajoutant le token d'authentification.
 * Gère les erreurs de base et le parsing JSON.
 * @param {string} url - L'URL de l'API à appeler.
 * @param {object} options - Options de Fetch (method, body, headers, etc.).
 * @returns {Promise<any>} La réponse JSON parsée.
 * @throws {Error} Lance une erreur en cas de réponse non-OK ou d'échec du parsing.
 */
async function fetchWithAuthUser(url, options = {}) {
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
 * Récupère la liste des utilisateurs disponibles pour l'assignation.
 * @param {object} queryParams - Paramètres de requête optionnels (filtres, pagination, etc.)
 * @returns {Promise<Array>} Liste des utilisateurs.
 */
export const getUsers = async (queryParams = {}) => {
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

        const response = await fetchWithAuthUser(url, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};

/**
 * Recherche des utilisateurs selon un terme de recherche.
 * @param {string} query - Terme de recherche (nom, email, etc.)
 * @returns {Promise<Array>} Liste des utilisateurs correspondant à la recherche.
 */
export const searchUsers = async (query) => {
    try {
        if (!query || query.trim() === '') {
            return getUsers(); // Si la requête est vide, retourne tous les utilisateurs
        }
        
        const params = new URLSearchParams();
        params.append('search', query.trim());
        
        const response = await fetchWithAuthUser(`${BASE_URL}/search?${params.toString()}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error(`Erreur lors de la recherche d'utilisateurs avec la requête "${query}":`, error);
        throw error;
    }
};
