import React, { useState } from 'react';

const OrderConfirmation = ({ trackingNumber }) => (
  <div>
    <h2>Commande Confirmée</h2>
    <p>Merci pour votre commande. Votre numéro de suivi est :</p>
    <h3>{trackingNumber}</h3>
  </div>
);
const Checkout = ({ cartItems, userInformation, setCart, setCartCount }) => {
  const [trackingNumber, setTrackingNumber] = useState(null);
  const [address, setAddress] = useState('');

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cartItems, userInfo: { ...userInformation, address } }),
      });
      const data = await response.json();
      setTrackingNumber(data.trackingNumber);
      
      // Réinitialiser le panier et le compteur de panier
      setCart([]);
      setCartCount(0);
      localStorage.removeItem('cart');
      localStorage.setItem('cartCount', 0);
      
    } catch (error) {
      console.error('Erreur lors du checkout :', error);
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Entrez votre adresse"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleCheckout}>Passer la Commande</button>
      {trackingNumber && <OrderConfirmation trackingNumber={trackingNumber} />}
    </div>
  );
};

export default Checkout;
