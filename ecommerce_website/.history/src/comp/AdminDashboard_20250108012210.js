import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import './admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/likedProducts" element={<LikedProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contacts" element={<AdminContacts />} />
        <Route path="/admins" element={<AdminList />} />
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;