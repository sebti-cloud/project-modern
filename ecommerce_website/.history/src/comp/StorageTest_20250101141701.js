import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const StorageTest = () => {
  useEffect(() => {
    console.log('Début du test de stockage');
    
    // Vérification de `localStorage`
    const token = localStorage.getItem('token');
    console.log('Token dans localStorage:', token);

    // Vérification de `sessionStorage`
    const sessionData = sessionStorage.getItem('sessionData');
    console.log('Données dans sessionStorage:', sessionData);

    // Vérification des cookies
    console.log('Cookies:', document.cookie);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Token décodé:', decodedToken);
      } catch (err) {
        console.error('Erreur de décodage du token:', err);
      }
    }
  }, []);

  return (
    <div>
      <h1>Test de Stockage</h1>
      <p>Vérifiez la console pour les journaux de stockage.</p>
    </div>
  );
};

export default StorageTest;
