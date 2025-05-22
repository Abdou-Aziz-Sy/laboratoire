// --- fichier: frontend/src/components/ui/LoadingSpinner.js ---
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

/**
 * Composant d'indicateur de chargement avec animation fluide
 * Utilise Framer Motion pour les animations et styled-components pour le style
 */
const LoadingSpinner = ({ size = 40, color = 'rgba(253, 126, 20, 0.6)', text = 'Chargement...' }) => {
  // Variants pour l'animation du spinner
  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  // Variants pour l'animation du texte
  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  return (
    <SpinnerContainer>
      <motion.div
        initial={{ rotate: 0 }}
        animate="animate"
        variants={containerVariants}
      >
        <SpinnerCircle size={size} color={color} />
      </motion.div>
      {text && (
        <SpinnerText
          initial={{ opacity: 0.5 }}
          animate="animate"
          variants={textVariants}
        >
          {text}
        </SpinnerText>
      )}
    </SpinnerContainer>
  );
};

// Styled components
const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SpinnerCircle = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid ${props => props.color};
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(253, 126, 20, 0.4);
  backdrop-filter: blur(5px);
`;

const SpinnerText = styled(motion.div)`
  margin-top: 15px;
  font-size: 14px;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;

export default LoadingSpinner;
