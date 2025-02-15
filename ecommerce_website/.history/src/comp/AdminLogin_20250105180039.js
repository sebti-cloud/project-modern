import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login.css'; // Vous pouvez utiliser les mêmes styles que pour la page de connexion des clients

const AdminLogin = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        Cookies.set('token', data.token); // Stocker le token JWT dans les cookies
        Cookies.set('role', data.role); // Stocker également le rôle de l'utilisateur dans les cookies
        setIsAuthenticated(true); // Mise à jour de l'état d'authentification
        alert('Login successful');
        navigate('/admin'); // Rediriger vers la page d'administration
      } else {
        alert('Failed to login');
      }
    } catch (error) {
      console.error('Error logging in admin:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <h2>Admin Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group password">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-button">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
