import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBox, FaClipboardList, FaHeart, FaTags, FaEnvelope, FaCog, FaUser, FaWarehouse } from 'react-icons/fa';
import './AdminList.css';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState(''); // Champ pour le mot de passe
  const [sexe, setSexe] = useState(''); // Champ pour le sexe
  const roles = ['Moderateur', 'Admin principale', 'Admin']; // Liste des rôles disponibles

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/admins', { firstName, lastName, email, username, phone, role, password, sexe });
      fetchAdmins();
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPhone('');
      setRole('');
      setPassword(''); // Réinitialisation du champ de mot de passe
      setSexe(''); // Réinitialisation du champ de sexe
      alert('Admin added successfully');
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/admins/${id}`);
      fetchAdmins();
      alert('Admin deleted successfully');
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:3001/api/admins/${id}`, { role: newRole });
      fetchAdmins();
      alert('Admin role updated successfully');
    } catch (error) {
      console.error('Error updating admin role:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <button className="back-to-home" onClick={() => window.location.href = '/admin'}>Accueil Admin</button>
      <nav>
        <ul>
          <li><Link to="/admin/products"><FaBox /> Produits</Link></li>
          <li><Link to="/admin/orders"><FaClipboardList /> Commandes</Link></li>
          <li><Link to="/admin/likedProducts"><FaHeart /> Produits aimés</Link></li>
          <li><Link to="/admin/categories"><FaTags /> Catégories</Link></li>
          <li><Link to="/admin/contacts"><FaEnvelope /> Messages</Link></li>
          <li><Link to="/admin/admin-settings"><FaCog /> Paramètres</Link></li>
          <li><Link to="/admin/stock-history"><FaWarehouse /> Historique des Stocks</Link></li>
          <li><Link to="/admin/admin-users"><FaUser /> Utilisateurs</Link></li>
          <li><Link to="/admin/suppliers"><FaWarehouse /> Fournisseurs</Link></li>
        </ul>
      </nav>
      <div className="admin-list-container">
        <h2>Admin List</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={sexe} onChange={(e) => setSexe(e.target.value)} required>
            <option value="">Select Sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            {roles.map(roleOption => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
          <button type="submit" className="add-button">Add Admin</button>
        </form>
        <ul className="admin-list">
          {admins.map(admin => (
            <li key={admin.id} className="admin-item">
              <div className="admin-details">
                <span className="admin-name">{admin.firstName} {admin.lastName}</span>
                <span className="admin-email">{admin.email}</span>
                <span className="admin-username">{admin.username}</span>
                <span className="admin-phone">{admin.phone}</span>
                <span className="admin-role">
                  <select value={admin.role} onChange={(e) => handleRoleChange(admin.id, e.target.value)}>
                    {roles.map(roleOption => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </span>
                <span className="admin-sexe">{admin.sexe}</span>
              </div>
              <button onClick={() => handleDelete(admin.id)} className="delete-button">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminList;
