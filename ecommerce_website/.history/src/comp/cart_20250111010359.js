import React, { useEffect, useState } from 'react';
import './payment.css';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';

Modal.setAppElement('#root');

const Payment = () => {
  const { orderId } = useParams();
  const [total, setTotal] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.error("orderId n'est pas défini.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/order-details/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Montant total récupéré:', data.total);
        setTotal(data.total);
        setUserEmail(data.email); // Ajouter cette ligne pour obtenir l'email de l'utilisateur
        setTrackingNumber(data.trackingNumber); // Ajouter cette ligne pour obtenir le numéro de suivi
      } catch (error) {
        console.error('Error fetching order total:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (total !== null) {
      const script = document.createElement('script');
      const clientId = 'VOTRE_CLIENT_ID_MERCHANT_SANDBOX';

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

  useEffect(() => {
    if (paypalLoaded && total !== null) {
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toString(),
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

            // Envoyer la facture par email
            try {
              const response = await fetch('http://localhost:3001/api/send-receipt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, email: userEmail }),
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              console.log('Reçu de paiement envoyé avec succès.');
            } catch (error) {
              console.error('Erreur lors de l\'envoi du reçu de paiement :', error);
            }

            // Afficher la modale de suivi
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingNumber);
    alert('Numéro de suivi copié dans le presse-papiers');
  };

  if (total === null) {
    console.log('Loading...');
    return <div>Loading...</div>;
  }

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
                      <div className="payment-plan-info-price">${total} par mois</div>
                    </div>
                    <a href="#" className="payment-plan-change">Changer</a>
                  </div>
                  <div className="payment-summary">
                    <div className="payment-summary-item">
                      <div className="payment-summary-name">Frais supplémentaires</div>
                      <div className="payment-summary-price">$10</div>
                    </div>
                    <div className="payment-summary-item">
                      <div className="payment-summary-name">Réduction 20%</div>
                      <div className="payment-summary-price">-$10</div>
                    </div>
                    <div className="payment-summary-divider"></div>
                    <div className="payment-summary-item payment-summary-total">
                      <div className="payment-summary-name">Total</div>
                      <div className="payment-summary-price">${total}</div>
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

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Tracking Number Modal" className="modal" overlayClassName="overlay">
        <h2>Merci pour votre commande !</h2>
        <p>Votre numéro de suivi est :</p>
        <div className="tracking-number-container">
          <h3>{trackingNumber}</h3>
          <button onClick={copyToClipboard} className="copy-button">
            <FaCopy /> Copier
          </button>
        </div>
        <p>Veuillez noter ce numéro pour suivre l'état de votre commande.</p>
        <Link to="/track-order">
          <button onClick={() => setModalIsOpen(false)}>Suivre ma commande</button>
        </Link>
      </Modal>
    </>
  );
};

export default Payment;


/*import React, { useState } from 'react';
import './cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';

// Définir l'élément principal de l'application pour react-modal
Modal.setAppElement('#root');

const Cart = ({ cart, setCart }) => {
    const [checkout, setCheckout] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', surname: '', phone: '', email: '', address: '', paymentMethod: '' });
    const [trackingNumber, setTrackingNumber] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (userInfo.paymentMethod === 'online payment') {
            navigate('/payment');
        } else {
            const response = await fetch('http://localhost:3001/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, userInfo })
            });
            if (response.ok) {
                const data = await response.json();
                setTrackingNumber(data.trackingNumber);
                setCart([]);
                setCheckout(false);
                setModalIsOpen(true);
            } else {
                alert('Checkout failed');
            }
        }
    };

    const incqty = async (product) => {
        const exist = cart.find((x) => x.id === product.id);
        if (exist) {
            const updatedQty = exist.qty + 1;
            await fetch(`http://localhost:3001/api/cart/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qty: updatedQty })
            });
            setCart(cart.map((curElm) =>
                curElm.id === product.id ? { ...exist, qty: updatedQty } : curElm
            ));
        }
    };

    const decqty = async (product) => {
        const exist = cart.find((x) => x.id === product.id);
        if (exist && exist.qty > 1) {
            const updatedQty = exist.qty - 1;
            await fetch(`http://localhost:3001/api/cart/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qty: updatedQty })
            });
            setCart(cart.map((curElm) =>
                curElm.id === product.id ? { ...exist, qty: updatedQty } : curElm
            ));
        } else {
            removeproduct(product);
        }
    };

    const removeproduct = async (product) => {
        await fetch(`http://localhost:3001/api/cart/${product.id}`, {
            method: 'DELETE'
        });
        setCart(cart.filter((curElm) => curElm.id !== product.id));
    };
      

    const total = cart.reduce((price, item) => price + item.qty * item.price, 0);

    const placeholderImage = "/uploads/placeholder.jpg"; // Remplace par le chemin réel de ton image de remplacement

    const renderProductImage = (imagePath) => {
        return imagePath && imagePath.trim() !== "" ? `http://localhost:3001${imagePath}` : placeholderImage;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingNumber);
        alert('Numéro de suivi copié dans le presse-papiers');
    };

    return (
        <>
            <div className='cart'>
                <h3>#cart</h3>
                {cart.length === 0 &&
                    <div className='empty_cart'>
                        <h2>Votre panier est vide</h2>
                        <Link to='/shop'><button>Achetez maintenant</button></Link>
                    </div>
                }
                <div className='container'>
                    {cart.map((curElm) => (
                        <React.Fragment key={curElm.id}>
                            <div className='box'>
                                <div className='image'>
                                    <img src={renderProductImage(curElm.image)} alt='' />
                                </div>
                                <div className='detail'>
                                    <div className='info'>
                                        <h4>{curElm.cat}</h4>
                                        <h3>{curElm.name}</h3>
                                        <p>Price: {curElm.price} Mad</p>
                                        <p>Total: {curElm.price * curElm.qty} Mad</p>
                                    </div>
                                    <div className='quantity'>
                                        <button onClick={() => incqty(curElm)}>+</button>
                                        <input type='number' value={curElm.qty} readOnly />
                                        <button onClick={() => decqty(curElm)}>-</button>
                                    </div>
                                    <div className='icon'>
                                        <li onClick={() => removeproduct(curElm)}><AiOutlineClose /></li>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                {cart.length > 0 &&
                    <div className='bottom'>
                        <div className='Total'>
                            <h4>Sub Total: {total} Mad</h4>
                        </div>
                        <button onClick={() => setCheckout(true)}>Checkout</button>
                    </div>
                }
            </div>

            {checkout && (
                <div className='checkout'>
                    <h3>Checkout</h3>
                    <form onSubmit={handleCheckout}>
                        <div className='container'>
                            <input type='text' name='name' placeholder='Name' value={userInfo.name} onChange={handleChange} required />
                            <input type='text' name='surname' placeholder='Surname' value={userInfo.surname} onChange={handleChange} required />
                            <input type='text' name='phone' placeholder='Phone' value={userInfo.phone} onChange={handleChange} required />
                            <input type='email' name='email' placeholder='Email' value={userInfo.email} onChange={handleChange} required /> {}
                            <input type='text' name='address' placeholder='Adresse' value={userInfo.address} onChange={handleChange} required /> {} 
                            <select name='paymentMethod' value={userInfo.paymentMethod} onChange={handleChange} required>
                                <option value=''>Sélectionnez le mode de paiement</option>
                                <option value='cash on delivery'>Paiement à la livraison</option>
                                <option value='online payment'>Paiement en ligne</option>
                            </select>
                            <button type='submit'>Submit</button>
                        </div>
                    </form>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Tracking Number Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Merci pour votre commande, {userInfo.name} !</h2>
                <p>Voici votre numéro de suivi :</p>
                <div className="tracking-number-container">
                    <h3>{trackingNumber}</h3>
                    <button onClick={copyToClipboard} className="copy-button">
                        <FaCopy /> Copier
                    </button>
                </div>
                <p>Veuillez noter ce numéro pour suivre l'état de votre commande.</p>
                <Link to="/track-order">
                    <button onClick={() => setModalIsOpen(false)}>Suivre ma commande</button>
                </Link>
            </Modal>
        </>
    );
};

export default Cart;
*/