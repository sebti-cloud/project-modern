/*import React, { useState } from 'react';
import './delivery.css';

const Delivery = ({ trackOrder }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrackOrder = async () => {
    const info = await trackOrder(trackingNumber);
    setTrackingInfo(info);
  };

  return (
    <div className="delivery">
      <div className="banner">
        <h2>Delivery Information</h2>
        <p>Find out everything about our delivery options and tracking your order.</p>
      </div>
      <div className="options">
        <h3>Delivery Options</h3>
        <ul>
          <li>
            <h4>Standard Delivery</h4>
            <p>Delivery within 5-7 business days.</p>
          </li>
          <li>
            <h4>Express Delivery</h4>
            <p>Delivery within 2-3 business days.</p>
          </li>
          <li>
            <h4>Next Day Delivery</h4>
            <p>Delivery by the next business day.</p>
          </li>
        </ul>
      </div>
      <div className="tracking">
        <h3>Track Your Order</h3>
        <input
          type="text"
          placeholder="Enter your tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button onClick={handleTrackOrder}>Track</button>
        {trackingInfo && (
          <div className="tracking-info">
            <h4>Tracking Information</h4>
            <p>{trackingInfo}</p>
          </div>
        )}
      </div>
      <div className="faq">
        <h3>Frequently Asked Questions</h3>
        <ul>
          <li>
            <h4>What are the delivery charges?</h4>
            <p>Delivery charges vary based on the chosen delivery option and the location.</p>
          </li>
          <li>
            <h4>Can I change my delivery address?</h4>
            <p>Yes, you can change your delivery address before the order is dispatched.</p>
          </li>
          <li>
            <h4>What should I do if my order is delayed?</h4>
            <p>If your order is delayed, please contact our support team for assistance.</p>
          </li>
        </ul>
      </div>
      <div className="contact">
        <h3>Need Help?</h3>
        <p>If you have any questions about delivery, please contact our support team at <a href="mailto:TechyoSupport@gmail.com">TechyoSupport@gmail.com</a> or call us at <a>0523746094</a>.</p>
      </div>
    </div>
  );
};

export default Delivery;
*/
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './delivery.css';

const Delivery = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrackOrder = async () => {
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
      setTrackingInfo({ error: 'Tracking number not found' });
    }
  };
  

  return (
    <div className="delivery">
      <div className="banner">
        <h2>Informations de Livraison</h2>
        <p>Découvrez tout sur nos options de livraison et suivez votre commande.</p>
      </div>
      <div className="options">
        <h3>Options de Livraison</h3>
        <ul>
          <li>
            <h4>Livraison Standard</h4>
            <p>Livraison sous 5 à 7 jours ouvrables.</p>
          </li>
          <li>
            <h4>Livraison Express</h4>
            <p>Livraison sous 2 à 3 jours ouvrables.</p>
          </li>
          <li>
            <h4>Livraison le Jour Suivant</h4>
            <p>Livraison le jour ouvrable suivant.</p>
          </li>
        </ul>
      </div>
      <div className="tracking">
        <h3>Suivez Votre Commande</h3>
        <input
          type="text"
          placeholder="Entrez votre numéro de suivi"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <Link to={`/track-order/${trackingNumber}`}>
          <button onClick={handleTrackOrder}>Suivre</button>
        </Link>
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
      <div className="faq">
        <h3>Questions Fréquemment Posées</h3>
        <ul>
          <li>
            <h4>Quels sont les frais de livraison ?</h4>
            <p>Les frais de livraison varient en fonction de l'option de livraison choisie et de la localisation.</p>
          </li>
          <li>
            <h4>Puis-je changer mon adresse de livraison ?</h4>
            <p>Oui, vous pouvez changer votre adresse de livraison avant l'expédition de la commande.</p>
          </li>
          <li>
            <h4>Que faire si ma commande est retardée ?</h4>
            <p>Si votre commande est retardée, veuillez contacter notre équipe de support pour obtenir de l'aide.</p>
          </li>
        </ul>
      </div>
      <div className="contact">
        <h3>Besoin d'Aide ?</h3>
        <p>Si vous avez des questions sur la livraison, veuillez contacter notre équipe de support à <a href="mailto:TechyoSupport@gmail.com">TechyoSupport@gmail.com</a> ou appelez-nous au <a href="tel:0523746094">0523746094</a>.</p>
      </div>
    </div>
  );
};

export default Delivery;
