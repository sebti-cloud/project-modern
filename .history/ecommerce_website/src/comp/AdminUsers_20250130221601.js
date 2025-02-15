import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FaBox, FaClipboardList, FaHeart, FaTags, FaEnvelope, FaUserShield, FaCog, FaWarehouse } from 'react-icons/fa'; // Importer des icônes depuis react-icons
import './admin.css';

Modal.setAppElement('#root'); // Assurez-vous que l'élément root est défini pour l'accessibilité

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const navigate = useNavigate();

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

  const openModal = (photo) => {
    setCurrentPhoto(photo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentPhoto('');
  };

  const goToUserActivity = (userId) => {
    navigate(`/user-activities/${userId}`);
  };

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><Link to="/admin/products"><FaBox /> Produits</Link></li>
          <li><Link to="/admin/orders"><FaClipboardList /> Commandes</Link></li>
          <li><Link to="/admin/likedProducts"><FaHeart /> Produits aimés</Link></li>
          <li><Link to="/admin/categories"><FaTags /> Catégories</Link></li>
          <li><Link to="/admin/contacts"><FaEnvelope /> Messages</Link></li>
          <li><Link to="/admin/admins"><FaUserShield /> Administrateurs</Link></li>
          <li><Link to="/admin/admin-settings"><FaCog /> Paramètres</Link></li>
          <li><Link to="/admin/suppliers"><FaWarehouse /> Fournisseurs</Link></li>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(user.photo ? `http://localhost:3001${user.photo}` : 'http://localhost:3001/uploads/download.png');
                    }}
                    style={{ cursor: 'pointer' }}
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
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="User Photo"
          className="modal"
          overlayClassName="overlay"
        >
          <button onClick={closeModal} className="close-button">X</button>
          <img src={currentPhoto} alt="User" className="modal-photo" />
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsers;
