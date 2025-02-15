import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';

const AdminDashboard = () => {
    return (
        <Router>
            <div className="admin-dashboard">
                <nav>
                    <ul>
                        <li><Link to="/admin/products">Products</Link></li>
                        <li><Link to="/admin/orders">Orders</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/" element={<Products />} />
                </Routes>
            </div>
        </Router>
    );
};

export default AdminDashboard;
