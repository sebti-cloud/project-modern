import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './AdminLogin.css';

const AdminLogin = ({ setIsAdminAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }) // Assure-toi que les données sont correctement envoyées
      });
      const data = await response.json();
      if (response.ok) {
        Cookies.set('adminToken', data.token); // Stocke le token dans un cookie séparé pour les admins
        setIsAdminAuthenticated(true); // Met à jour l'état d'authentification de l'admin
        navigate('/admin');
      } else {
        setMessage(data.message || 'Failed to login');
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h1>Admin Login</h1>
      {message && <p>{message}</p>}
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default AdminLogin;
