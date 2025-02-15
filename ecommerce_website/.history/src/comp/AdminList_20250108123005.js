import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importez Link
import './AdminList.css'; // Fichier CSS pour le style
import { FaEnvelope } from 'react-icons/fa'; // Importez l'icône


const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
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
      await axios.post('http://localhost:3001/api/admins', { firstName, lastName, email, username, phone, role });
      fetchAdmins();
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPhone('');
      setRole('');
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
      <div className="admin-message-link">
        <Link to="/contacts" className="message-link">
          <FaEnvelope className="message-icon" /> Messages
        </Link> {/* Lien vers AdminContacts avec une icône */}
      </div>
      <nav>
        <ul>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
          <li><Link to="/likedProducts">Produits aimés</Link></li>
          <li><Link to="/categories">Catégories</Link></li>
          <li><Link to="/admins">Administrateurs</Link></li>
          <li><Link to="/admin-settings">Settings</Link></li>
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
