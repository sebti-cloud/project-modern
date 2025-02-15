import React, { useEffect } from 'react';

const AuthTest = () => {
  useEffect(() => {
    console.log('Début du test d\'authentification');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Aucun token trouvé dans localStorage');
    } else {
      console.log('Token trouvé dans localStorage:', token);
      const currentTime = Date.now() / 1000;
      console.log('Current time:', currentTime);
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
