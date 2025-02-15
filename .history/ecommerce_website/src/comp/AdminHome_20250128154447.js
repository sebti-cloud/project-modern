import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUser, FaTags, FaChartBar, FaEnvelope, FaUsersCog, FaCogs } from 'react-icons/fa';
import './AdminHome.css';

const AdminHome = () => {
  return (
    <div className="admin-home">
      <h1>Bienvenue dans le Tableau de Bord Administratif</h1>
      <div className="admin-sections">
        <div className="admin-card">
          <Link to="/products">
            <FaBox size={40} />
            <h2>Produits</h2>
            <p>Gérez tous les produits de votre boutique.</p>
          </Link>
        </div>
        <div className="admin-card">
          <Link to="/orders">
            <FaShoppingCart size={40} />
            <h2>Commandes</h2>
            <p>Suivez et gérez les commandes des clients.</p>
          </Link>
        </div>
        <div className="admin-card">
          <Link to="/users">
            <FaUser size={40} />
            <h2>Utilisateurs</h2>
            <p>Gérez les comptes des utilisateurs et des administrateurs.</p>
          </Link>
        </div>
        <div className="admin-card">
          <Link to="/categories">
            <FaTags size={40} />
            <h2>Catégories</h2>
            <p>Organisez les produits en différentes catégories.</p>
          </Link>
        </div>
        <div className="admin-card">
          <Link to="/sales-report">
            <FaChartBar size={40} />
            <h2>Rapport de Ventes</h2>
            <p>Consultez les rapports de ventes et analyses.</p>
          </Link>
        </div>
        <div className="admin-card">
          <Link to="/contacts">
            <FaEnvelope size={40} />
            <h2>Messages</h2>
            <p>Gérez les messages des clients et des utilisateurs.</p>
          </Link>
        </div>
        <div className="admin-card">
          <Link to="/admins">
            <FaUsersCog size={40} />
            <h2>Administrateurs</h2>
            <p>Gérez les comptes administratifs.</p>
          </Link>
        </div>
        <div className="admin-card">
          <Link to="/admin-settings">
            <FaCogs size={40} />
            <h2>Paramètres</h2>
            <p>Gérez les paramètres de l'administration et les utilisateurs.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
