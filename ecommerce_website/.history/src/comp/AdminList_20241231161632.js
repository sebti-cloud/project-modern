import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: '' });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admins', newAdmin);
      setAdmins((prevAdmins) => [...prevAdmins, response.data]);
      setNewAdmin({ username: '', password: '', role: '' });
    } catch (err) {
      console.error('Error adding admin:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
          <li><Link to="/likedProducts">Produits aimés</Link></li>
          <li><Link to="/categories">Catégories</Link></li>
          <li><Link to="/contacts">Messages</Link></li>
          <li><Link to="/admins">Administrateurs</Link></li>
        </ul>
      </nav>
      <div className="admin-list">
        <h2>Liste des Administrateurs</h2>
        <ul>
          {admins.map(admin => (
            <li key={admin.id}>{admin.username} - {admin.role}</li>
          ))}
        </ul>
        
        <form onSubmit={handleSubmit}>
          <h2>Ajouter un nouvel administrateur</h2>
          <input
            type="text"
            name="username"
            value={newAdmin.username}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
            required
          />
          <input
            type="password"
            name="password"
            value={newAdmin.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            required
          />
          <select name="role" value={newAdmin.role} onChange={handleChange} required>
            <option value="">Sélectionner un rôle</option>
            <option value="admin">Admin</option>
            <option value="admin_principale">Admin Principale</option>
          </select>
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default AdminList;
