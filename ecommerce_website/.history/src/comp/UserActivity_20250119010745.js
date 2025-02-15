/*import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { PieChart } from 'react-minimal-pie-chart';
import './admin.css';
import { useParams } from 'react-router-dom';

Modal.setAppElement('#root');

const UserActivity = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState('');
  const [logins, setLogins] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]); // Initialiser en tant que tableau
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchUsername();
    fetchLogins();
    fetchPurchases();
    fetchLikedProducts();
  }, [userId]);

  const fetchUsername = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du nom d\'utilisateur');
      }
      const data = await response.json();
      setUsername(data.name);
    } catch (error) {
      console.error('Erreur lors de la récupération du nom d\'utilisateur:', error);
    }
  };

  const fetchLogins = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user-activities/logins/${userId}`);
      const data = await response.json();
      console.log('Logins:', data);
      setLogins(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des connexions des utilisateurs:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user-activities/purchases/${userId}`);
      const data = await response.json();
      console.log('Purchases:', data);
      setPurchases(Array.isArray(data) ? data : []); // S'assurer que purchases est un tableau
      if (Array.isArray(data)) { // Vérification supplémentaire pour éviter les erreurs
        fetchProductCategories(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des achats des utilisateurs:', error);
    }
  };

  const fetchLikedProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user-activities/liked-products/${userId}`);
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }
      console.log('Liked Products:', data);
      setLikedProducts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits aimés:', error);
    }
  };

  const fetchProductCategories = async (purchases) => {
    try {
      const productIds = purchases.map(purchase => purchase.product);
      const response = await fetch(`http://localhost:3001/api/products/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories de produits');
      }
      const data = await response.json();
      generateChartData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories de produits:', error);
    }
  };

  const generateChartData = (products) => {
    const categoryCount = {};

    products.forEach((product) => {
      const category = product.category;
      if (categoryCount[category]) {
        categoryCount[category] += 1;
      } else {
        categoryCount[category] = 1;
      }
    });

    const totalProducts = products.length;
    const chartData = Object.keys(categoryCount).map((category) => ({
      title: category,
      value: categoryCount[category],
      percentage: ((categoryCount[category] / totalProducts) * 100).toFixed(2),
      color: getRandomColor()
    }));

    setChartData(chartData);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><a href="/admin">Dashboard</a></li>
          <li><a href="/products">Produits</a></li>
          <li><a href="/orders">Commandes</a></li>
          <li><a href="/categories">Catégories</a></li>
          <li><a href="/likedProducts">Produits aimés</a></li>
          <li><a href="/contacts">Messages</a></li>
          <li><a href="/admins">Administrateurs</a></li>
          <li><a href="/admin-settings">Settings</a></li>
          <li><a href="/admin-users">Utilisateurs</a></li>
        </ul>
      </nav>
      <div className="user-activities">
        <h2 className="user-activities-header">Activités de {username}</h2>

        <h3>Connexions</h3>
        <table>
          <thead>
            <tr>
              <th>Login Time</th>
            </tr>
          </thead>
          <tbody>
            {logins.map((login, index) => (
              <tr key={index}>
                <td>{new Date(login.login_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Achats Récents</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={index}>
                <td>{purchase.product}</td>
                <td>{new Date(purchase.purchase_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Produits Aimés</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {likedProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={openModal} className="interests-button">Voir les Intérêts</button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="User Interests"
          className="modal"
          overlayClassName="overlay"
        >
          <button onClick={closeModal} className="close-button">X</button>
          {chartData.length > 0 ? (
            <PieChart
              data={chartData.map((entry) => ({
                title: entry.title,
                value: entry.value,
                color: entry.color
              }))}
              label={({ dataEntry }) => `${dataEntry.value} (${dataEntry.percentage}%)`}
              labelStyle={(index) => ({
                fill: chartData[index].color,
                fontSize: '5px',
                fontFamily: 'sans-serif'
              })}
              style={{ height: '200px' }}
            />
          ) : (
            <p>Aucune donnée disponible pour afficher le graphique.</p>
          )}

          <div className="legend">
            {chartData.map((entry, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: entry.color, marginRight: '10px' }}></div>
                <span>{entry.title}: {entry.percentage}%</span>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserActivity;
*/

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

      for (const item of cart) {
        console.log('Enregistrement de l\'achat pour:', { userId: userInfo.id, product: item.name });

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
