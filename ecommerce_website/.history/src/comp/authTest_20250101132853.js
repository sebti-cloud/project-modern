import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthTest = () => {
  useEffect(() => {
    console.log('Début du test d\'authentification');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Aucun token trouvé dans localStorage');
    } else {
      console.log('Token trouvé dans localStorage:', token);
      try {
        console.log('Début du décodage du token');
        const decodedToken = jwtDecode(token);
        console.log('Token décodé:', decodedToken);
        const currentTime = Date.now() / 1000;
        console.log('Current time:', currentTime);
        console.log('Token expiration time:', decodedToken.exp);
        
        if (decodedToken.exp < currentTime) {
          console.log('Token expiré');
          // Ajouter ici la logique de redirection vers la page de login
        } else {
          console.log('Token valide');
          // Ajouter ici la logique pour l'utilisateur authentifié
        }
      } catch (err) {
        console.error('Erreur de décodage:', err);
      }
    }

    const isAuthenticatedCookie = document.cookie.includes('auth0.HnvSMWYPeHG9quXZuVtWKMzNKfmQ84GT.is.authenticated=true') ||
                                  document.cookie.includes('_legacy_auth0.HnvSMWYPeHG9quXZuVtWKMzNKfmQ84GT.is.authenticated=true');
    
    if (isAuthenticatedCookie) {
      console.log('Utilisateur authentifié via cookie');
    } else {
      console.log('Utilisateur non authentifié via cookie');
    }
  }, []);

  return (
    <div>
      <h1>Auth Test</h1>
      <p>Vérifiez la console pour les journaux d'authentification.</p>
    </div>
  );
};

export default AuthTest;
