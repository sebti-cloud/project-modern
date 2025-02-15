import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login.css';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        Cookies.set('userToken', data.token); // Stocke le token utilisateur
        localStorage.setItem('userToken', data.token); // Optionnel : Stocke le token dans le localStorage
        setIsAuthenticated(true);
        await fetch('http://localhost:3001/api/user-logins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: data.userId })
        });
        navigate('/profile');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      setErrorMessage('Failed to log in');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <h2>Connexion</h2>
          {errorMessage && (
            <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div className="input-group password">
              <label>Mot de passe</label>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
            <button type="submit" className="login-button">Se connecter</button>
            <button type="button" className="google-login-button" onClick={handleGoogleLogin}>Se connecter avec Google</button>
          </form>
          <p className="signup-link">
            Pas de compte ? <a href="/register">S'inscrire</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
