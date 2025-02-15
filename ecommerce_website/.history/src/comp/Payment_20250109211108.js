import React, { useState } from 'react';
import './payment.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = ({ amount }) => {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/payment', {
        token: cardNumber,
        amount: amount * 100, // Montant en cents
      });

      if (response.data.success) {
        alert('Paiement réussi');
        navigate('/order-confirmation');
      } else {
        alert('Échec du paiement');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Erreur lors du traitement du paiement');
    }
  };

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-wrapper">
          <div className="payment-left">
            <div className="payment-header">
              <div className="payment-header-icon"><i className="ri-flashlight-fill"></i></div>
              <div className="payment-header-title">Order Summary</div>
              <p className="payment-header-description">Voici un récapitulatif de votre commande.</p>
            </div>
            <div className="payment-content">
              <div className="payment-body">
                <div className="payment-plan">
                  <div className="payment-plan-type">Pro</div>
                  <div className="payment-plan-info">
                    <div className="payment-plan-info-name">Professional Plan</div>
                    <div className="payment-plan-info-price">${amount} per month</div>
                  </div>
                  <a href="#" className="payment-plan-change">Change</a>
                </div>
                <div className="payment-summary">
                  <div className="payment-summary-item">
                    <div className="payment-summary-name">Additional fee</div>
                    <div className="payment-summary-price">$10</div>
                  </div>
                  <div className="payment-summary-item">
                    <div className="payment-summary-name">Discount 20%</div>
                    <div className="payment-summary-price">-$10</div>
                  </div>
                  <div className="payment-summary-divider"></div>
                  <div className="payment-summary-item payment-summary-total">
                    <div className="payment-summary-name">Total</div>
                    <div className="payment-summary-price">${amount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="payment-right">
            <form onSubmit={handlePayment} className="payment-form">
              <h1 className="payment-title">Payment Details</h1>
              <div className="payment-method">
                <input type="radio" name="payment-method" id="method-1" value="visa" checked={paymentMethod === 'visa'} onChange={() => setPaymentMethod('visa')} />
                <label htmlFor="method-1" className="payment-method-item">
                  <img src="image/visa.png" alt="" />
                </label>
                <input type="radio" name="payment-method" id="method-2" value="mastercard" checked={paymentMethod === 'mastercard'} onChange={() => setPaymentMethod('mastercard')} />
                <label htmlFor="method-2" className="payment-method-item">
                  <img src="image/mastercard.png" alt="" />
                </label>
                <input type="radio" name="payment-method" id="method-3" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                <label htmlFor="method-3" className="payment-method-item">
                  <img src="image/paypal.png" alt="" />
                </label>
                <input type="radio" name="payment-method" id="method-4" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                <label htmlFor="method-4" className="payment-method-item">
                  <img src="image/stripe.png" alt="" />
                </label>
              </div>
              <div className="payment-form-group">
                <input type="email" placeholder=" " className="payment-form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label htmlFor="email" className="payment-form-label payment-form-label-required">Email Address</label>
              </div>
              <div className="payment-form-group">
                <input type="text" placeholder=" " className="payment-form-control" id="card-number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                <label htmlFor="card-number" className="payment-form-label payment-form-label-required">Card Number</label>
              </div>
              <div className="payment-form-group-flex">
                <div className="payment-form-group">
                  <input type="date" placeholder=" " className="payment-form-control" id="expiry-date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                  <label htmlFor="expiry-date" className="payment-form-label payment-form-label-required">Expiry Date</label>
                </div>
                <div className="payment-form-group">
                  <input type="text" placeholder=" " className="payment-form-control" id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                  <label htmlFor="cvv" className="payment-form-label payment-form-label-required">CVV</label>
                </div>
              </div>
              <button type="submit" className="payment-form-submit-button"><i className="ri-wallet-line"></i> Pay</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
