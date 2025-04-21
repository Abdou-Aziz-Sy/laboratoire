import axios from 'axios';
const API_URL = '/api/auth/'; // à Ajustez

/**
 * Enregistre un nouvel utilisateur.
 * @param {object} userData - Données utilisateur { username, email, password }
 * @returns {Promise<object>} - La réponse de l'API backend
 */
const register = async (userData) => {
  // Note : axios lance une erreur pour les status >= 400,
  // donc le .catch dans le composant gérera les erreurs HTTP.
  const response = await axios.post(API_URL + 'register', userData);
  return response.data; // Retourne les données de la réponse (peut être vide ou un message de succès)
};

// Ajoutez ici les fonctions pour login, logout, etc. plus tard
// const login = async (credentials) => { ... };

const authService = {
  register,
  // login,
};

export default authService;