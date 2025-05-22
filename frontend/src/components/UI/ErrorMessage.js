// --- fichier: frontend/src/components/ui/ErrorMessage.js ---
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Composant d'affichage d'erreur avec option de retry
 * S'intègre au design moderne du dashboard avec accents orange
 */
const ErrorMessage = ({ 
  message = 'Une erreur est survenue.', 
  retryFn = null, 
  retryText = 'Réessayer',
  icon = true
}) => {
  return (
    <ErrorContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <ErrorIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="currentColor"/>
            <path d="M12 14C11.4477 14 11 13.5523 11 13V8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V13C13 13.5523 12.5523 14 12 14Z" fill="currentColor"/>
            <path d="M12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17Z" fill="currentColor"/>
          </svg>
        </ErrorIcon>
      )}
      <ErrorContent>
        <ErrorText>{message}</ErrorText>
        {retryFn && (
          <RetryButton 
            onClick={retryFn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {retryText}
          </RetryButton>
        )}
      </ErrorContent>
    </ErrorContainer>
  );
};

// Styled components
const ErrorContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin: 15px 0;
  background: rgba(30, 30, 40, 0.8);
  border-left: 4px solid rgba(253, 126, 20, 0.8);
  border-radius: 4px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  color: white;
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(253, 126, 20, 0.8);
  margin-right: 15px;
  flex-shrink: 0;
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ErrorText = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

const RetryButton = styled(motion.button)`
  align-self: flex-start;
  background: linear-gradient(135deg, rgba(253, 126, 20, 0.8), rgba(253, 126, 20, 0.6));
  border: none;
  border-radius: 4px;
  color: white;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%);
    transform: rotate(30deg);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
    transition: transform 0.8s ease, opacity 0.3s ease;
    transform: rotate(30deg) translate(90%, -20%);
  }
`;

export default ErrorMessage;
