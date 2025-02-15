import React from 'react';

const TrackOrder = () => {
  return (
    <div className="track-order">
      <h1>Suivi de Commande</h1>
      <p>Suivez l'état de votre commande ici. Entrez votre numéro de commande pour voir les détails de suivi.</p>
      <form>
        <label>
          Numéro de commande:
          <input type="text" name="orderNumber" />
        </label>
        <button type="submit">Suivre</button>
      </form>
    </div>
  );
};

export default TrackOrder;
