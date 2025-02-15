import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('Token récupéré:', token); // Log pour vérifier la récupération du token
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Token décodé:', decodedToken); // Log pour vérifier le décodage du token
        setRole(decodedToken.role);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Erreur de décodage du token:', err); // Log pour les erreurs de décodage
        setIsAuthenticated(false);
        navigate('/login');
      }
    } else {
      console.log('Aucun token trouvé'); // Log si aucun token n'est trouvé
      setIsAuthenticated(false);
      navigate('/login');
    }
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
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
          <li><Link to="/likedProducts">Produits aimés</Link></li>
          <li><Link to="/categories">Catégories</Link></li>
          <li><Link to="/contacts">Messages</Link></li>
          {role === 'admin_principale' && <li><Link to="/admins">Administrateurs</Link></li>}
        </ul>
      </nav>
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/likedProducts" element={<LikedProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contacts" element={<AdminContacts />} />
        {role === 'admin_principale' && <Route path="/admins" element={<AdminList />} />}
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
