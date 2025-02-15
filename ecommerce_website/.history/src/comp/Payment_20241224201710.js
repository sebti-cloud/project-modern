import React from 'react';

const Payment = () => {
  return (
    <div className="payment">
      <h1>Paiement</h1>
      <p>Gérez vos options de paiement ici. Choisissez votre méthode de paiement préférée et assurez-vous que vos informations sont à jour.</p>
      <form>
        <label>
          Numéro de carte:
          <input type="text" name="cardNumber" />
        </label>
        <label>
          Date d'expiration:
          <input type="text" name="expiryDate" />
        </label>
        <label>
          CVC:
          <input type="text" name="cvc" />
        </label>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default Payment;
