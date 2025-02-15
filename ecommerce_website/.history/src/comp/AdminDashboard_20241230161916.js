import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode'; // Assurez-vous d'utiliser cette syntaxe
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Récupérer et décoder le token
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwt_decode(token); // Utilisation correcte de jwt_decode
      setRole(decodedToken.role);
    }

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

  useEffect(() => {
    // Récupérer les administrateurs triés
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('/api/admins');
        setAdmins(response.data);
      } catch (err) {
        console.error('Error fetching admins:', err);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Titre basé sur le rôle de l'administrateur */}
      {role === 'admin_principale' ? (
        <h1>Admin Principale</h1>
      ) : (
        <h1>Admin</h1>
      )}
      
      {/* Afficher la liste des administrateurs */}
      <ul>
        {admins.map(admin => (
          <li key={admin.id}>{admin.username} - {admin.role}</li>
        ))}
      </ul>

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
        <Route path="/contacts" element={<AdminContacts />} />
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
