import React, { useEffect, useState } from 'react';
import './payment.css';
import { useNavigate } from 'react-router-dom';

const Payment = ({ amount }) => {
  const navigate = useNavigate();
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    const clientId = 'AYRpsv2cf7SAgmIl38VY9h_0ijEYHiZh_CacBlMgcHM4ufdG7j-DSGtH5WJm7oFYtb7Sr5DWgQbnR6kp';

    if (!clientId) {
      console.error("Le client-id PayPal n'est pas défini. Veuillez vérifier votre configuration.");
      return;
    }

    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;
    script.onload = () => {
      setPaypalLoaded(true);
    };
    script.onerror = () => {
      console.error('Erreur de chargement du script PayPal');
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (paypalLoaded) {
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          if (amount === undefined) {
            console.error('Le montant est indéfini.');
            alert('Erreur: Le montant est indéfini.');
            return;
          }

          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toString(),
              },
            }],
          }).catch((err) => {
            console.error('Erreur lors de la création de la commande :', err);
            alert('Erreur lors de la création de la commande');
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert('Transaction terminée par ' + details.payer.name.given_name);
            navigate('/order-confirmation');
          }).catch((err) => {
            console.error('Erreur lors de l\'approbation de la commande :', err);
            alert('Erreur lors de l\'approbation de la commande');
          });
        },
        onError: function(err) {
          console.error('Erreur lors du processus de paiement :', err);
          alert('Erreur lors du processus de paiement');
        },
      }).render('#paypal-button-container');
    }
  }, [amount, navigate, paypalLoaded]);

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-wrapper">
          <div className="payment-left">
            <div className="payment-header">
              <div className="payment-header-icon"><i className="ri-flashlight-fill"></i></div>
              <div className="payment-header-title">Résumé de la commande</div>
              <p className="payment-header-description">Voici un récapitulatif de votre commande.</p>
            </div>
            <div className="payment-content">
              <div className="payment-body">
                <div className="payment-plan">
                  <div className="payment-plan-type">Pro</div>
                  <div className="payment-plan-info">
                    <div className="payment-plan-info-name">Plan Professionnel</div>
                    <div className="payment-plan-info-price">${amount} par mois</div>
                  </div>
                  <a href="#" className="payment-plan-change">Changer</a>
                </div>
                <div className="payment-summary">
                  <div className="payment-summary-item">
                    <div className="payment-summary-name">Frais supplémentaires</div>
                    <div className="payment-summary-price">$10</div>
                  </div>
                  <div className="payment-summary-item">
                    <div className="payment-summary-name">Réduction 20%</</div>
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
              <h1 className="payment-title">Détails de Paiement</h1>
              <div id="paypal-button-container"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
