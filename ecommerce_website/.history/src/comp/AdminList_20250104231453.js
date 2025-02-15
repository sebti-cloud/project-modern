import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

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
      const response = await axios.post('http://localhost:3001/api/admins', { name, email, role });
      fetchAdmins();
      setName('');
      setEmail('');
      setRole('');
      alert('Admin added successfully');
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/admins/${id}`);
      fetchAdmins();
      alert('Admin deleted successfully');
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  return (
    <div>
      <h2>Admin List</h2>
      <ul>
        {admins.map(admin => (
          <li key={admin.id}>
            {admin.name} - {admin.email} - {admin.role}
            <button onClick={() => handleDelete(admin.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <button type="submit">Add Admin</button>
      </form>
    </div>
  );
};

export default AdminList;
