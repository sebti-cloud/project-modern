import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <nav>
                <ul>
                    <li><Link to="/admin/products">Products</Link></li>
                    <li><Link to="/admin/orders">Orders</Link></li>
                    <li><Link to="/admin/liked-products">Liked Products</Link></li> {/* Nouveau lien pour Liked Products */}

                </ul>
            </nav>
            <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/" element={<Products />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
