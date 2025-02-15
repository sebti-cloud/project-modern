import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import './admin.css';

const AdminDashboard = ({ role }) => {
  return (
    <div className="admin-dashboard">
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/likedProducts" element={<LikedProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contacts" element={<AdminContacts />} />
        {role === 'Admin principale' || role === 'Moderateur' ? (
          <Route path="/admins" element={<AdminList />} />
        ) : (
          <Route path="/admins" element={<div>You do not have permission to manage admins.</div>} />
        )}
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
