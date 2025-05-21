// --- fichier: frontend/src/components/Auth/LoginForm.js ---
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../common/InputField';
import styles from './LoginForm.module.css';

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginContext } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Détermine où rediriger après la connexion
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
    setApiError(null);

    // Validation simple côté client
    if (!formData.email || !formData.password) {
      setApiError('Veuillez entrer votre email et votre mot de passe.');
      return;
    }

    setIsLoading(true);
    try {
      // Appel API
      const responseData = await login(formData);

      // Met à jour le contexte
      loginContext(responseData.user, responseData.token);

      setIsLoading(false);
      navigate(from, { replace: true });

    } catch (error) {
      setIsLoading(false);
      setApiError(error.message || "Email ou mot de passe incorrect.");
      console.error("Erreur API Connexion:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
      <h2 className={styles.formTitle}>Connexion</h2>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <div className={styles.inputGroup}>
        <InputField
          label="Adresse Email"
          type="email"
          name="email"
          id="login-email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemple@domaine.com"
          required
          disabled={isLoading}
          className={styles.formInput}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputField
          label="Mot de passe"
          type="password"
          name="password"
          id="login-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
          disabled={isLoading}
          className={styles.formInput}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner}>
            <span className={styles.spinner}></span>
            <span>Connexion...</span>
          </div>
        ) : (
          "Se connecter"
        )}
      </button>

      {/* Liens vers d'autres pages d'authentification */}
      <div className={styles.formLinks}>
        <Link to="/forgot-password" className={styles.forgotLink}>Mot de passe oublié ?</Link>
        <Link to="/register" className={styles.registerLink}>Créer un compte</Link>
      </div>
    </form>
  );
}

export default LoginForm;