import React from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="admin-nav">
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/orders">Orders</Link>
                <Link to="/admin/liked-products">Liked Products</Link> {/* Nouveau lien pour Liked Products */}
            </div>
        </div>
    );
};

export default AdminDashboard;
