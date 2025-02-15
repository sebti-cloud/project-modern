import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TrackOrder.css';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [trackingInfo, setTrackingInfo] = useState(null); // Ajouter l'état trackingInfo
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState(null);
  const { trackingNumber: trackingNumberParam } = useParams();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);

  useEffect(() => {
    if (trackingNumberParam) {
      setTrackingNumber(trackingNumberParam);
      fetchTrackingInfo(trackingNumberParam);
    }
  }, [trackingNumberParam]);

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  const fetchTrackingInfo = async (trackingNumber) => {
    console.log('Fetching tracking info for:', trackingNumber);
    try {
      const response = await fetch(`http://localhost:3001/api/track-order/${trackingNumber}`);
      if (!response.ok) {
        throw new Error('Tracking number not found');
      }
      const data = await response.json();
      setTrackingInfo(data);
    } catch (error) {
      console.error('Erreur lors du suivi de la commande :', error);
      setTrackingInfo(null);
    }
  };

  const handleTrackingNumberSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber) {
      navigate(`/track-order/${trackingNumber}`);
    }
  };

  return (
    <div className="main">
      <div className="head">
        <p className="head_1">Suivi de Commande</p>
        <p className="head_2">Suivez votre commande étape par étape</p>
      </div>
      {!trackingNumberParam && (
        <form onSubmit={handleTrackingNumberSubmit}>
          <input
            type="text"
            placeholder="Entrez votre numéro de suivi"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button type="submit">Suivre</button>
        </form>
      )}
      {trackingInfo && (
        <div>
          <p><b>Nom du Client :</b> {trackingInfo.user_name}</p>
          <p><b>Adresse :</b> {trackingInfo.user_address ? trackingInfo.user_address : 'Non disponible'}</p>
          <p><b>Status :</b> {trackingInfo.status}</p>
          <p><b>Date :</b> {new Date(trackingInfo.updated_at).toLocaleString()}</p>
          <p><b>Paiement :</b> {trackingInfo.payment_method}</p>
          <p><b>Prix Total :</b> {trackingInfo.total_price} MAD</p>
        </div>
      )}

      {/* Icône fixe du panier */}
      {cartCount > 0 && (
        <Link to="/cart">
          <div className="cart-icon">
            <AiOutlineShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default TrackOrder;
