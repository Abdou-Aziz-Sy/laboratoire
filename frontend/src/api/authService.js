// --- fichier: frontend/src/api/authService.js ---

// Adapter ces URLs à la configuration de votre backend
const BASE_URL = 'http://localhost:8081/api/users'; // Base pour les endpoints d'authentification
const API_BASE_URL = '/api'; // Base pour les autres endpoints API (ex: /api/users/me)

// --- Gestion du Token ---

const AUTH_TOKEN_KEY = 'authToken'; // Clé utilisée dans localStorage

/**
 * Stocke le token JWT dans localStorage.
 * @param {string|null} token - Le token JWT à stocker, ou null pour le supprimer.
 */
export const storeAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    // S'assure qu'on ne stocke pas "null" ou "undefined" comme chaîne
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/**
 * Récupère le token JWT depuis localStorage.
 * @returns {string|null} Le token JWT ou null s'il n'existe pas.
 */
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Supprime le token JWT de localStorage.
 */
export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// --- Fonction d'aide pour les requêtes Fetch ---

/**
 * Effectue une requête fetch en ajoutant potentiellement le token d'authentification.
 * Gère aussi les erreurs de base et le parsing JSON.
 * @param {string} url - L'URL de l'API à appeler.
 * @param {object} options - Options de Fetch (method, body, headers, etc.).
 * @param {boolean} [options.skipAuth=false] - Si true, n'ajoute pas le header Authorization.
 * @returns {Promise<any>} La réponse JSON parsée ou null si réponse 204.
 * @throws {Error} Lance une erreur en cas de réponse non-OK ou d'échec du parsing.
 */
export async function fetchWithAuth(url, options = {}) {
    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
    };

    // ❗ Exclure les URLs publiques comme /login et /register
    if (!url.includes("/login") && !url.includes("/register")) {
        const token = localStorage.getItem("authToken"); // Utilise la clé authToken pour récupérer le token
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Erreur ${response.status}: ${message}`);
    }

    // Vérifie si la réponse est au format JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    } else {
        return response.text(); // Retourne le texte brut si ce n'est pas du JSON
    }
}

// --- Fonctions Spécifiques à l'API d'Authentification ---

/**
 * Enregistre un nouvel utilisateur.
 * @param {object} userData - Données utilisateur (nomComplet, email, password).
 * @returns {Promise<any>}
 */
export const register = async (userData) => {
    try {
        const response = await fetchWithAuth(`${BASE_URL}/register`, {
            method: 'POST',
            body: JSON.stringify(userData),
            skipAuth: true,
        });
        console.log("Inscription réussie :", response);
        return response;
    } catch (error) {
        if (error.message.includes('409')) {
            console.error("Erreur : Cet email est déjà utilisé.");
            throw new Error("Cet email est déjà utilisé.");
        } else {
            console.error("Erreur lors de l'inscription :", error.message);
            throw error;
        }
    }
};

/**
 * Connecte un utilisateur existant.
 * Attend une réponse contenant { token: '...', user: {...} }.
 * @param {object} credentials - Identifiants ({ email, password }).
 * @returns {Promise<{token: string, user: object}>} Données de connexion.
 */
export const login = async (credentials) => {
    console.log("Tentative de connexion avec :", credentials);
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Erreur serveur ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        console.log("Réponse API Login :", data);
        return data;
    } catch (error) {
        console.error("Erreur API Connexion :", error);
        throw new Error("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    }
};

/**
 * Récupère les informations de l'utilisateur actuellement connecté.
 * Nécessite un token valide dans les en-têtes (géré par fetchWithAuth).
 * @returns {Promise<object>} Les données de l'utilisateur.
 */
export const getCurrentUser = async () => {
    // L'endpoint dépend de votre configuration backend (ex: /users/me, /auth/profile)
    return fetchWithAuth(`${API_BASE_URL}/users`, { // Adaptez cet endpoint
        method: 'GET',
    });
};

/**
 * Demande une réinitialisation de mot de passe pour l'email donné.
 * @param {string} email - L'adresse email de l'utilisateur.
 * @returns {Promise<{success: boolean}>} Confirmation générique de succès.
 */
export const forgotPassword = async (email) => {
  console.log("Demande de réinitialisation pour:", email);
   try {
     // Note: fetch simple car skipAuth: true par défaut pour les POST sans token
     const response = await fetch(`${BASE_URL}/forgot-password`, { // Assurez l'endpoint
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ email }),
     });

     if (!response.ok) {
       let errorData;
       try {
         errorData = await response.json();
       } catch (e) {
         errorData = { message: `Erreur serveur ${response.status}` };
       }
       throw new Error(errorData?.message || `Erreur ${response.status}`);
     }
     // Le backend ne doit rien révéler, on retourne juste un succès générique
     return { success: true };

   } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error);
      // Remonte une erreur générique pour ne pas révéler si l'email existe
      throw new Error("Une erreur s'est produite lors de la demande. Veuillez réessayer.");
   }
};

/**
 * Réinitialise le mot de passe en utilisant un token spécifique.
 * @param {string} token - Le token de réinitialisation reçu (souvent dans l'URL).
 * @param {string} newPassword - Le nouveau mot de passe.
 * @returns {Promise<any>} Réponse de succès de l'API.
 */
export const resetPassword = async (token, newPassword) => {
    console.log("Tentative de réinitialisation avec token:", token ? 'Présent' : 'Absent');
    return fetchWithAuth(`${BASE_URL}/reset-password`, { // Assurez l'endpoint
        method: 'POST',
        body: JSON.stringify({ token, newPassword }), // Le backend attend token et newPassword
        skipAuth: true,
    });
};