import React, { useState } from 'react';
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
        <p>If you have any questions about delivery, please contact our support team at <a href="mailto:TechyoSupport@gmail.com">support@example.com</a> or call us at (123) 456-7890.</p>
      </div>
    </div>
  );
};

export default Delivery;
