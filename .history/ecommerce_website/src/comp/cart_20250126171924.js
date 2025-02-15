import React, { useState, useEffect } from 'react';
import './cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';
import Cookies from 'js-cookie';

Modal.setAppElement('#root');

const Cart = ({ cart, setCart, cartCount, setCartCount, clearCart }) => {
  const [checkout, setCheckout] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: 0, name: '', surname: '', phone: '', email: '', address: '', paymentMethod: '' });
  const [trackingNumber, setTrackingNumber] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
          setUserInfo(prevState => ({
            ...prevState,
            id: data.id, // Met à jour l'ID utilisateur
            name: data.name, // Met à jour le nom de l'utilisateur
            surname: data.surname || '', // Met à jour le prénom de l'utilisateur
            phone: data.phone || '', // Met à jour le numéro de téléphone de l'utilisateur
            email: data.email, // Met à jour l'email de l'utilisateur
            address: data.address || '' // Met à jour l'adresse de l'utilisateur
          }));
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [setCart, setCartCount]);

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
    console.log('Cart:', cart); // Log du contenu du panier

    const response = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, userInfo })
    });

    if (response.ok) {
      const data = await response.json();
      setTrackingNumber(data.trackingNumber);

      // Enregistrement des achats dans `user_purchases` pour les utilisateurs authentifiés
      if (userInfo.id !== 0) {
        for (const item of cart) {
          console.log('Recording purchase:', { userId: userInfo.id, product: item.name }); // Log de l'achat

          const purchaseResponse = await fetch('http://localhost:3001/api/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userInfo.id, product: item.name })
          });

          if (!purchaseResponse.ok) {
            const errorData = await purchaseResponse.json();
            console.error('Erreur lors de l\'enregistrement de l\'achat:', errorData);
            alert('Failed to record purchase: ' + errorData.message);
            return;
          }

          const purchaseResult = await purchaseResponse.json();
          console.log('Purchase Result:', purchaseResult); // Log du résultat de l'achat
        }
      }

      if (userInfo.paymentMethod === 'online payment') {
        navigate(`/payment/${data.orderId}`);
      } else {
        clearCart(); // Réinitialiser le panier et le compteur de panier
        setCheckout(false);
        setModalIsOpen(true);
      }
    } else {
      const errorData = await response.json();
      console.error('Checkout failed:', errorData);
      alert('Checkout failed: ' + errorData.message);
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
      setCartCount(cartCount + 1); // Incrémenter le compteur de panier
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
      setCartCount(cartCount - 1); // Décrémenter le compteur de panier
    } else {
      removeproduct(product);
    }
  };

  const removeproduct = async (product) => {
    await fetch(`http://localhost:3001/api/cart/${product.id}`, { method: 'DELETE' });
    setCart(cart.filter((curElm) => curElm.id !== product.id));
    setCartCount(cartCount - product.qty); // Décrémenter le compteur de panier
  };

  const total = cart.reduce((price, item) => price + item.qty * item.price, 0);

  const renderProductImage = (images) => {
    const placeholderImage = "/uploads/placeholder.jpg";
    if (Array.isArray(images) && images.length > 0) {
      return `http://localhost:3001${images[0].trim()}`; // Afficher la première image
    }
    return placeholderImage;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingNumber);
    alert('Numéro de suivi copié dans le presse-papiers');
  };

    return (
      <>
        <div className='cart'>
          <h3>Mon Panier</h3>
          {cart.length === 0 && (
            <div className='empty_cart'>
              <h2>Votre panier est vide</h2>
              <Link to='/shop'><button className="btn-primary">Achetez maintenant</button></Link>
            </div>
          )}
          <div className='container'>
            {cart.map((curElm) => (
              <React.Fragment key={curElm.id}>
                <div className='box'>
                  <div className='image'>
                    <img src={renderProductImage(curElm.images)} alt='' />
                  </div>
                  <div className='detail'>
                    <div className='info'>
                      <h4>{curElm.cat}</h4>
                      <h3>{curElm.name}</h3>
                      <p>Prix: {curElm.price} MAD</p>
                      <p>Total: {curElm.price * curElm.qty} MAD</p>
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
          {cart.length > 0 && (
            <div className='bottom'>
              <div className='Total'>
                <h4>Sous-total : {total} MAD</h4>
              </div>
              <button className="btn-primary" onClick={() => setCheckout(true)}>Passer à la caisse</button>
            </div>
          )}
        </div>
        {checkout && (
          <div className='checkout'>
            <h3>Passer à la caisse</h3>
            <form onSubmit={handleCheckout}>
              <div className='container'>
                <input type='text' name='name' placeholder='Nom' value={userInfo.name} onChange={handleChange} required />
                <input type='text' name='surname' placeholder='Prénom' value={userInfo.surname} onChange={handleChange} required />
                <input type='text' name='phone' placeholder='Téléphone' value={userInfo.phone} onChange={handleChange} required />
                <input type='email' name='email' placeholder='E-mail' value={userInfo.email} onChange={handleChange} required />
                <input type='text' name='address' placeholder='Adresse' value={userInfo.address} onChange={handleChange} required />
                <select name='paymentMethod' value={userInfo.paymentMethod} onChange={handleChange} required>
                  <option value=''>Sélectionnez le mode de paiement</option>
                  <option value='cash on delivery'>Paiement à la livraison</option>
                  <option value='online payment'>Paiement en ligne</option>
                </select>
                <button type='submit' className="btn-primary">Soumettre</button>
              </div>
            </form>
          </div>
        )}
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Modal de Suivi de Commande" className="modal" overlayClassName="overlay">
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
            <button onClick={() => setModalIsOpen(false)} className="btn-primary">Suivre ma commande</button>
          </Link>
        </Modal>
      </>
    );
  };
  
  export default Cart;
  














/*import React, { useState, useEffect } from 'react';
import './cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';
import Cookies from 'js-cookie';

Modal.setAppElement('#root');

const Cart = ({ cart, setCart, cartCount, setCartCount, clearCart }) => {
  const [checkout, setCheckout] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: 0, name: '', surname: '', phone: '', email: '', address: '', paymentMethod: '' });
  const [trackingNumber, setTrackingNumber] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
          setUserInfo(prevState => ({
            ...prevState,
            id: data.id, // Met à jour l'ID utilisateur
            name: data.name, // Met à jour le nom de l'utilisateur
            surname: data.surname || '', // Met à jour le prénom de l'utilisateur
            phone: data.phone || '', // Met à jour le numéro de téléphone de l'utilisateur
            email: data.email, // Met à jour l'email de l'utilisateur
            address: data.address || '' // Met à jour l'adresse de l'utilisateur
          }));
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [setCart, setCartCount]);

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
    console.log('Cart:', cart); // Log du contenu du panier

    const response = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, userInfo })
    });

    if (response.ok) {
      const data = await response.json();
      setTrackingNumber(data.trackingNumber);

      // Enregistrement des achats dans `user_purchases` pour les utilisateurs authentifiés
      if (userInfo.id !== 0) {
        for (const item of cart) {
          console.log('Recording purchase:', { userId: userInfo.id, product: item.name }); // Log de l'achat

          const purchaseResponse = await fetch('http://localhost:3001/api/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userInfo.id, product: item.name })
          });

          if (!purchaseResponse.ok) {
            const errorData = await purchaseResponse.json();
            console.error('Erreur lors de l\'enregistrement de l\'achat:', errorData);
            alert('Failed to record purchase: ' + errorData.message);
            return;
          }

          const purchaseResult = await purchaseResponse.json();
          console.log('Purchase Result:', purchaseResult); // Log du résultat de l'achat
        }
      }

      if (userInfo.paymentMethod === 'online payment') {
        navigate(`/payment/${data.orderId}`);
      } else {
        clearCart(); // Réinitialiser le panier et le compteur de panier
        setCheckout(false);
        setModalIsOpen(true);
      }
    } else {
      const errorData = await response.json();
      console.error('Checkout failed:', errorData);
      alert('Checkout failed: ' + errorData.message);
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
      setCartCount(cartCount + 1); // Incrémenter le compteur de panier
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
      setCartCount(cartCount - 1); // Décrémenter le compteur de panier
    } else {
      removeproduct(product);
    }
  };

  const removeproduct = async (product) => {
    await fetch(`http://localhost:3001/api/cart/${product.id}`, { method: 'DELETE' });
    setCart(cart.filter((curElm) => curElm.id !== product.id));
    setCartCount(cartCount - product.qty); // Décrémenter le compteur de panier
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
        <h3>Mon Panier</h3>
        {cart.length === 0 && <div className='empty_cart'>
          <h2>Votre panier est vide</h2>
          <Link to='/shop'><button className="btn-primary">Achetez maintenant</button></Link>
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
                    <p>Prix: {curElm.price} MAD</p>
                    <p>Total: {curElm.price * curElm.qty} MAD</p>
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
            <h4>Sous-total : {total} MAD</h4>
          </div>
          <button className="btn-primary" onClick={() => setCheckout(true)}>Passer à la caisse</button>
        </div>}
      </div>
      {checkout && (
        <div className='checkout'>
          <h3>Passer à la caisse</h3>
          <form onSubmit={handleCheckout}>
            <div className='container'>
              <input type='text' name='name' placeholder='Nom' value={userInfo.name} onChange={handleChange} required />
              <input type='text' name='surname' placeholder='Prénom' value={userInfo.surname} onChange={handleChange} required />
              <input type='text' name='phone' placeholder='Téléphone' value={userInfo.phone} onChange={handleChange} required />
              <input type='email' name='email' placeholder='E-mail' value={userInfo.email} onChange={handleChange} required />
              <input type='text' name='address' placeholder='Adresse' value={userInfo.address} onChange={handleChange} required />
              <select name='paymentMethod' value={userInfo.paymentMethod} onChange={handleChange} required>
                <option value=''>Sélectionnez le mode de paiement</option>
                <option value='cash on delivery'>Paiement à la livraison</option>
                <option value='online payment'>Paiement en ligne</option>
              </select>
              <button type='submit' className="btn-primary">Soumettre</button>
            </div>
          </form>
        </div>
      )}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Modal de Suivi de Commande" className="modal" overlayClassName="overlay">
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
          <button onClick={() => setModalIsOpen(false)} className="btn-primary">Suivre ma commande</button>
        </Link>
      </Modal>
    </>
  );
};

export default Cart;
*/