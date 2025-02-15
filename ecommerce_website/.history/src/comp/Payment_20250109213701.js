import React, { useEffect } from 'react';
import './payment.css';
import { useNavigate } from 'react-router-dom';

const Payment = ({ amount }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=VOTRE_CLIENT_ID_PAYPAL_SANDBOX';
    script.addEventListener('load', () => {
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount,
              },
            }],
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
            navigate('/order-confirmation');
          });
        },
        onError: function(err) {
          console.error('Error during payment process:', err);
          alert('Erreur lors du processus de paiement');
        },
      }).render('#paypal-button-container');
    });
    document.body.appendChild(script);
  }, [amount, navigate]);

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
                    <div className="payment-summary-name">Discount 20%</</div>
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
            <form className="payment-form">
              <h1 className="payment-title">Payment Details</h1>
              <div id="paypal-button-container"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
