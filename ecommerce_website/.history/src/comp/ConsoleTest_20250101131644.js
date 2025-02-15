import React, { useEffect } from 'react';

const ConsoleTest = () => {
  useEffect(() => {
    console.log('Test message: La console fonctionne');
  }, []);

  return (
    <div>
      <h1>Console Test</h1>
      <p>Vérifiez la console pour le message de test.</p>
    </div>
  );
};

export default ConsoleTest;
