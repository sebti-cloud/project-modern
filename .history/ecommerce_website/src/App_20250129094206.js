import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCartPlus, FaClipboardList, FaTruckLoading, FaMapMarkerAlt } from 'react-icons/fa';
import './TrackOrder.css';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState(null);
  const { trackingNumber: trackingNumberParam } = useParams();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0); // Initialiser à partir de localStorage

  useEffect(() => {
    if (trackingNumberParam) {
      setTrackingNumber(trackingNumberParam);
      fetchTrackingInfo(trackingNumberParam);
      const interval = setInterval(() => fetchTrackingInfo(trackingNumberParam), 10000);
      return () => clearInterval(interval);
    }
  }, [trackingNumberParam]);

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount); // Sauvegarder l'état du panier dans localStorage
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
      updateActiveStep(data.status);
    } catch (error) {
      console.error('Erreur lors du suivi de la commande :', error);
      setError('Tracking number not found');
      setTrackingInfo(null);
    }
  };

  const handleTrackingNumberSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber) {
      navigate(`/track-order/${trackingNumber}`);
    }
  };

  const updateActiveStep = (status) => {
    switch (status) {
      case 'pending':
        setActiveStep(1);
        break;
      case 'validated':
        setActiveStep(2);
        break;
      case 'shipped':
        setActiveStep(3);
        break;
      case 'delivered':
        setActiveStep(4);
        break;
      case 'cancelled':
        setActiveStep(5);
        break;
      default:
        setActiveStep(1);
        break;
    }
  };

  const calculateDeliveryFee = (address, totalPrice) => {
    if (!address) return 0;
    const city = address.toLowerCase();
    if (city.includes('casablanca')) {
      return totalPrice < 700 ? 25 : 0;
    } else {
      return totalPrice < 700 ? 40 : 0;
    }
  };

  return (
    <div className="main">
      <div className="head">
        <p className="head_1">Suivi de Commande <span>Progress Bar Animée</span></p>
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
        <>
          <ul>
            <li>
              <FaCartPlus className="icon" />
              <div className={`progress one ${activeStep >= 1 ? 'active' : ''}`}>
                <p>1</p>
                <i className="uil uil-check"></i>
              </div>
              <p className="text">Ajouté au Panier</p>
            </li>
            <li>
              <FaClipboardList className="icon" />
              <div className={`progress two ${activeStep >= 2 ? 'active' : ''}`}>
                <p>2</p>
                <i className="uil uil-check"></i>
              </div>
              <p className="text">Validée</p>
            </li>
            <li>
              <FaTruckLoading className="icon" />
              <div className={`progress three ${activeStep >= 3 ? 'active' : ''}`}>
                <p>3</p>
                <i className="uil uil-check"></i>
              </div>
              <p className="text">Expédiée</p>
            </li>
            <li>
              <FaMapMarkerAlt className="icon" />
              <div className={`progress four ${activeStep >= 4 ? 'active' : ''}`}>
                <p>4</p>
                <i className="uil uil-check"></i>
              </div>
              <p className="text">Commande Livrée</p>
            </li>
          </ul>
          <div className="tracking-info" style={{ backgroundColor: 'yellow' }}>
            <h4 style={{ textDecoration: 'underline' }}>Informations de Suivi</h4>
            {error ? (
              <p>{error}</p>
            ) : (
              <div>
                <p><b>Nom du Client :</b> {trackingInfo.user_name}</p>
                <p><b>Adresse :</b> {trackingInfo.user_address ? trackingInfo.user_address : 'Non disponible'}</p>
                <p><b>Status :</b> {trackingInfo.status}</p>
                <p><b>Date :</b> {new Date(trackingInfo.updated_at).toLocaleString()}</p>
                <p><b>Paiement :</b> {trackingInfo.payment_method}</p>
                <p><b>Prix Total :</b> {trackingInfo.total_price} MAD</p>
                <p><b>Frais de Livraison :</b> {calculateDeliveryFee(trackingInfo.user_address, trackingInfo.total_price)} MAD</p>
              </div>
            )}
          </div>
        </>
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
