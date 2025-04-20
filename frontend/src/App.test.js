// frontend/src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation links', () => {
  render(<App />);

  const homeLink = screen.getByText(/Accueil/i);
  expect(homeLink).toBeInTheDocument();

  const registerLink = screen.getByText(/Inscription/i);
  expect(registerLink).toBeInTheDocument();

  const loginLink = screen.getByText(/Connexion/i);
  expect(loginLink).toBeInTheDocument();
});