import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaClipboardList, FaTags, FaEnvelope, FaUserShield, FaCog, FaUser, FaWarehouse } from 'react-icons/fa'; // Importer des icônes depuis react-icons
import './admin.css';

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/liked-products');
      const data = await response.json();
      setLikedProducts(data);
    } catch (error) {
      console.error('Error fetching liked products:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/liked-products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setLikedProducts(likedProducts.filter(product => product.id !== productId));
      } else {
        console.error('Failed to delete liked product.');
      }
    } catch (error) {
      console.error('Error deleting liked product:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <button className="back-to-home" onClick={() => window.location.href = '/admin'}>Accueil Admin</button>
      <nav>
        <ul>
          <li><Link to="/admin/products"><FaBox /> Produits</Link></li>
          <li><Link to="/admin/orders"><FaClipboardList /> Commandes</Link></li>
          <li><Link to="/admin/categories"><FaTags /> Catégories</Link></li>
          <li><Link to="/admin/contacts"><FaEnvelope /> Messages</Link></li>
          <li><Link to="/admin/admins"><FaUserShield /> Administrateurs</Link></li>
          <li><Link to="/admin/admin-settings"><FaCog /> Paramètres</Link></li>
          <li><Link to="/admin/stock-history"><FaWarehouse /> Historique des Stocks</Link></li>
          <li><Link to="/admin/admin-users"><FaUser /> Utilisateurs</Link></li>
          <li><Link to="/admin/suppliers"><FaWarehouse /> Fournisseurs</Link></li>
        </ul>
      </nav>
      <div className="liked-products">
        <h2 className="liked-products-header">Produits aimés</h2>
        <table className="liked-products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {likedProducts.map(product => (
              <tr key={product.id}>
                <td><img src={`http://localhost:3001${product.image}`} alt={product.name} className="product-image" /></td>
                <td>{product.name}</td>
                <td>{product.price} Mad</td>
                <td>
                  <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LikedProducts;
