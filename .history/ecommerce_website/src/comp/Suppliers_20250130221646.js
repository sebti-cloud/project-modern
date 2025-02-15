import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaClipboardList, FaHeart, FaTags, FaEnvelope, FaUserShield,FaWarehouse, FaUser, FaCog } from 'react-icons/fa'; // Importer des icônes depuis react-icons
import './admin.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', email: '', phone: '', address: '' });
  const [editSupplier, setEditSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editSupplier) {
      setEditSupplier({ ...editSupplier, [name]: value });
    } else {
      setNewSupplier({ ...newSupplier, [name]: value });
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSupplier)
      });
      if (response.ok) {
        fetchSuppliers();
        setNewSupplier({ name: '', contact: '', email: '', phone: '', address: '' });
        alert('Supplier added successfully!', 'alert-success');
      } else {
        const errorText = await response.text();
        alert(`Failed to add supplier: ${errorText}`, 'alert-danger');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditSupplier(supplier);
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/suppliers/${editSupplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editSupplier)
      });
      if (response.ok) {
        fetchSuppliers();
        setEditSupplier(null);
        alert('Supplier updated successfully!', 'alert-success');
      } else {
        const errorText = await response.text();
        alert(`Failed to update supplier: ${errorText}`, 'alert-danger');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/suppliers/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchSuppliers();
        alert('Supplier deleted successfully!', 'alert-success');
      } else {
        alert('Failed to delete supplier.', 'alert-danger');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
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
          <li><Link to="/admin/admins"><FaUserShield /> Administrateurs</Link></li>
          <li><Link to="/admin/stock-history"><FaWarehouse /> Historique des Stocks</Link></li>
          <li><Link to="/admin/admin-users"><FaUser /> Utilisateurs</Link></li>
          <li><Link to="/admin/admin-settings"><FaCog /> Paramètres</Link></li>
        </ul>
      </nav>

      <div className="actions">
        <form onSubmit={editSupplier ? handleUpdateSupplier : handleAddSupplier}>
          <input type="text" name="name" placeholder="Name" value={editSupplier ? editSupplier.name : newSupplier.name} onChange={handleChange} required />
          <input type="text" name="contact" placeholder="Contact" value={editSupplier ? editSupplier.contact : newSupplier.contact} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={editSupplier ? editSupplier.email : newSupplier.email} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" value={editSupplier ? editSupplier.phone : newSupplier.phone} onChange={handleChange} required />
          <textarea name="address" placeholder="Address" value={editSupplier ? editSupplier.address : newSupplier.address} onChange={handleChange} required />
          <button type="submit">{editSupplier ? 'Update Supplier' : 'Add Supplier'}</button>
        </form>
      </div>

      <table className="suppliers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contact}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.address}</td>
              <td>
                <button onClick={() => handleEditSupplier(supplier)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteSupplier(supplier.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Suppliers;
