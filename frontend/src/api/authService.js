// --- fichier: frontend/src/api/authService.js ---

// Adapter ces URLs à la configuration de votre backend
const BASE_URL = '/api/auth'; // Base pour les endpoints d'authentification
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
const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json', // Défaut pour les requêtes API
      ...options.headers, // Permet de surcharger ou ajouter des en-têtes
    };

    // Ajoute le token Bearer si existant et non explicitement ignoré
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });

      // Gestion des réponses non-OK
      if (!response.ok) {
          let errorData;
          try {
              // Tente de lire le message d'erreur du backend
              errorData = await response.json();
          } catch (e) {
              // Si le corps de l'erreur n'est pas JSON ou est vide
              errorData = { message: `Erreur ${response.status}: ${response.statusText}` };
          }
          // Lance une erreur avec le message (du backend si possible)
          throw new Error(errorData?.message || `Erreur ${response.status}`);
      }

       // Gère le cas spécifique du statut 204 No Content (succès sans corps)
       if (response.status === 204) {
          return null; // Ou { success: true } selon la convention souhaitée
       }

       // Tente de parser la réponse en JSON
       // Gère le cas où l'API renvoie du succès mais pas de JSON (ex: simple texte ou vide)
       const contentType = response.headers.get("content-type");
       if (contentType && contentType.includes("application/json")) {
           return response.json();
       } else {
           // Si pas JSON, on peut retourner une indication de succès ou le texte brut
           // console.warn(`Réponse non-JSON reçue de ${url}`);
           // return { success: true }; // Ou ce qui est le plus logique
           return await response.text(); // Ou retourner le texte brut
       }

    } catch (error) {
        console.error(`Erreur Fetch pour ${url}:`, error);
        // Remonte l'erreur pour qu'elle soit gérée par l'appelant
        // On pourrait ajouter une couche de gestion d'erreur plus spécifique ici
        throw error;
    }
};


// --- Fonctions Spécifiques à l'API d'Authentification ---

/**
 * Enregistre un nouvel utilisateur.
 * @param {object} userData - Données utilisateur (nomComplet, email, password).
 * @returns {Promise<any>} Réponse de l'API (peut être vide ou contenir des infos).
 */
export const register = async (userData) => {
  return fetchWithAuth(`${BASE_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true, // Pas besoin d'être authentifié pour s'inscrire
  });
};

/**
 * Connecte un utilisateur existant.
 * Attend une réponse contenant { token: '...', user: {...} }.
 * @param {object} credentials - Identifiants ({ email, password }).
 * @returns {Promise<{token: string, user: object}>} Données de connexion.
 */
export const login = async (credentials) => {
    console.log("Tentative de connexion avec:", credentials);
    // L'endpoint est souvent /authenticate avec Spring Security ou /login
    const data = await fetchWithAuth(`${BASE_URL}/authenticate`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true, // Pas besoin d'être authentifié pour se connecter
    });
    console.log("Réponse API Login:", data);

    // Vérification plus robuste de la réponse attendue
    if (!data || typeof data.token !== 'string' || !data.token || typeof data.user !== 'object') {
        console.error("Réponse invalide du serveur lors de la connexion:", data);
        throw new Error("Réponse invalide du serveur lors de la connexion. Token ou utilisateur manquant.");
    }
    return data; // Retourne { token, user }
};

/**
 * Récupère les informations de l'utilisateur actuellement connecté.
 * Nécessite un token valide dans les en-têtes (géré par fetchWithAuth).
 * @returns {Promise<object>} Les données de l'utilisateur.
 */
export const getCurrentUser = async () => {
    // L'endpoint dépend de votre configuration backend (ex: /users/me, /auth/profile)
    return fetchWithAuth(`${API_BASE_URL}/users/me`, { // Adaptez cet endpoint
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