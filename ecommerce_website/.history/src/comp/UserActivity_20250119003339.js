import React, { useState, useEffect } from 'react';
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
      console.log('Received liked products data:', data); // Ajouter ce log
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
      console.log('Purchases:', purchases);
      const productIds = purchases.map(purchase => purchase.product); // Utiliser product au lieu de product_id
      console.log('Product IDs:', productIds);
      const response = await fetch(`http://localhost:3001/api/products/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      console.log('Product IDs sent to backend:', productIds); // Ajouter ce log
      console.log('Fetching product categories...'); // Ajouter ce log
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories de produits');
      }
      const data = await response.json();
      console.log('Product Categories:', data);
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

    console.log('Chart Data:', chartData);
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

          {/* Ajouter une légende */}
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
