import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';
import './payment.css';

const Payment = () => {
  const { orderId } = useParams();
  console.log('orderId:', orderId);
  const [total, setTotal] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const navigate = useNavigate();
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.error("orderId n'est pas défini.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/pending-order-total/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Détails de la commande récupérés:', data);

        setTotal(data.total_price || 0);
        setUserEmail(data.user_email || '');
        setTrackingNumber(data.tracking_number || '');
        setUserName(data.user_name || '');

        if (!data.user_email) {
          console.error("Email non défini.");
        }
        if (!data.tracking_number) {
          console.error("Numéro de suivi non défini.");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la commande:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (total !== null) {
      const script = document.createElement('script');
      const clientId = 'Ado4_0ttcdGRc2_5YbVvN5dQARN1HCrEf394FAQkfamS9oLit2rJm9OXgf6oXagid3qYs_yD7mMHhaxk';

      if (!clientId) {
        console.error("Le client-id PayPal n'est pas défini. Veuillez vérifier votre configuration.");
        return;
      }

      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        console.log('PayPal script loaded');
      };
      script.onerror = () => {
        console.error('Erreur de chargement du script PayPal');
      };
      document.body.appendChild(script);
    }
  }, [total]);

  const updatePaymentStatus = async (pendingOrderId, transactionId) => {
    console.log('Appel de updatePaymentStatus avec Pending Order ID:', pendingOrderId, 'et Transaction ID:', transactionId);
    try {
      const response = await fetch(`http://localhost:3001/api/update-payment-status/${pendingOrderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'payé', transaction_id: transactionId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log('Réponse de la mise à jour:', data);
      console.log('Transaction ID et statut de paiement mis à jour avec succès:', data.pendingOrder);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du Transaction ID et du statut de paiement :', error);
    }
  };

  const handleOnlineCheckout = async (pendingOrderId, transactionId) => {
    console.log('Appel de handleOnlineCheckout avec Pending Order ID:', pendingOrderId, 'et Transaction ID:', transactionId);
    try {
      const response = await fetch('http://localhost:3001/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingOrderId,
          transactionId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log('Commande confirmée avec succès:', data);
    } catch (error) {
      console.error('Erreur lors de la confirmation de la commande :', error);
    }
  };

  useEffect(() => {
    if (paypalLoaded && total !== null) {
      const usdTotal = (total / 10).toFixed(2); // Convertir le total de MAD à USD

      window.paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: usdTotal, // Utiliser le montant en USD
              },
            }],
          }).catch((err) => {
            console.error('Erreur lors de la création de la commande :', err);
            alert('Erreur lors de la création de la commande');
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(async function(details) {
            alert(`Transaction terminée par ${details.payer.name.given_name}. Votre reçu de paiement a été envoyé à ${userEmail}.`);
            console.log('Transaction ID reçu de PayPal:', details.id);
            setTransactionId(details.id);
            setModalIsOpen(true);
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
  }, [total, navigate, paypalLoaded, orderId, userEmail]);

  const handleTransactionIdSubmit = async (e) => {
    e.preventDefault();
    console.log('Submission du Transaction ID:', transactionId);
    try {
      // Mettre à jour le statut du paiement et le Transaction ID dans la table pending_orders
      await updatePaymentStatus(orderId, transactionId);
      console.log('Mise à jour du statut de paiement et du Transaction ID réussie.');

      // Appeler la fonction pour enregistrer la commande en ligne avec transactionId
      await handleOnlineCheckout(orderId, transactionId);
      console.log('Commande enregistrée en ligne avec succès.');

      alert('Transaction ID soumis avec succès.');
      setModalIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la soumission du Transaction ID:', error);
      alert('Erreur lors de la soumission du Transaction ID.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionId);
    alert('Transaction ID copié dans le presse-papiers');
  };

  if (total === null) {
    console.log('Chargement...');
    return <div>Chargement...</div>;
  }

  const usdTotal = (total / 10).toFixed(2); // Définir usdTotal ici
  return (
    <>
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
                      <div className="payment-plan-info-price">${usdTotal} par mois</div>
                    </div>
                    <a href="#" className="payment-plan-change">Changer</a>
                  </div>
                  <div className="payment-summary">
                    <div className="payment-summary-item">
                      <div className="payment-summary-name">Frais supplémentaires</div>
                      <div className="payment-summary-price">$1</div>
                    </div>
                    <div className="payment-summary-item">
                      <div className="payment-summary-name">Réduction 20%</div>
                      <div className="payment-summary-price">                    -$2</div>
                    </div>
                    <div className="payment-summary-divider"></div>
                    <div className="payment-summary-item payment-summary-total">
                      <div className="payment-summary-name">Total</div>
                      <div className="payment-summary-price">${usdTotal}</div>
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

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Transaction ID Modal" className="modal" overlayClassName="overlay">
        <h2>Merci pour votre commande, {userName} !</h2>
        <p>Votre numéro de suivi est :</p>
        <div className="tracking-number-container">
          <h3>{trackingNumber}</h3>
          <button onClick={copyToClipboard} className="copy-button">
            <FaCopy /> Copier
          </button>
        </div>
        <p>Votre ID de transaction PayPal est :</p>
        <div className="transaction-id-container">
          <h3>{transactionId}</h3>
          <button onClick={copyToClipboard} className="copy-button">
            <FaCopy /> Copier
          </button>
        </div>
        <p>Veuillez copier cet ID de transaction et le saisir ci-dessous pour confirmer votre commande :</p>
        <form onSubmit={handleTransactionIdSubmit}>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Entrez l'ID de transaction"
            required
          />
          <button type="submit">Soumettre</button>
        </form>
        <p>Votre commande sera confirmée après la soumission de cet ID de transaction.</p>
        <Link to="/track-order">
          <button onClick={() => setModalIsOpen(false)}>Suivre ma commande</button>
        </Link>
      </Modal>
    </>
  );
};

export default Payment;
