import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories'; // Import du composant Categories

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <nav>
                <ul>
                    <li><Link to="/admin/products">Products</Link></li>
                    <li><Link to="/admin/orders">Orders</Link></li>
                    <li><Link to="/admin/liked-products">Liked Products</Link></li>
                    <li><Link to="/admin/categories">Categories</Link></li> {/* Nouveau lien pour Categories */}
                </ul>
            </nav>
            <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/liked-products" element={<LikedProducts />} />
                <Route path="/categories" element={<Categories />} /> {/* Route pour Categories */}
                <Route path="/" element={<Products />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
