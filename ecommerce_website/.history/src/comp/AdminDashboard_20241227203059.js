import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts'; // Import du composant AdminContacts
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnload = () => {
      // Supprime le token de l'admin lors de la fermeture de la page
      Cookies.remove('token');
      navigate('/login');
    };

    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><Link to="/admin/products">Produits</Link></li>
          <li><Link to="/admin/orders">Commandes</Link></li>
          <li><Link to="/admin/liked-products">Produits aimés</Link></li>
          <li><Link to="/admin/categories">Catégories</Link></li>
          <li><Link to="/admin/contacts">Messages</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/liked-products" element={<LikedProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contacts" element={<AdminContacts />} /> {/* Ajout de cette ligne */}
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
