import React from 'react';
import styles from './UserAvatar.module.css';

/**
 * Composant ru00e9utilisable pour afficher l'avatar d'un utilisateur avec son nom
 * @param {Object} user - Donnu00e9es de l'utilisateur
 * @param {string} size - Taille de l'avatar ('small', 'medium', 'large')
 * @param {boolean} showName - Indique si le nom doit u00eatre affichu00e9
 * @param {Function} onClick - Fonction appelu00e9e au clic sur l'avatar
 */
const UserAvatar = ({ user, size = 'medium', showName = true, onClick }) => {
  // Si aucun utilisateur n'est fourni, on retourne null
  if (!user) return null;

  // Gu00e9nu00e8re les initiales de l'utilisateur u00e0 partir de son nom
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Gu00e9nu00e8re une couleur de fond unique basu00e9e sur l'ID de l'utilisateur
  const getBackgroundColor = (userId) => {
    if (!userId) return '#333333';
    
    // Utilise l'ID pour gu00e9nu00e9rer une teinte de la palette de couleurs du thu00e8me
    const hue = parseInt(userId.substring(0, 5), 16) % 360;
    return `hsl(${hue}, 70%, 30%)`;
  };

  return (
    <div 
      className={`${styles.avatarContainer} ${styles[size]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      title={user.name || 'Utilisateur'}
    >
      {user.avatarUrl ? (
        <img 
          src={user.avatarUrl} 
          alt={user.name || 'Avatar'} 
          className={styles.avatarImage} 
        />
      ) : (
        <div 
          className={styles.avatarInitials}
          style={{ backgroundColor: getBackgroundColor(user.id) }}
        >
          {getInitials(user.name)}
        </div>
      )}
      
      {showName && <span className={styles.userName}>{user.name}</span>}
    </div>
  );
};

export default UserAvatar;
