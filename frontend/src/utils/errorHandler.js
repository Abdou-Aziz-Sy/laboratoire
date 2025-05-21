// --- fichier: frontend/src/utils/errorHandler.js ---

/**
 * Fonction utilitaire pour gu00e9rer les erreurs de l'application
 * @param {Error} error - L'erreur u00e0 gu00e9rer
 * @param {Function} toast - Fonction de notification (issue du contexte toast)
 * @returns {Object} - Informations structuru00e9es sur l'erreur
 */
export const handleApiError = (error, toast) => {
  // Erreur provenant de l'API avec message du00e9taillu00e9
  if (error.response && error.response.data && error.response.data.message) {
    const errorMessage = error.response.data.message;
    if (toast) toast.error(errorMessage);
    return {
      message: errorMessage,
      status: error.response.status,
      type: 'api',
      details: error.response.data
    };
  }
  
  // Erreur de ru00e9seau (pas de connexion au serveur)
  if (error.request && !error.response) {
    const message = 'Impossible de contacter le serveur. Vu00e9rifiez votre connexion internet.';
    if (toast) toast.error(message);
    return {
      message,
      type: 'network',
      details: error.request
    };
  }
  
  // Erreur gu00e9nu00e9rique
  const message = error.message || 'Une erreur inattendue est survenue';
  if (toast) toast.error(message);
  
  return {
    message,
    type: 'unknown',
    details: error
  };
};

/**
 * Gu00e9nu00e8re un message d'erreur explicite pour les erreurs de validation
 * @param {Object} validationErrors - Objet contenant les erreurs de validation
 * @returns {string} - Message d'erreur formatu00e9
 */
export const formatValidationErrors = (validationErrors) => {
  if (!validationErrors || Object.keys(validationErrors).length === 0) {
    return 'Erreur de validation des donnu00e9es';
  }
  
  // Construction d'un message d'erreur plus du00e9taillu00e9
  return Object.values(validationErrors)
    .filter(error => error) // Filtrer les valeurs null/undefined
    .join('\n');
};

/**
 * Construit un message de confirmation adaptu00e9 au type d'action
 * @param {string} actionType - Type d'action (create, update, delete, etc.)
 * @param {string} itemType - Type d'u00e9lu00e9ment concernu00e9 (tu00e2che, projet, etc.)
 * @param {string} itemName - Nom ou identifiant de l'u00e9lu00e9ment (optionnel)
 * @returns {string} - Message de confirmation formatu00e9
 */
export const getSuccessMessage = (actionType, itemType, itemName = '') => {
  const itemDisplay = itemName ? ` "${itemName}"` : '';
  
  switch (actionType.toLowerCase()) {
    case 'create':
      return `${itemType}${itemDisplay} cru00e9u00e9(e) avec succu00e8s`;
    case 'update':
      return `${itemType}${itemDisplay} mis(e) u00e0 jour avec succu00e8s`;
    case 'delete':
      return `${itemType}${itemDisplay} supprimu00e9(e) avec succu00e8s`;
    case 'status':
      return `Statut de ${itemType}${itemDisplay} modifiu00e9 avec succu00e8s`;
    default:
      return `Opu00e9ration sur ${itemType}${itemDisplay} effectuu00e9e avec succu00e8s`;
  }
};
