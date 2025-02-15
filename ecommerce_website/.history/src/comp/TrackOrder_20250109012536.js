
/*import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCartPlus, FaClipboardList, FaCreditCard, FaTruckLoading, FaMapMarkerAlt } from 'react-icons/fa';
import './TrackOrder.css';

const TrackOrder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const { trackingNumber } = useParams();

  useEffect(() => {
    const fetchTrackingInfo = async () => {
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
        setTrackingInfo({ error: 'Tracking number not found' });
      }
    };
    
    fetchTrackingInfo();
  }, [trackingNumber]);

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

  return (
    <div className="main">
      <div className="head">
        <p className="head_1">Suivi de Commande <span>Progress Bar Animée</span></p>
        <p className="head_2">Suivez votre commande étape par étape</p>
      </div>
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
          <p className="text">Détails Remplis</p>
        </li>
        <li>
          <FaCreditCard className="icon" />
          <div className={`progress three ${activeStep >= 3 ? 'active' : ''}`}>
            <p>3</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Paiement Effectué</p>
        </li>
        <li>
          <FaTruckLoading className="icon" />
          <div className={`progress four ${activeStep >= 4 ? 'active' : ''}`}>
            <p>4</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Commande en Cours</p>
        </li>
        <li>
          <FaMapMarkerAlt className="icon" />
          <div className={`progress five ${activeStep >= 5 ? 'active' : ''}`}>
            <p>5</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Commande Arrivée</p>
        </li>
      </ul>
      {trackingInfo && (
        <div className="tracking-info">
          <h4>Informations de Suivi</h4>
          {trackingInfo.error ? (
            <p>{trackingInfo.error}</p>
          ) : (
            <div>
              <p>Status : {trackingInfo.status}</p>
              <p>Localisation : {trackingInfo.location}</p>
              <p>Date : {new Date(trackingInfo.updated_at).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;*/
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCartPlus, FaClipboardList, FaCreditCard, FaTruckLoading, FaMapMarkerAlt } from 'react-icons/fa';
import './TrackOrder.css';

const TrackOrder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const { trackingNumber } = useParams();

  useEffect(() => {
    const fetchTrackingInfo = async () => {
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
        setTrackingInfo({ error: 'Tracking number not found' });
      }
    };

    // Fetch tracking info initially
    fetchTrackingInfo();

    // Set up interval to fetch tracking info every 10 seconds
    const interval = setInterval(fetchTrackingInfo, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [trackingNumber]);

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

  return (
    <div className="main">
      <div className="head">
        <p className="head_1">Suivi de Commande <span>Progress Bar Animée</span></p>
        <p className="head_2">Suivez votre commande étape par étape</p>
      </div>
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
          <p className="text">Détails Remplis</p>
        </li>
        <li>
          <FaCreditCard className="icon" />
          <div className={`progress three ${activeStep >= 3 ? 'active' : ''}`}>
            <p>3</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Paiement Effectué</p>
        </li>
        <li>
          <FaTruckLoading className="icon" />
          <div className={`progress four ${activeStep >= 4 ? 'active' : ''}`}>
            <p>4</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Commande en Cours</p>
        </li>
        <li>
          <FaMapMarkerAlt className="icon" />
          <div className={`progress five ${activeStep >= 5 ? 'active' : ''}`}>
            <p>5</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Commande Arrivée</p>
        </li>
      </ul>
      {trackingInfo && (
        <div className="tracking-info">
          <h4>Informations de Suivi</h4>
          {trackingInfo.error ? (
            <p>{trackingInfo.error}</p>
          ) : (
            <div>
              <p>Status : {trackingInfo.status}</p>
              <p>Localisation : {trackingInfo.location}</p>
              <p>Date : {new Date(trackingInfo.updated_at).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
