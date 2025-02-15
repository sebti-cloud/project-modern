import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaClipboardList, FaHeart, FaTags, FaEnvelope, FaUserShield, FaUser, FaWarehouse } from 'react-icons/fa'; // Importer des icônes depuis react-icons
import './admin.css';

const AdminSettings = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    // Fetch the current email from the server when the component mounts
    const fetchCurrentEmail = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/admin-settings/email');
        if (response.ok) {
          const data = await response.json();
          setCurrentEmail(data.email);
        } else {
          console.error('Failed to fetch current email');
        }
      } catch (error) {
        console.error('Error fetching current email:', error);
      }
    };

    fetchCurrentEmail();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert('Settings updated successfully!');
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="admin-dashboard">
      <button className="back-to-home" onClick={() => window.location.href = '/admin'}>Accueil Admin</button>
      <nav>
        <ul>
          <li><Link to="/admin/products"><FaBox /> Produits</Link></li>
          <li><Link to="/admin/orders"><FaClipboardList /> Commandes</Link></li>
          <li><Link to="/admin/likedProducts"><FaHeart /> Produits aimés</Link></li>
          <li><Link to="/admin/categories"><FaTags /> Catégories</Link></li>
          <li><Link to="/admin/contacts"><FaEnvelope /> Messages</Link></li>
          <li><Link to="/admin/admins"><FaUserShield /> Administrateurs</Link></li>
          <li><Link to="/admin/stock-history"><FaWarehouse /> Historique des Stocks</Link></li>
          <li><Link to="/admin/admin-users"><FaUser /> Utilisateurs</Link></li>
          <li><Link to="/admin/suppliers"><FaWarehouse /> Fournisseurs</Link></li>
        </ul>
      </nav>
      <div className="admin-content settings-content">
        <h2>Admin Settings</h2>
        {currentEmail && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <strong>Email actuel : {currentEmail}</strong>
          </div>
        )}
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-save">Save Settings</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
