import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const TokenChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Token décodé:', decodedToken);
        const currentTime = Date.now() / 1000;
        console.log('Current time:', currentTime);
        console.log('Token expiration time:', decodedToken.exp);
        if (decodedToken.exp < currentTime) {
          console.log('Token expiré');
          navigate('/login');
        } else {
          console.log('Token valide');
        }
      } catch (err) {
        console.error('Erreur de décodage:', err);
        navigate('/login');
      }
    } else {
      console.log('Aucun token trouvé');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Token Checker</h1>
      <p>Vérifiez la console pour les journaux du token.</p>
    </div>
  );
};

export default TokenChecker;
