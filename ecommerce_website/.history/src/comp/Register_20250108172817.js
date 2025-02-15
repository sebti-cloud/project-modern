/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate pour la redirection
import Cookies from 'js-cookie'; // Importez js-cookie pour gérer les cookies
import './register.css'; // Importer le fichier CSS

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const navigate = useNavigate(); // Initialisez useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        Cookies.set('token', data.token); // Stockez le jeton dans les cookies
        navigate('/profile'); // Redirigez vers /profile après l'inscription réussie
        window.location.reload(); // Actualisez la page
      } else {
        alert('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-container">
          <h2>S'inscrire</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group name">
              <label>Nom</label>
              <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            </div>
            <div className="input-group email">
              <label>Email</label>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div className="input-group password">
              <label>Mot de passe</label>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
            <div className="input-group phone">
              <label>Téléphone</label>
              <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
            </div>
            <div className="input-group address">
              <label>Adresse</label>
              <textarea name="address" placeholder="Address" onChange={handleChange} ></textarea>
            </div>
            <button type="submit" className="register-button">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate pour la redirection
import Cookies from 'js-cookie'; // Importez js-cookie pour gérer les cookies
import './register.css'; // Importer le fichier CSS

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // Déclarez l'état errorMessage
  const [successMessage, setSuccessMessage] = useState(''); // Déclarez l'état successMessage
  const navigate = useNavigate(); // Initialisez useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialiser le message d'erreur
    setSuccessMessage(''); // Réinitialiser le message de succès
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('User registered successfully'); // Définir le message de succès
        Cookies.set('token', data.token); // Stockez le jeton dans les cookies
        navigate('/profile'); // Redirigez vers /profile après l'inscription réussie
        window.location.reload(); // Actualisez la page
      } else {
        setErrorMessage('Failed to register user'); // Définir le message d'erreur
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Failed to register user'); // Définir le message d'erreur
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-container">
          <h2>S'inscrire</h2>
          {errorMessage && (
            <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-group name">
              <label>Nom</label>
              <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            </div>
            <div className="input-group email">
              <label>Email</label>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div className="input-group password">
              <label>Mot de passe</label>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
            <div className="input-group phone">
              <label>Téléphone</label>
              <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
            </div>
            <div className="input-group address">
              <label>Adresse</label>
              <textarea name="address" placeholder="Address" onChange={handleChange} ></textarea>
            </div>
            <button type="submit" className="register-button">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
