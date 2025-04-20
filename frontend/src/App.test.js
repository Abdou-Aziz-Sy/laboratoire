import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App'; 

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  Routes: ({ children }) => <div>{children}</div>, // Mock simple pour Routes
  Route: ({ element }) => element, // Mock simple pour Route, rend l'élément passé
}));

test('renders navigation links', () => {
  render(<App />); // Rend le composant App avec le routeur moqué

  const homeLink = screen.getByText(/Accueil/i);
  expect(homeLink).toBeInTheDocument();

  const registerLink = screen.getByText(/Inscription/i);
  expect(registerLink).toBeInTheDocument();

  const loginLink = screen.getByText(/Connexion/i);
  expect(loginLink).toBeInTheDocument();

});
