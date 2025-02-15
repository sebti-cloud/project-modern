import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="admin-message-link">
        <Link to="/contacts" className="message-link">
          <FaEnvelope className="message-icon" /> Messages
        </Link> {/* Lien vers AdminContacts avec une icône */}
      </div>
      <nav>
        <ul>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
          <li><Link to="/likedProducts">Produits aimés</Link></li>
          <li><Link to="/categories">Catégories</Link></li>
          <li><Link to="/admins">Administrateurs</Link></li>
          <li><Link to="/admin-settings">Settings</Link></li>
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
