import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaClipboardList, FaHeart, FaTags, FaUserShield, FaCog, FaUser, FaWarehouse } from 'react-icons/fa'; // Importer des icônes depuis react-icons
import './admin.css';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'validated':
        return 'Validé';
      default:
        return status;
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== id));
        setAlert({ message: 'Message supprimé avec succès', type: 'error' });
      } else {
        setAlert({ message: 'Échec de la suppression du message', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      setAlert({ message: 'Erreur lors de la suppression du message', type: 'error' });
    }
  };

  const handleValidate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/contacts/${id}/validate`, {
        method: 'PUT',
      });
      if (response.ok) {
        const updatedContacts = contacts.map(contact =>
          contact.id === id ? { ...contact, status: 'validated' } : contact
        );
        setContacts(updatedContacts);
        setAlert({ message: 'Message validé avec succès', type: 'success' });
      } else {
        setAlert({ message: 'Échec de la validation du message', type: 'error' });
      }
    } catch (error) {
      console.error('Error validating contact:', error);
      setAlert({ message: 'Erreur lors de la validation du message', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-dashboard">
      <button className="back-to-home" onClick={() => window.location.href = '/admin'}>Accueil Admin</button>
      <nav>
        <ul>
          <li><Link to="/products"><FaBox /> Produits</Link></li>
          <li><Link to="/orders"><FaClipboardList /> Commandes</Link></li>
          <li><Link to="/likedProducts"><FaHeart /> Produits aimés</Link></li>
          <li><Link to="/categories"><FaTags /> Catégories</Link></li>
          <li><Link to="/admins"><FaUserShield /> Administrateurs</Link></li>
          <li><Link to="/admin-settings"><FaCog /> Paramètres</Link></li>
          <li><Link to="/admin-users"><FaUser /> Utilisateurs</Link></li>
          <li><Link to="/suppliers"><FaWarehouse /> Fournisseurs</Link></li>
        </ul>
      </nav>
      <div className="contacts">
        <h2 className="contacts-header">Messages de Contact</h2>
        {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}
        <table className="contacts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td>{formatDate(contact.date)}</td>
                <td>{contact.phone}</td>
                <td>{translateStatus(contact.status)}</td>
                <td>
                  <button className="button validate" onClick={() => handleValidate(contact.id)}>Valider</button>
                  <button className="button delete" onClick={() => handleDelete(contact.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContacts;
