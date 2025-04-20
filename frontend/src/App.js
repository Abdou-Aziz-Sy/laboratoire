// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// Ajoutez .js aux imports des pages
import RegistrationPage from './pages/RegistrationPage.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/register">Inscription</Link></li>
            <li><Link to="/login">Connexion</Link></li>
          </ul>
        </nav>

        <main>
          <Routes>
            {/* Les éléments restent les mêmes */}
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>

        <footer>
          <p>© 2024 Task Manager</p>
        </footer>
      </div>
    </Router>
  );
}

// IMPORTANT: Assurez-vous que les fichiers ./pages/HomePage.js et ./pages/LoginPage.js
// existent bien et exportent un composant React valide, comme indiqué
// dans la réponse précédente.

export default App;