import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users');
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const goToUserActivity = (userId) => {
    history.push(`/user-activities/${userId}`);
  };

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><a href="/admin">Dashboard</a></li>
          <li><a href="/products">Produits</a></li>
          <li><a href="/orders">Commandes</a></li>
          <li><a href="/categories">Catégories</a></li>
          <li><a href="/likedProducts">Produits aimés</a></li>
          <li><a href="/contacts">Messages</a></li>
          <li><a href="/admins">Administrateurs</a></li>
          <li><a href="/admin-settings">Settings</a></li>
          <li><a href="/admin-users">Utilisateurs</a></li>
        </ul>
      </nav>
      <div className="users">
        <h2 className="users-header">Utilisateurs</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Date de Création</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} onClick={() => goToUserActivity(user.id)} style={{ cursor: 'pointer' }}>
                <td>{user.id}</td>
                <td>
                  <img
                    src={user.photo ? `http://localhost:3001${user.photo}` : 'http://localhost:3001/uploads/download.png'}
                    alt={user.name}
                    className="user-photo"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
