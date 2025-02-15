import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/admin/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Failed to add new admin');
      }

      setMessage('Admin added successfully!');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleAddAdmin}>
      <h1>Add New Admin</h1>
      {message && <p>{message}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Add Admin</button>
    </form>
  );
};

export default AddAdmin;
