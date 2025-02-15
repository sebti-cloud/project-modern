import React, { useState, useEffect } from 'react';
import './cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';
import Cookies from 'js-cookie';

Modal.setAppElement('#root');

const Cart = ({ cart, setCart }) => {
  const [checkout, setCheckout] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: 0, name: '', surname: '', phone: '', email: '', address: '', paymentMethod: '' });
  const [trackingNumber, setTrackingNumber] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart && Array.isArray(storedCart)) {
      setCart(storedCart);
      setCartCount(storedCart.reduce((count, item) => count + item.qty, 0));
    }

    const token = Cookies.get('token');
    if (token) {
      fetch('http://localhost:3001/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setUserInfo(prevState => ({ ...prevState, id: data.id }));
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [setCart]);

  useEffect(() => {
    if (Array.isArray(cart)) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('cartCount', cart.reduce((count, item) => count + item.qty, 0));
    }
  }, [cart]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    console.log('User Info:', userInfo);

    const response = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, userInfo })
    });

    if (response.ok) {
      const data = await response.json();
      setTrackingNumber(data.trackingNumber);

      // Enregistrement des commandes dans la table `orders`
      const orderResponse = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userInfo.id, orderDetails: cart, ...userInfo })
      });

      if (!orderResponse.ok) {
        console.error('Erreur lors de l\'enregistrement de la commande:', await orderResponse.json());
        alert('Failed to record order');
        return;
      }

      // Enregistrement des achats dans `user_purchases` pour les utilisateurs authentifiés
      if (userInfo.id !== 0) {
        for (const item of cart) {
          const purchaseResponse = await fetch('http://localhost:3001/api/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userInfo.id, product: item.name })
          });

          if (!purchaseResponse.ok) {
            console.error('Erreur lors de l\'enregistrement de l\'achat:', await purchaseResponse.json());
            alert('Failed to record purchase');
            return;
          }
        }
      }

      if (userInfo.paymentMethod === 'online payment') {
        navigate(`/payment/${data.orderId}`);
      } else {
        setCart([]);
        localStorage.removeItem('cart');
        localStorage.removeItem('cartCount');
        setCheckout(false);
        setModalIsOpen(true);
      }
    } else {
      alert('Checkout failed');
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
      setCart(cart.map((curElm) => curElm.id === product.id ? { ...exist, qty: updatedQty } : curElm));
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
      setCart(cart.map((curElm) => curElm.id === product.id ? { ...exist, qty: updatedQty } : curElm));
    } else {
      removeproduct(product);
    }
  };

  const removeproduct = async (product) => {
    await fetch(`http://localhost:3001/api/cart/${product.id}`, { method: 'DELETE' });
    setCart(cart.filter((curElm) => curElm.id !== product.id));
  };

  const total = cart.reduce((price, item) => price + item.qty * item.price, 0);

  const renderProductImage = (imagePath) => {
    const placeholderImage = "/uploads/placeholder.jpg";
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
        {cart.length === 0 && <div className='empty_cart'>
          <h2>Votre panier est vide</h2>
          <Link to='/shop'><button>Achetez maintenant</button></Link>
        </div>}
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
        {cart.length > 0 && <div className='bottom'>
          <div className='Total'>
            <h4>Sub Total: {total} Mad</h4>
          </div>
          <button onClick={() => setCheckout(true)}>Checkout</button>
        </div>}
      </div>
      {checkout && (
        <div className='checkout'>
          <h3>Checkout</h3>
          <form onSubmit={handleCheckout}>
            <div className='container'>
              <input type='text' name='name' placeholder='Name' value={userInfo.name} onChange={handleChange} required />
              <input type='text' name='surname' placeholder='Surname' value={userInfo.surname} onChange={handleChange} required />
              <input type='text' name='phone' placeholder='Phone' value={userInfo.phone} onChange={handleChange} required />
              <input type='email' name='email' placeholder='Email' value={userInfo.email} onChange={handleChange} required />
              <input type='text' name='address' placeholder='Adresse' value={userInfo.address} onChange={handleChange} required />
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
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Tracking Number Modal" className="modal" overlayClassName="overlay">
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
