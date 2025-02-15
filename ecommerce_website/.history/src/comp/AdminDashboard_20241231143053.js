import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import jwtDecode from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Token décodé:', decodedToken);

        // Vérification de l'expiration du token
        const currentTime = Date.now() / 1000; // Temps actuel en secondes
        if (decodedToken.exp < currentTime) {
          console.log('Le token a expiré');
          setIsAuthenticated(false);
          navigate('/login');
        } else {
          setRole(decodedToken.role);
          setIsAuthenticated(true);
          console.log('Authentification réussie'); // Log pour vérifier que l'authentification a réussi
        }
      } catch (err) {
        console.error('Erreur de décodage du token:', err);
        setIsAuthenticated(false);
        navigate('/login');
      }
    } else {
      console.log('Aucun token trouvé');
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated); // Log pour vérifier l'état d'authentification
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    console.log('Redirection vers la page de login'); // Log pour vérifier la redirection
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
