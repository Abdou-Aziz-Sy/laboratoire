// --- fichier: frontend/src/components/Auth/LoginForm.js ---
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { InputField } from '../common/InputField'; // Assurez l'import nommé
import { Button } from '../common/Button';       // Assurez l'import nommé
import { login } from '../../api/authService';
import { useAuth } from '../../context/AuthContext'; // Importe le hook du contexte

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation(); // Pour la redirection après connexion
  const { loginContext } = useAuth(); // Récupère la fonction de mise à jour du contexte
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Détermine où rediriger après la connexion (page précédente ou accueil)
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null); // Réinitialise l'erreur à chaque soumission

    // Validation simple côté client
    if (!formData.email || !formData.password) {
      setApiError('Veuillez entrer votre email et votre mot de passe.');
      return;
    }

    setIsLoading(true);
    try {
      // Appel API - Attend { token: '...', user: {...} } en retour
      const responseData = await login(formData);

      // Met à jour le contexte (qui stockera le token et l'utilisateur)
      loginContext(responseData.user, responseData.token);

      setIsLoading(false);
      // Redirection vers la page d'origine ou la page d'accueil
      console.log(`Connexion réussie, redirection vers : ${from}`);
      navigate(from, { replace: true }); // 'replace' pour ne pas pouvoir revenir à /login

    } catch (error) {
      setIsLoading(false);
      // Affiche l'erreur renvoyée par l'API ou une erreur générique
      setApiError(error.message || "Email ou mot de passe incorrect."); // Message plus spécifique possible
      console.error("Erreur API Connexion:", error);
    }
  };

  return (
    // Utilise une div wrapper pour appliquer le style de la "carte"
    <div className={styles.loginFormContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
        <h2>Connexion</h2>

        {apiError && <div className={styles.apiError}>{apiError}</div>}

        <InputField
          label="Adresse Email"
          type="email"
          name="email"
          id="login-email" // ID unique pour l'accessibilité
          value={formData.email}
          onChange={handleChange}
          placeholder="exemple@domaine.com"
          // error={null} // Pourrait afficher une erreur de format si validé onBlur
          required
          disabled={isLoading}
        />

        <InputField
          label="Mot de passe"
          type="password"
          name="password"
          id="login-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          // error={null}
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
          variant="primary"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>

        {/* Liens vers d'autres pages d'authentification */}
        <div className={styles.formLinks}>
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
              <Link to="/register">Créer un compte</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;