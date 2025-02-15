import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode'; // Correct usage of named import
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token); // Correct usage of jwt_decode
        setRole(decodedToken.role);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid token');
        setIsAuthenticated(false);
        navigate('/login');
      }
    } else {
      setIsAuthenticated(false);
      navigate('/login');
    }

    const handleUnload = () => {
      Cookies.remove('token');
      navigate('/login');
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin-dashboard">
      {role === 'admin_principale' ? (
        <h1>Admin Principale</h1>
      ) : (
        <h1>Admin</h1>
      )}
      <nav>
        <ul>
          <li><Link to="/Products">Produits</Link></li>
          <li><Link to="/Orders">Commandes</Link></li>
          <li><Link to="/LikedProducts">Produits aimés</Link></li>
          <li><Link to="/Categories">Catégories</Link></li>
          <li><Link to="/Contacts">Messages</Link></li>
          {role === 'admin_principale' && <li><Link to="/Admins">Administrateurs</Link></li>}
        </ul>
      </nav>
      <Routes>
        <Route path="/Products" element={<Products />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/LikedProducts" element={<LikedProducts />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/Contacts" element={<AdminContacts />} />
        {role === 'admin_principale' && <Route path="/Admins" element={<AdminList />} />}
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
