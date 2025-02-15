import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import TopProducts from './TopProducts'; // Import du composant TopProducts

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><Link to="/admin/products">Products</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/liked-products">Liked Products</Link></li>
          <li><Link to="/admin/categories">Categories</Link></li>
          <li><Link to="/admin/top-products">Top Products</Link></li> {/* Nouveau lien pour TopProducts */}
        </ul>
      </nav>
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/liked-products" element={<LikedProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/top-products" element={<TopProducts />} /> {/* Route pour TopProducts */}
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
